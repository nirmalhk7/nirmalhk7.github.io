---
title: "I Gave Coding Agents a Search Engine with SQLite FTS5 and MCP"
category: ['Engineering']
tags: ["go", "sqlite", "fts5", "mcp", "agents"]
img: /assets/sqlite-fts5-agent-memory.webp
description: "How I built searchable memory for coding agents with SQLite FTS5, weighted BM25, scoped MCP tools, and durable limits on what enters each prompt."
date: "2026-10-21"
draft: false
---

A notebook is useful only if you can find the entry you need. Give a coding agent every note from every previous task, and you have mostly built a very expensive reading assignment.

I ran into this while adding project memory to **Whirlwind**, my local engineering orchestrator. It has four agent roles: Ideation, Planner, Coding, and Reviewer. I wanted them to reuse lessons from earlier work without carrying the entire project history into every prompt.

The obvious question was also the right one: how does the agent know which notes matter before it has read them?

My answer was to put retrieval in the Go backend. Search the notebook first, deliver a small selection, and let the agent ask for another search when the task reveals something unexpected. That became a SQLite FTS5 index, a ranking policy, and an MCP tool called `search_lessons`.

The search function was only part of the work. I also had to decide which project a search could see, whether an old fix still applied, and whether restarting an agent should replenish its reading allowance. That last one is a surprisingly good way to turn a small context budget into an unlimited one.

## A lesson needs more structure than a paragraph

Whirlwind already stored lessons as records. Each has a trigger, a mistake to avoid, a correction, and supporting evidence. It can also carry file paths, symbols, an error signature, and source anchors used to check whether the relevant code has changed.

That structure matters because code has unusually good search terms. A reference to `internal/store/lessons.go` is often more useful than another paragraph containing the word “database.”

I scoped retrieval to the current project and agent role. The reviewer and coding agent may work in the same repository, but their immediate needs differ. Keeping those scopes explicit also prevents a lesson from one project quietly turning up as advice for another.

The scope comes from the running operation. It is not something the model gets to choose in its search arguments.

## FTS5 gave the notebook an index

The earlier matching approach relied on structured identifiers and prose substring matching. I wanted ranked text retrieval without introducing a separate search service into a local application that already used SQLite.

I added an FTS5 virtual table:

```sql
CREATE VIRTUAL TABLE lesson_search USING fts5(
  id UNINDEXED,
  project UNINDEXED,
  role UNINDEXED,
  trigger_text,
  mistake,
  correction,
  paths,
  symbols,
  error_signature
);
```

The first three columns identify and scope the records. `UNINDEXED` keeps them out of the full-text index; it does not enforce isolation. The query still has to filter by project and role.

The searchable fields get different weights. This is the prose-ranking portion of the query, simplified to show the scoring:

```sql
SELECT rowid,
       bm25(lesson_search, 0, 0, 0, 3, 2, 4, 8, 8, 10) AS score
FROM lesson_search
WHERE lesson_search MATCH ?
  AND project = ?
  AND role = ?
ORDER BY score
LIMIT 128;
```

In [SQLite's FTS5 implementation](https://www.sqlite.org/fts5.html#the_bm25_function), lower BM25 scores rank better. The weights above favor code identifiers and corrections over general prose. They are an explicit policy choice, not a result from a relevance benchmark.

The production query also filters active lesson states and combines text results with structured identifier matches. Exact paths, symbols, and error signatures take priority over prose ranking. A lesson tied to the precise failing function should not lose to a broad note simply because the broad note repeats more search terms.

I kept query construction bounded, too. The backend normalizes and deduplicates terms, quotes them, and builds an OR query with a maximum of 64 terms. A model's search string does not become arbitrary FTS syntax.

## Keep the index disposable

Adding search introduced a second representation of the same lesson. Now a correction could be updated in the main record while its old text survived in the index. Delightful: memory that remembers the wrong version.

I used an additive migration to create and backfill the index. SQLite triggers keep it synchronized with lesson inserts, updates, and deletes in the resource table. The lesson record remains the source of truth; the search table can be rebuilt from it.

Retirement also has to affect candidate selection. The query filters active states before filling its bounded prose candidate window, so retired records cannot occupy the slots intended for usable advice.

I added a regression for that case. A search system can return perfectly sorted results and still be wrong about which records were allowed to compete.

## Search the task, not the instructions

One of the more interesting fixes was deciding what to search for automatically.

The agent's complete prompt includes its role instructions and may already contain recalled lessons. Using that whole prompt as a query lets the retrieval system keep finding material related to its own boilerplate or earlier selections.

I narrowed automatic retrieval to task facts:

```go
func (a *agentRun) taskLearningQuery() string {
    facts := []string{
        a.task.Issue.Title,
        a.task.Issue.Body,
        a.task.Handoff.NextAction,
    }
    facts = append(facts, a.task.Handoff.FailingTests...)
    return strings.Join(facts, " ")
}
```

The tests distinguish static role instructions from handoff facts. A failing check belongs in the query. A standard instruction saying that the agent should write good tests does not.

This also makes a bad result easier to investigate. I can inspect the facts that produced the search instead of trying to disentangle them from a large assembled prompt.

## Recall must survive contact with changed code

After ranking, each candidate still has to qualify for delivery.

The backend checks source anchors against fingerprints in the current working tree. A mismatch or failed source read prevents recall, and the lesson is marked stale. The check happens before the advice enters the prompt.

Delivered lessons include their ID, version, status, correction, and evidence references. They are labeled advisory; tentative observations still require verification. That is a useful distinction when the stored material may describe a single earlier failure rather than a generally established rule.

I also deduplicate by lesson ID and version. If the agent searches again, getting the same note in a different order should not use more of its context allowance. A genuinely updated version can be considered separately.

None of this guarantees that a current-looking lesson is correct. It gives the agent and the run inspector something more accountable than an unattributed paragraph saying “we learned this before.”

## MCP handles the problem I could not predict at startup

Automatic recall happens before the agent starts work. The useful search term may appear only after a compiler error, a failed check, or an unfamiliar API turns up.

I exposed a small [MCP tool](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) using the Go SDK:

```json
{
  "name": "search_lessons",
  "arguments": {
    "query": "current error or relevant source identifier"
  }
}
```

The only input is the query. The running attempt supplies the project, role, and operation identity. The handler searches within that scope and returns compact advice.

For the MCP path, a stdio server connects to an attempt-scoped loopback endpoint. That endpoint uses a random credential, rejects unknown request fields, limits request size, and closes with the attempt. Other provider transports have adapters for the same memory capability.

I marked the tool as read-only, but the actual implementation carries the responsibility for enforcing its scope. A tool annotation is descriptive metadata. It cannot substitute for the server deciding which records the caller can access.

## The allowance lives in SQLite, too

I gave automatic recall a maximum of three lessons inside a 2 KiB block. On-demand search has a separate allowance: two calls per operation, up to 2 KiB per delivered response and 4 KiB across those responses.

Those are byte limits, not token counts. The distinction is especially relevant when notes contain non-ASCII text.

I persist the accounting in SQLite. The budget key includes the project, task, plan version, role, unit, purpose, operation ID, and stage. Resuming the same logical operation does not get a fresh allowance simply because a provider attempt restarted.

Reservation happens transactionally before search. A failed search still consumes a call. Otherwise an agent could retry a broken query indefinitely without ever reaching its limit.

Delivery records are transactional as well. They track bytes and seen lesson versions; competing deliveries cannot both claim the same version as newly recalled advice. The tests exercise these cases across concurrent reservations and separate store connections.

For a feature called “memory,” a fair amount of the work went into preventing repeated reading.

## Where semantic search fits

I also added an optional semantic path through a configured embedding endpoint. It stays off by default and requires a stored evaluation result before activation. When enabled, reciprocal rank fusion combines lexical and semantic rankings while preserving priority for exact code identifiers.

Endpoint failures fall back to text search with a warning. Queries matching the credential detector stay local rather than being sent to the embedding service.

That is a detector, not a proof that every sensitive string can be recognized. The baseline FTS5 path does not require an embedding service, and I have not measured an end-to-end improvement in agent accuracy from the optional path.

## What I verified

For this write-up, I reran focused Go race tests across the store, workflow, memory bridge, and provider packages. They cover ranked retrieval, automatic query construction, concurrent budget handling, version deduplication, and MCP tool calls through the SDK transport.

The bridge tests also check credential enforcement and shutdown, and the workflow tests check that an agent can find an unexpected lesson during work without resetting its budget.

These are tests of retrieval behavior and protocol fixtures. Live model probes remain unrun, so I cannot claim that the agents now solve more tasks correctly or finish them faster.

What I can inspect is much more concrete: which query ran, which lesson version matched, why it ranked, whether its source anchors still matched, and how much advice reached the agent.

That is the part of memory I wanted to build first. The notebook can grow; each agent still has to find a useful page.
