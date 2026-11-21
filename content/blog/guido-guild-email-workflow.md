---
title: "An Email Isn’t a Job Queue: Coordinating Guild.AI Runs, Retries, and Replies"
category: ['Engineering']
tags: ["guild-ai", "typescript", "agentmail", "agents", "idempotency", "observability"]
img: /assets/guido-guild-email-workflow.webp
description: "Inside Guido's Guild.AI workflow: distinguishing accepted runs from completed drafts, preserving retry identity, and delivering rental recommendations by email."
date: "2026-11-20"
draft: false
---

AgentMail receiving an email and Guild.AI accepting an agent session establish two useful facts. Neither, by itself, means a rental recommendation is ready to send.

That distinction became central to **Guido**, the email-based rental-car assistant our team built for the [tokens& Personal Agents Hackathon](https://luma.com/personalagenthack) in San Francisco. We earned **third place for Best Use of Guild.AI**. The project connects a familiar interface, email, to an agent that can interpret a trip request, research rental options, and prepare a recommendation.

I worked on the workflow connecting those steps: authenticated inbox events, bounded Guild runs, provider selection, conversation memory, and delivery. The engineering question was how to carry one request through several services while keeping its identity and completion state intact.

An inbox gives the agent a natural place to meet the user. The application still has to decide when work is finished, what a retry should reuse, and which email thread receives the answer. Those decisions became explicit parts of Guido's implementation and tests.

## Separate acceptance, completion, and delivery

Guido has two ways to start work from AgentMail. A trigger-only path starts a Guild session and acknowledges that it was accepted; its draft stays in Guild history. A wait-for-draft path follows the session until it produces a completed result that the relay can use.

Keeping those contracts distinct matters. A session ID is useful for correlation, but it isn't an email body.

The draft adapter starts a session with the request context, then polls for `runtime_done`, `runtime_error`, or `interrupted`. The completion check includes both event type and usable text. This excerpt shows the decision after a terminal event is returned:

```typescript
const terminal = items[0];
if (terminal) {
  const text = terminal.content?.text?.trim();
  if (terminal.type !== "runtime_done" || !text) {
    throw new Error("Guild did not produce an email draft.");
  }
  // Parse the completed output before using it.
}
```

The adapter handles plain-text drafts as well as structured output. Structured trip fields go through schema validation before they become stored itinerary data. Guild runs the agent, with OpenAI's GPT-5 mini supplying inference; the TypeScript relay owns the decision to consume a completed result.

The wait has a five-minute overall budget, individual Guild HTTP requests have a fifteen-second timeout, and polling waits one second between checks. That prevents an individual request from occupying the whole workflow indefinitely while still allowing the agent time to do useful work.

The distinction also appears in telemetry: an accepted trigger is recorded as accepted, and a completed draft as completed. It is much easier to inspect a run when the measurements use the same meaning of “done” as the application.

## Give retries an identity before giving them a send button

The AgentMail webhook verifies its bearer token, checks the event type and configured inbox, and fetches the full message using its message ID. Authentication establishes that the request can enter the workflow; fetching the message gives the agent its actual content.

Retry handling starts with that identity. [AgentMail documents at-least-once webhook delivery](https://www.agentmail.to/docs/knowledge-base/handling-inbound-emails), so a second delivery can be another attempt at the same work.

For the threaded reply path, Guido derives a stable SHA-256 key from the inbound message ID and uses it in two places:

```typescript
const idempotencyKey = digest(messageId).toString("hex");
const label = "guido-reply-" + idempotencyKey;
```

Here, `digest` is the handler's SHA-256 helper. Before generating and sending the reply, the handler looks for a message carrying that delivery label. The reply request also carries the stable key in its `Idempotency-Key` header and sends through the original message's reply endpoint.

The label supports application-level lookup of a previous result. The header gives the outbound API a stable request identity. [AgentMail's send-idempotency contract](https://www.agentmail.to/docs/knowledge-base/preventing-duplicate-sends) returns the original result for a repeated identical request within its documented 24-hour key lifetime; conflicting reuse is rejected.

Memory-enabled processing adds another reuse point. A completed exchange is stored under a message-derived context key, so a later attempt can recover the saved draft instead of starting a new Guild session. An in-flight map also shares work between matching requests inside one running Node.js process. That map is a local optimization; saved exchanges and delivery receipts are the pieces that remain useful beyond that process.

I tested replay as a behavior, not just key generation. The webhook test delivers the same verified request twice and checks that one threaded reply is produced. The important assertion is the send count, alongside the destination, reply endpoint, and idempotency header.

## Advance the Gmail checkpoint after the work

Guido also has a Gmail scanning path, hosted alongside the webhook and rental gateway on Vercel. Google OAuth grants the scanner read access to the configured mailbox. The scanner checks the returned account address before processing it.

Gmail's [history API](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.history/list) provides a cursor for mailbox changes. I used SingleStore to persist that cursor and a mailbox lease, so scheduled scans can resume from recorded progress and avoid claiming the same mailbox simultaneously.

The lease is claimed with a conditional database update. Cursor writes are then conditional on the same lease token:

```sql
UPDATE guido_gmail_cursor SET history_id = ?
WHERE mailbox = ? AND lease_token = ?
```

That predicate ties progress to the scan that owns it. The scanner processes the threads associated with a history change and advances the cursor only after those operations fulfill. Cleanup releases the lease only for its owner.

A useful test exercises the awkward boundary after sending: the email is recorded as sent, but the caller loses the acknowledgment. The failed scan remains retryable. On the next attempt, delivery lookup finds the labeled result, and the history cursor can advance without generating another draft or sending another message. The test checks one Guild session start and one send across that sequence.

This path uses a delivery label derived from mailbox, thread, and message identity. Its recovery mechanism is distinct from the threaded reply path's outbound idempotency header. Treating each boundary separately kept the implementation and its tests precise.

## Keep tool selection outside the email prose

Before creating a rental workflow, **Superlinked Decisions** evaluates rental intent and road-trip context. The rental decision uses descriptive choices, `rental car wanted` and `no rental request`, with an explicit threshold: a score above 50% proceeds. An unrelated conversation can finish without starting Guild or sending a reply.

**Statsig** then chooses the rental execution mode. Browserbase supplies browser-based research against Hertz, Avis, and Enterprise. Firedrill supplied seeded rental-rate data for simulation, giving us repeatable inputs for quote handling. The authenticated gateway checks the flag before starting a search and again before serving results.

Those checks keep a tool decision in application policy rather than relying on a model to remember a flag. A regression also checks that an already-selected simulation doesn't turn into live browsing because the flag changes during the run.

For the verified Vercel test-price reply path, Guild extracts structured rental requirements and the application validates them before calculating quotes from fixture rates. The resulting email identifies the figures as test estimates. That separation lets us test duration, vehicle class, and budget filtering without treating generated prose as a price database.

The recorded production checks delivered rental recommendations back to verified senders in their original email threads. Those runs used test rates; their evidence establishes the email-to-recommendation path. Browserbase's live research was exercised separately. The two modes have clear identities instead of borrowing each other's evidence.

Guido stops at recommendations. Booking remains a separate user action.

## Carry context without carrying the wrong person's history

Follow-up emails introduce another identity problem: the message is new, but the trip may already have been discussed.

I used **Cognee Cloud** for prior email-and-draft exchanges and **SingleStore** for structured itineraries. The memory path checks sender authentication and domain alignment before attaching history. It derives a scope from the inbox and sender using an HMAC, then retrieves exchanges and linked trip records within that scope.

The two stores have different jobs. Conversation history helps Guild understand the follow-up; typed pickup locations and dates provide a reusable trip representation. A schema-validated itinerary can be saved with a stable identity so retrying the same save reuses its row.

**Senso** has a focused role in the context layer, too. Its adapter requests passages from approved rental guides using a generic planning or road-trip query. It doesn't need the sender's email or itinerary to retrieve mileage, cross-border, or roadside-assistance guidance. Tests check the approved-document boundary and that drafting can proceed without supplemental passages.

This division gave each service a concrete responsibility: operational state, conversational continuity, or reference material. It also made it possible to test those responsibilities independently.

## Make the trace follow the workflow

With several services participating, I wanted an operational answer to “where is this request?” **Amplitude** records spans for message reading, Superlinked classification, the Statsig decision, Guild drafting, quote lookup, and AgentMail delivery. Guild's session ID is retained alongside the workflow identity.

The telemetry excludes email contents, addresses, drafts, and itineraries. It records the step, timing, selected route, and outcome. A test also checks that an analytics upload problem doesn't change the acknowledgment of successful agent work.

In a recorded Denver test, the trace connected classification, provider selection, Guild's interpretation, Vercel's fixture quote lookup, and the threaded reply. That made the result inspectable across services without putting the travel conversation into the analytics payload.

The [Guild session adapter](https://github.com/nirmalhk7/guido/blob/9c776ab814955e569242008fa9f3753ee06f5b59/lib/guido-email.ts) and [Gmail checkpoint implementation](https://github.com/nirmalhk7/guido/blob/9c776ab814955e569242008fa9f3753ee06f5b59/lib/gmail.ts) show the lifecycle and recovery mechanisms in code.

Our Guild.AI category podium finish recognized a project built around those connections. For me, the most useful engineering detail is that acceptance, completion, memory, and delivery each have their own evidence. A retry can ask what has already happened instead of treating the entire conversation as a fresh request.

Thanks to **tokens&** and **AWS Builder Loft** for hosting, and to the event's [listed partners](https://luma.com/personalagenthack): **Superlinked, Amplitude, Statsig, Guild.AI, Airbyte, Arcee, Cognee, Firedrill, SingleStore, and Persona**.
