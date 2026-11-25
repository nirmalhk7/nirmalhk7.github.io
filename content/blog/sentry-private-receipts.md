---
title: "Useful Stack Traces, Private Receipts: Sentry Across Next.js and FastAPI"
category: ['Engineering']
tags: ["sentry", "nextjs", "fastapi", "observability", "privacy", "testing"]
img: /assets/sentry-private-receipts.webp
description: "How I integrated Sentry into Next.js and FastAPI, filtering receipt data while preserving stack traces, source-map debug IDs, and masked Replay links."
date: "2026-11-13"
draft: false
---

On November 13, I went to the [AIE x MLH Hackathon @ Code Summit](https://luma.com/AIECodeSummitHackathon) in San Francisco, held at Bright Data on Second Street. Major League Hacking and AI Engineer brought builders together for a day of hacking and demos. My project was **Sueperman**, a consumer-rights app that turns uploaded purchases into source-backed recall and settlement opportunities, with review before a local remedy draft can be exported.

I integrated Sentry across its Next.js frontend and FastAPI backend with a specific requirement: keep diagnostics useful while keeping receipt contents, extracted identifiers, and provider credentials out of operational telemetry. An exception needs a location. It rarely needs someone's shopping history.

That meant defining what an error report should retain as carefully as what it should remove. Exception frames, source-map metadata, trace identifiers, and Replay correlation each serve a different debugging task. I built filters and regression tests around those jobs, including an SDK transport test that checks the serialized data leaving the application.

Running-app verification from the local development environment confirmed errors, traces, restricted logs, readable application frames, and a masked replay arriving in Sentry. The implementation details below explain how those diagnostic links survive redaction.

## Decide what an error report is allowed to contain

Sueperman handles receipt data at several stages: uploads, structured extraction results, model requests, and the UI showing a purchase. The telemetry policy follows those paths. A value that starts in a request body can also appear in an exception message, a breadcrumb, a span attribute, or a local variable.

I used two layers. Collection settings disable categories the integration doesn't need: request bodies, headers, cookies, query values, local variables, and AI inputs and outputs. Then application filters construct smaller outgoing events from explicitly selected fields. Sentry's [Python SDK configuration](https://getsentry.github.io/sentry-python/api.html) exposes collection controls and hooks for events, transactions, and logs; the project uses separate filters for those paths.

On the backend, the retained error information includes exception type, function and file locations, line numbers, and selected source context. A validated run UUID and a provider name from a fixed set can identify the operation. Raw request data, user fields, breadcrumbs, arbitrary extras, and arbitrary tags aren't copied into the rebuilt event.

Exception messages normally become:

```text
Application error details redacted
```

There is a narrow exception for a fixed verification-message format, used to identify synthetic test errors. It doesn't make normal application messages eligible for forwarding.

I chose to diagnose through error types, source locations, and operational identifiers. That keeps a report connected to the affected run without putting its purchase records in the report. It is a deliberate distinction between knowing which operation needs attention and copying everything that operation processed.

## Test the source context as well as the exception

The Python tests didn't stop at passing dictionaries through a sanitizer. One test initializes the actual SDK, raises a synthetic exception, captures it, flushes the client, and inspects serialized envelopes with the HTTP transport intercepted locally.

The test exercises a less obvious path using the synthetic strings `private receipt` and `secret-token`. Those values appear in the exception, but they can also occur in the source line that raised it. The transport-level assertion checks this representation alongside the exception value and frame variables.

The backend keeps source structure but replaces quoted string literals in context lines. This is the helper used for the current line and its surrounding source context:

```python
def scrub_source(line):
    # Preserve source structure and locations without copying string literals.
    return re.sub(r"\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*'", '"<redacted>"', str(line))
```

For example, an illustrative source line such as `raise RuntimeError("private receipt")` retains its call structure while the literal becomes `"<redacted>"`. Function names and line numbers still tell me where to look in the repository.

The helper targets quoted string literals in SDK frame context. The transport test verifies that the synthetic private values are absent from serialized envelopes while the exception and diagnostic structure remain. That gives this particular filtering rule an executable contract.

The tests check both halves of that contract: private values are absent, and a real exception remains an error event with its type and readable frame location preserved. Testing only for absence would miss the information that makes the report useful.

## Retain source-map links through redaction

The browser had a similar tension. Its event filter reconstructs exception frames and removes private values, but an error in bundled JavaScript also needs metadata connecting it to the original source.

I added a regression that supplies a source-map entry in `debug_meta.images` and checks that its `debug_id` survives filtering. The implementation retains source-map entries and strips query strings from their code-file URLs.

[Sentry's Debug IDs](https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/troubleshooting_js/debug-ids/) connect a transformed JavaScript file to its corresponding source map. Removing that connection is rather like filing a bug report with a line number and throwing away the filename.

I verified the link with the running application. After uploading the temporary verification page's JavaScript/source-map pair, a new browser error mapped to `app/sentry-verification/page.tsx`, line 8, with source context. That established the complete path for the application frame: captured error, retained metadata, matching source map, and readable source location in Sentry.

The Next.js configuration uses a secret build-time `SENTRY_AUTH_TOKEN` for authenticated source-map uploads. Source maps follow a separate artifact policy from runtime events: the map provides source code, while event filters control runtime values. Keeping those responsibilities explicit makes the data flow easier to review.

## Preserve trace structure and Replay correlation

An error-event hook doesn't cover every kind of telemetry. A trace can include an HTTP span whose name is a URL and whose attributes contain request details.

The Python transaction filter replaces the transaction name, retains selected trace and timing fields, and clears raw span data. In the frontend's installed `@sentry/nextjs` 11.12.0, streamed spans also need their own filter. The relevant browser configuration is:

```typescript
beforeSend: sanitizeEvent,
beforeSendTransaction: sanitizeTransaction,
beforeSendLog: sanitizeLog,
beforeSendSpan: Sentry.withStreamedSpan(sanitizeSpan),
```

The streamed-span filter keeps identifiers, timing, status, and a validated operation name, replacing the raw name and attributes. A regression gives it a URL containing a synthetic token and an attribute containing synthetic receipt text; neither may survive. The [SDK's versioned migration guide](https://github.com/getsentry/sentry-javascript/blob/11.12.0/MIGRATION.md#upgrading-from-10x-to-11x) explains the streamed-span API. This was a version-specific integration detail, not something the transaction filter could be assumed to handle.

Replay has another export path and a different use. I wanted to inspect the sequence of UI actions without reading the purchase shown on screen. Its configuration makes that choice explicit:

```typescript
Sentry.replayIntegration({
  maskAllText: true,
  maskAllInputs: true,
  blockAllMedia: true,
  networkDetailAllowUrls: [],
  networkCaptureBodies: false,
})
```

Masking preserves useful layout and interaction information while obscuring text; blocking replaces media with placeholders. Those are distinct behaviors in [Sentry's Replay privacy model](https://docs.sentry.io/platforms/javascript/session-replay/privacy/).

The event filter preserves a `replayId` tag only when it matches 32 lowercase hexadecimal characters. Other user-supplied tags are discarded. The frontend test checks both sides: the replay ID remains, and an unrelated receipt tag disappears.

The format check validates the identifier's shape; it serves correlation rather than authorization. It preserves the SDK's link between an error and a replay while keeping the tag policy narrowly defined.

## Check what arrived, then remove the test triggers

The live verification used a temporary FastAPI route that raised an error and a temporary browser button that threw one. They exercised the running application rather than standalone capture scripts.

The recorded checks confirmed backend and frontend errors, corresponding traces and verification logs, and readable application frames with source-map linking. The stored browser replay contained two segments and 63 events, covering about six seconds. Its visible page text was masked, and the checked user identity fields were null.

Inspecting the stored recording checked the masking behavior beyond the configuration itself. The temporary routes and browser checks were removed afterward, and both former URLs returned 404, keeping verification triggers out of the application.

The [telemetry implementation](https://github.com/nirmalhk7/sueperman/blob/1dbd30ff4009cf357f28e70334703321a21c269f/services/api/app/telemetry.py), [frontend filters and regressions](https://github.com/nirmalhk7/sueperman/blob/1dbd30ff4009cf357f28e70334703321a21c269f/apps/web/tests/telemetry.test.ts), and [recorded verification details](https://github.com/nirmalhk7/sueperman/blob/1dbd30ff4009cf357f28e70334703321a21c269f/docs/sentry-setup.md) show the boundaries in more detail.

The useful contract is two-sided: private test values must be absent, and the information needed to diagnose the failure must remain. Source-map IDs, exception frames, span operations, and Replay correlation each earned their place by supporting a specific debugging task. Transport checks and running-app verification let me inspect that contract in the serialized envelopes and the reports arriving in Sentry.
