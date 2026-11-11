---
title: "Eight OpenCode Subagents, One Tracker, and the Problem of Who Gets to Write"
category: ['Engineering']
tags: ["engineering", "concurrency", "agents", "reliability", "opencode"]
img: /assets/opencode-subagents-tracker.webp
description: "How I designed a resumable job-scoring pipeline with eight OpenCode subagents, durable receipts, strict write ownership, and safe recovery after interruptions."
date: "2026-10-09"
draft: false
---

Eight workers sounded like the easy part. The hard part was deciding which one was allowed to change the answer.

My Career-Ops project scans job boards, evaluates roles against my background, and tracks each requisition through a pipeline. A single run can find new jobs while older ones are still waiting in **Pending**. Full evaluations take time: a worker has to confirm that the employer posting is live, read the whole job description, write a report, and produce a tracker row. Running those evaluations one by one was an obvious bottleneck.

Parallelism looked attractive until I followed the writes. If eight workers can all edit the same tracker and inbox, a crash or a late result can leave me with duplicate rows, a missing report, or a job marked complete when its evaluation never made it to disk. I needed concurrency for the expensive work and a much narrower path for changing shared state.

## Four stages, different jobs

I split the run into four stages. **A** scans configured sources. **B** evaluates individual requisitions. **C** verifies the results and updates tracker status. **D** moves items out of Pending after the tracker and report can be read back.

These stages run at the same time; they do not wait for one giant scan to finish. Existing Pending jobs can enter B immediately, and C can process a completed B receipt while other evaluations are still running. D follows only after C has classified an item.

The boundary matters more than the letters:

- **A — discovery:** new candidates and source coverage results.
- **B — evaluation:** one assigned report, one tracker TSV, one receipt.
- **C — classification:** verified tracker and status changes through a locked helper.
- **D — drain:** a verified Pending-to-Processed or Pending-to-Review transition.

B never writes the shared tracker or inbox. Its completed receipt is useful only when the report and TSV exist and agree on URL, report number, and score. C checks those artifacts before merging anything. A score below 3.0 becomes **Discarded**; 3.0 or above becomes **Evaluated**. D then checks the tracker and report again before moving the Pending item. A confirmed duplicate can go to Processed; an unreadable or uncertain posting goes to Review with a reason.

That is more work than appending a row, but it gives every status a chain of evidence. “The worker said it finished” is not a chain of evidence.

## Eight is a budget, not a target

The OpenCode implementation uses native subagents for A, B, C, and D, with a global cap of eight active subagents. Discovery gets at most two search slots. Evaluation borrows the remaining capacity. C and D each use one session and get first claim on a freed slot.

That last choice came from a less obvious failure mode. If B keeps filling every opening with another evaluation, completed receipts pile up but nothing classifies or drains them. The system appears busy while Pending never reaches zero. Giving C and D priority makes the run produce durable outcomes as it goes, not just more work in progress.

The shared browser lane is serial as well. API and parser scans can overlap; one interactive browser session cannot safely be treated like eight independent workers.

## What resume really means

Each native action carries a `runID` and `actionID`. The coordinator persists the child session, its claim, progress, and result on disk. On resume it checks the existing claim and its artifacts before asking another subagent to do the same job.

The awkward case is an interrupted parent with a child whose status cannot be read. Guessing that the child died could start a duplicate evaluation while the original is still writing. The coordinator pauses that lane instead of clearing an unknown claim. When a valid receipt is already present, it can recover the result without regenerating it.

I would not call this magical “exactly once” execution. A worker may be retried after a confirmed failure. The practical guarantee is narrower: preserve ownership, verify artifacts, and make shared transitions safe to repeat or refuse. That is the distinction that keeps an interrupted batch from silently turning into two batches.

## The test was not a victory lap

I verified the four agents were registered as native OpenCode subagents and ran the targeted suite: **81 of 81 tests passed**. The tests cover the coordinator, concurrency budget, receipts, and resume behavior.

I also hit a real infrastructure limit. A live run had **597 Pending** items when the model provider reported that all upstream accounts were inactive. The coordinator kept the backlog for a later resume; I did **not** claim that the live run had drained. The command was ready to resume when the provider returned.

That experience changed how I think about agent workflows. The interesting part is not how many agents you can launch. It is whether you can explain, after a failure, what each one owned, what it actually wrote, and which result the system is allowed to believe.
