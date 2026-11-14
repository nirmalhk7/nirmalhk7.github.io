---
title: "Useful Stack Traces, Private Receipts: Sentry Across Next.js and FastAPI"
category: ['Engineering']
tags: ["sentry", "nextjs", "fastapi", "observability", "privacy", "testing"]
img: /assets/sentry-private-receipts.webp
description: "How I integrated Sentry into Next.js and FastAPI, filtering receipt data while preserving stack traces, source-map debug IDs, and masked Replay links."
date: "2026-11-13"
draft: false
---

A receipt-processing app can fail in ways that are useful to report and contain information that isn't useful to share. An exception needs a location. It rarely needs someone's shopping history.

For **Sueperman**, my consumer-rights hackathon project, I integrated Sentry across a Next.js frontend and FastAPI backend. The app turns uploaded purchases into source-backed recall and settlement opportunities, with review before a local remedy draft can be exported. Receipt contents, extracted identifiers, and provider credentials all needed to stay out of operational diagnostics.

The difficult part was deciding what to keep. Early privacy filters discarded real exception details, source-map metadata, and the identifier connecting an error to its browser replay. Another test caught private strings leaving through source-code context, after the obvious request fields had already been removed.

The resulting integration retained readable application frames, traces, restricted logs, and a masked replay in local running-app verification. Production Sentry delivery and production source-map uploads remain unverified. This is the boundary I built and tested for the hackathon app, rather than a claim that every possible telemetry leak has been eliminated.

## Decide what an error report is allowed to contain

Sueperman has several places where receipt data can travel: uploads, structured extraction results, model requests, and the UI showing a purchase. That makes “remove the request body” an incomplete telemetry policy. The same value can appear in an exception message, a breadcrumb, a span attribute, or a local variable.

I used two layers. Collection settings disable categories the integration doesn't need: request bodies, headers, cookies, query values, local variables, and AI inputs and outputs. Then application filters construct smaller outgoing events from explicitly selected fields. Sentry's [Python SDK configuration](https://getsentry.github.io/sentry-python/api.html) exposes collection controls and hooks for events, transactions, and logs; the project uses separate filters for those paths.

On the backend, the retained error information includes exception type, function and file locations, line numbers, and selected source context. A validated run UUID and a provider name from a fixed set can identify the operation. Raw request data, user fields, breadcrumbs, arbitrary extras, and arbitrary tags aren't copied into the rebuilt event.

Exception messages normally become:

```text
Application error details redacted
```

There is a narrow exception for a fixed verification-message format, used to identify synthetic test errors. It doesn't make normal application messages eligible for forwarding.

This costs some convenience. Reading an error type and location can take more investigation than reading a verbose exception containing every input. I accepted that tradeoff for an app whose inputs are purchase records. Operational identifiers provide a way to locate a run without putting its contents in the error report.

## The source line was carrying the test secret

The Python tests didn't stop at passing dictionaries through a sanitizer. One test initializes the actual SDK, raises a synthetic exception, captures it, flushes the client, and inspects serialized envelopes with the HTTP transport intercepted locally.

That exposed a less obvious path. The test's exception contained the synthetic strings `private receipt` and `secret-token`. Removing the exception value and frame variables wasn't enough: the source line that raised it could contain those strings too.

The backend keeps source structure but replaces quoted string literals in context lines. This is the helper used for the current line and its surrounding source context:

```python
def scrub_source(line):
    # Preserve source structure and locations without copying string literals.
    return re.sub(r"\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*'", '"<redacted>"', str(line))
```

For example, an illustrative source line such as `raise RuntimeError("private receipt")` retains its call structure while the literal becomes `"<redacted>"`. Function names and line numbers still tell me where to look in the repository.

This is a limited literal filter, not a parser or a guarantee that arbitrary source text is safe. Comments and unusual literal syntax deserve their own treatment if the policy expands. Its established result is narrower: the actual SDK transport test no longer serialized the synthetic private values, while retaining the exception and diagnostic structure.

That test also guards the opposite failure. A filter that removes the entire exception can pass every “secret absent” assertion and still leave a useless report. The tests check that a real exception remains an error event, with its type and readable frame location preserved.

## Privacy filtering can break source maps

The browser had a similar tension. Its event filter reconstructs exception frames and removes private values, but an error in bundled JavaScript also needs metadata connecting it to the original source.

The first filter discarded that metadata. I added a regression that supplies a source-map entry in `debug_meta.images` and checks that its `debug_id` survives filtering. The implementation retains source-map entries and strips query strings from their code-file URLs.

[Sentry's Debug IDs](https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/troubleshooting_js/debug-ids/) connect a transformed JavaScript file to its corresponding source map. Removing that connection is rather like filing a bug report with a line number and throwing away the filename.

Preserving the ID was necessary, but it wasn't the whole verification. The initial live browser error still lacked application source context. After uploading the temporary verification page's JavaScript/source-map pair, a new error mapped to `app/sentry-verification/page.tsx`, line 8, with source context. Application frames became readable; third-party React frames still lacked uploaded library context.

That proved the local verification path. The Next.js configuration also prepares authenticated build-time source-map uploads, but configuration alone doesn't establish that a deployed build uploaded the right artifacts. Source maps are a separate artifact boundary, too: filtering an event doesn't redact the source files contained in an uploaded map.

## Traces and Replay need their own filters

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

The broad event filter initially threw away Replay correlation as well. The repair preserves a `replayId` tag only when it matches 32 lowercase hexadecimal characters. Other user-supplied tags are still discarded. The frontend test checks both sides: the replay ID remains, and an unrelated receipt tag disappears.

That format check is a shape constraint, not proof of ownership or an authorization mechanism. Its job here is to preserve the SDK's link between an error and a replay without reopening arbitrary tags.

## Check what arrived, then remove the test triggers

The live verification used a temporary FastAPI route that raised an error and a temporary browser button that threw one. They exercised the running application rather than standalone capture scripts.

The recorded checks confirmed backend and frontend errors, corresponding traces and verification logs, and readable application frames after the source-map repair. The stored browser replay contained two segments and 63 events, covering about six seconds. Its visible page text was masked, and the checked user identity fields were null.

That small recording establishes what happened in that verification session. It doesn't substitute for checking masking again when screens or SDK behavior change. The temporary routes and browser checks were removed afterward, and both former URLs returned 404.

The [telemetry implementation](https://github.com/nirmalhk7/sueperman/blob/1dbd30ff4009cf357f28e70334703321a21c269f/services/api/app/telemetry.py), [frontend filters and regressions](https://github.com/nirmalhk7/sueperman/blob/1dbd30ff4009cf357f28e70334703321a21c269f/apps/web/tests/telemetry.test.ts), and [recorded verification details](https://github.com/nirmalhk7/sueperman/blob/1dbd30ff4009cf357f28e70334703321a21c269f/docs/sentry-setup.md) show the boundaries in more detail.

The useful contract is two-sided: private test values must be absent, and the information needed to diagnose the failure must remain. Source-map IDs, exception frames, span operations, and Replay correlation each earned their place by supporting a specific debugging task. That made the telemetry policy something I could test, rather than a collection of reassuring settings.
