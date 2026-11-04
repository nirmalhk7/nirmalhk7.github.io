---
title: "I Built a Go Agent Orchestrator Around SQLite Leases and Crash Recovery"
category: ['Engineering']
tags: ["go", "sqlite", "agents", "concurrency", "reliability"]
img: /assets/go-sqlite-agent-recovery.webp
description: "Inside my Go agent orchestrator: SQLite leases, idempotent requests, and durable checkpoints that keep interrupted coding workflows from starting over."
date: "2026-10-20"
draft: false
---

Getting an agent to write code is a satisfying demo. Deciding what it should do after the server restarts is a much less photogenic engineering problem.

Suppose the agent has finished implementation. Tests have passed. Review is done. Then publishing the pull request fails. When I press Resume, should it write the code again?

That question became very concrete while building **Whirlwind**, my local engineering orchestrator, originally called Khan. I wanted it to take work through planning, implementation, verification, review, and a GitHub PR. It also needed to stop for questions and approvals, switch providers when appropriate, and remember enough to continue after an interruption.

During the backend work, I found two recovery gaps: resuming a paused planner could skip its unanswered questions, and a publication failure could send a task back into coding. Neither required a more capable model. Both required a better answer to “where were we?”

Here is how I built that answer with Go, SQLite, and a deliberately explicit workflow.

## Give the workflow a place to live

The Go backend uses `net/http` for the API, `database/sql` with `modernc.org/sqlite` for storage, and separate packages for workflow decisions, provider execution, GitHub operations, repository context, and verification. The Next.js UI calls the backend through a same-origin API proxy.

The important boundary is between the workflow and an individual agent run. An agent receives work and returns a result. The workflow owns the decision to advance, ask a question, request a repair, or pause.

I stored tasks as versioned records. A simplified view of the normal path looks like this:

```text
planning → coding → review → publishing → pr_created
              ↑        |
              └─ repair┘
```

There are branches around that path. A planner can wait for answers. A critical change can wait for approval. Failed deterministic checks prevent review from starting. Those are meaningful states, so I needed them to survive beyond the goroutine currently doing the work.

Each record has a version. When a worker saves a transition, it supplies the version it read. A stale worker gets a conflict instead of silently overwriting a newer decision. Resource updates and their events share a transaction, which also gives the UI an ordered history to follow.

This made the database part of the execution model. Saving a task means committing the next point from which the system can continue.

## SQLite was a deployment decision

Whirlwind runs on one machine and works with local repositories and local agent processes. SQLite fit that shape. I could keep durable state without asking someone to operate a database service just to run their coding harness.

The initial store setup included:

```go
db.SetMaxOpenConns(1)

// Executed when opening the store:
// PRAGMA journal_mode=WAL
// PRAGMA foreign_keys=ON
// PRAGMA busy_timeout=5000
```

That single connection is intentional. Agent work can run concurrently, while database operations through this pool take turns. I kept transactions short and left model calls, subprocess execution, and GitHub requests outside them. Holding a transaction open while an agent thinks would be an expensive way to build a queue.

[SQLite's WAL mode](https://sqlite.org/wal.html) permits readers and a writer to proceed concurrently across suitable connections, but it still has one writer at a time. My single-connection pool is a further restriction; turning on WAL does not make my application perform simultaneous database reads and writes through that pool.

I also enabled foreign keys, versioned migrations, and a bounded busy timeout. These choices gave me a straightforward local storage model. I have no throughput benchmark here, and I would revisit the design if the product needed multiple hosts sharing work.

## A mutex forgets who owned the task

Inside one process, a mutex can stop two goroutines from doing the same thing. After that process dies, it has no memory to offer the next one.

I used database leases for ownership. A lease records a resource ID, an owner, an expiry, and a monotonically increasing **fencing token**. Claiming an absent or expired lease happens in a transaction. A live lease rejects a competing claim; a successful new claim advances the token.

Consider a task lease with token 12. Its worker stalls long enough for the lease to expire. Another worker claims the task and receives token 13. If the first worker wakes up, its token is now stale.

Renewal checks that distinction in SQL:

```sql
UPDATE leases
SET expires = ?
WHERE id = ?
  AND owner = ?
  AND fence = ?
  AND expires > ?;
```

Updating zero rows means renewal failed. Release also checks the owner and token, so an old worker cannot release a newer worker's lease.

The workflow claims a task lease for one minute and attempts renewal every fifteen seconds. A failed renewal cancels the task's Go context. The renewal loop also checks whether the task record still has the version the worker started with. A changed task invalidates that worker's view of the world.

This is a useful combination: leases express ownership, record versions reject stale saves, and [Go contexts](https://pkg.go.dev/context) carry the cancellation signal through the work.

There is a limit to that guarantee. The token is checked by my lease operations; GitHub and an arbitrary external process do not automatically understand it. Cancellation has to reach the code doing the work, and remote side effects need their own reconciliation. Calling a field `Fence` does not magically fence the internet.

## Retrying a request should not invent new work

A browser can lose a response after a successful mutation. A webhook can arrive again. Treating every arrival as a fresh command would make retries surprisingly creative.

For control API mutations, I required an `Idempotency-Key`. The server fingerprints the method, request URI, version precondition, and body. A matching retry can replay the stored response. Reusing the key for a different request produces a conflict.

The version precondition answers a different question. Idempotency asks whether this request already happened; the record version asks whether the caller is editing the state it actually saw. I needed both.

GitHub ingress has a separate identity: the webhook delivery ID. The backend verifies the webhook signature, records deliveries, and keeps a unique repository-and-issue mapping for tasks. Delivery receipts and issue identity address different forms of duplication: repeating the same delivery, and encountering an issue that already has a task.

None of this proves that every external action happens exactly once. It gives the local service enough durable identity to recognize retries and avoid creating fresh work simply because the network repeated itself.

## Resume the interrupted stage

The most revealing bug was the publication failure. “Retry the task” sounds sensible until the task contains several very different operations.

Re-entering coding after a publishing error can waste an entire implementation run and potentially change code that already passed review. Similarly, returning a paused planner to the wrong state can advance work without the answers it requested.

I made the recovery stage explicit. When a task fails, the engine preserves its current stage as `ResumeStage`, marks the task paused, saves the error, and creates a recovery notification. Resume uses that saved stage rather than guessing from a generic status.

The same principle applies within implementation. Parallel units have durable checkpoints, so interrupted integration can recognize completed unit work instead of reconstructing progress from whatever happens to be in memory.

At the process boundary, startup also has housekeeping to do. The server takes an exclusive data-directory lock and cleans up registered orphan processes. Restoring task state while an old child is still changing a worktree would leave two competing versions of reality.

I found it helpful to separate three recovery questions:

- **Where should this task continue?** The workflow stage and saved resume stage answer that.
- **Which implementation work already finished?** Unit checkpoints and integration progress record it.
- **Who is allowed to work on it now?** The lease owner, token, expiry, and record version establish that.

Keeping those answers separate made the recovery code easier to reason about. A single `running` boolean could never have carried all of them.

## Test the awkward transitions

The tests I cared about most were the ones around boundaries: competing claims, expired ownership, repeated requests, and transitions that must stop.

The implementation includes tests for concurrent lease claims and stale tokens, replayed mutations and version conflicts, signed webhook deduplication, pending planner questions on resume, and integration after an interruption. Workflow tests also check that failed verification blocks review and that critical changes wait for approval before PR publication.

For this article, I reran the targeted tests with Go's race detector. The earlier backend implementation also passed its full Go race suite, `go vet`, the web build, and six browser end-to-end tests. Those browser tests used fake external providers, including the issue-to-PR flow. They establish behavior in those fixtures; they do not establish that every live provider or network failure behaves perfectly.

That distinction matters for a system with permission to change repositories. I want specific evidence about what it does when something fails.

Whirlwind still runs locally, and this is not a claim about operating a distributed fleet. Building it did force me to make ownership, retries, and recovery concrete. The satisfying part is that a failed publish now has somewhere sensible to go: back to publishing, with the implementation work still accounted for.
