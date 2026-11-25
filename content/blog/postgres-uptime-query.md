---
title: "1,825 Blocks to 33: Fixing a PostgreSQL Uptime Query"
category: ['Engineering']
tags: ["postgresql", "go", "sql", "query-planning", "testing", "prometheus"]
img: /assets/postgres-uptime-query.webp
description: "How I rewrote a Go service's PostgreSQL uptime scorer around an existing composite index, then tested buffer usage, exact percentages, and failure metrics."
date: "2026-11-12"
draft: false
---

The query was using an index. That was the irritating part.

While working on SoHoLINK's uptime scorer, I ended up with a PostgreSQL query that produced the right percentages and still did more work than it needed to. On an isolated PostgreSQL 16 fixture, its heartbeat scan recorded 1,825 buffer accesses. A rewrite brought that to 33, using the same index.

Those numbers describe one test fixture, not production traffic or a 55× application speedup. The interesting bit is why an indexed query needed the rewrite at all.

## Seven days of heartbeats, one percentage

SoHoLINK records node heartbeats and periodically updates each node's uptime percentage. At one expected heartbeat every 30 seconds, a complete seven-day window contains:

```text
7 days × 24 hours × 60 minutes × 2 heartbeats = 20,160
```

The scorer counts events newer than the seven-day cutoff, divides by 20,160, and caps the percentage at 100. A node with no recent events gets zero. Duplicate heartbeat events count separately; this change did not introduce deduplication or redefine uptime.

The original Go implementation read counts and wrote scores node by node. I moved the calculation into a single SQL update, avoiding the application loop and its separate writes. That also meant a database error could fail the statement as a unit instead of leaving an already-written subset of scores behind.

But “one SQL statement” was only the first improvement.

## The index was there. The leading predicate wasn't.

My first SQL version grouped recent heartbeats across nodes, joined those counts back to the node table, and updated the scores. Its counting step looked like this:

```sql
SELECT node_id, COUNT(*) AS count
FROM node_heartbeat_events
WHERE recorded_at > NOW() - INTERVAL '7 days'
GROUP BY node_id;
```

The existing index was ordered by `(node_id, recorded_at DESC)`. The query above constrains time, but not the leading `node_id` column.

For a multicolumn B-tree, an equality condition on the leading column followed by a range condition on the next column can narrow the scanned portion of the index. PostgreSQL's [multicolumn index documentation](https://www.postgresql.org/docs/16/indexes-multicolumn.html) describes that relationship. Having both columns somewhere in the index doesn't make every query shape equally selective.

The fixture made the mismatch visible. I seeded eight nodes with 60,000 old events each, aged 28 days, plus 32 recent events each. That's 480,000 stale events surrounding just 256 useful ones. Then I ran `ANALYZE` so the planner had statistics for that data.

The broad aggregation's executed plan used an `Index Only Scan`. It still recorded 1,825 heartbeat-scan buffer accesses. “Uses index” was a very generous acceptance criterion.

I changed the update to count each node's recent range directly:

```sql
UPDATE nodes n
SET uptime_pct = LEAST(
    (SELECT COUNT(*)
     FROM node_heartbeat_events e
     WHERE e.node_id = n.id
       AND e.recorded_at > NOW() - INTERVAL '7 days')::numeric
    / 20160 * 100,
    100
);
```

Now the count supplies both parts of the index lookup: this node, then its recent timestamps. It remains one statement from Go; the correlated subquery doesn't turn into eight application round trips.

There is also no special join case for an empty history. `COUNT(*)` returns zero, so every node receives a score, including nodes with no qualifying heartbeat events.

No new index, schema migration, or retention policy was needed.

## Measure the statement the service actually runs

I didn't want a test that explained a carefully maintained copy of the query while the real scorer quietly changed somewhere else.

The regression test attaches a pgx query tracer, calls `scoreUptime`, and captures the statement it actually executes. It checks that scoring issues exactly one statement, then runs that captured SQL with:

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
```

That executes the update again. It belongs in a disposable test database: [`EXPLAIN ANALYZE` runs the statement](https://www.postgresql.org/docs/16/sql-explain.html), including its writes.

The test walks the JSON plan and counts shared buffer hits plus reads at the heartbeat relation's scan nodes. It doesn't sum every parent and child, which would count the same work repeatedly.

On the recorded fixture runs:

```text
Broad aggregation:        1,825 heartbeat-scan buffer accesses
Per-node indexed count:      33 heartbeat-scan buffer accesses
```

Both runs reported these accesses as cache hits, with zero shared reads at the heartbeat scan. These are buffer accesses, not 1,825 distinct disk blocks fetched from storage. The updated plan was called an index-only scan, but also reported 256 heap fetches. Plan names need their supporting details.

The test asserts a budget of at most 256 heartbeat-scan buffer accesses rather than demanding exactly 33. Thirty-three is an observation from that run; the budget is the regression guard. The full plan is logged so a failure has something useful to say.

This fixture exercises a specific concern: lots of retained history, few recent events, and a small node set. A different node count, cache state, or data distribution can favor a different plan. I would remeasure before treating correlated counts as a universal answer.

## The decimal places deserved their own review

Moving arithmetic from Go floating point into PostgreSQL `numeric` also changed a few stored values. A performance patch that quietly changes a score is an excellent way to earn a second review.

The destination column is `NUMERIC(5,2)`. With SQL numeric arithmetic, five heartbeat counts stored a result 0.01 higher than the old floating-point calculation: 2,898, 5,166, 6,426, 10,962, and 12,222. For example, 2,898 events now persist as 14.38 rather than 14.37.

I documented those differences and pinned all five with exact-value tests. None crosses the existing 85% or 95% classification thresholds. Another case checks 19,152 events explicitly: that is exactly 95.00% of 20,160.

The tests call the scorer directly instead of sleeping through ticker intervals. Each node starts with a sentinel score of 17.00, so a missing update can't accidentally pass an expectation of zero. Coverage includes empty histories, stale-only histories, a full window, and counts above the cap.

That is a more useful definition of “same behavior” than checking whether the query returned without an error.

## Failed attempts need duration samples too

I added `soholink_uptime_scorer_duration_seconds` to measure each scoring attempt. The Go wrapper starts a timer and defers the histogram observation, so a database failure still contributes a duration sample.

The metric test checks both a successful call and a call with a cancelled context. It verifies that cancellation is returned to the caller and that both attempts increment the histogram's observation count. A slow failing scorer shouldn't disappear from the very measurement intended to describe its runtime.

The existing worker still logs an error and tries again on the next tick. The metric observes that behavior; it doesn't add a new retry mechanism.

The [implementation and regression tests](https://github.com/NTARI-RAND/SoHoLINK/tree/7d00df52161b90f94a07c123ff1ccfb764964298/internal/store) are available alongside the [scoring notes](https://github.com/NTARI-RAND/SoHoLINK/blob/7d00df52161b90f94a07c123ff1ccfb764964298/docs/uptime-scoring.md). The work was submitted in [SoHoLINK PR #25](https://github.com/NTARI-RAND/SoHoLINK/pull/25); the measurements here come from its isolated review fixture.

The useful question turned out to be much narrower than “is this query indexed?” It was: which part of this index can PostgreSQL skip? Getting that question right took the heartbeat scan from 1,825 buffer accesses to 33—and gave me a regression test that knows why.
