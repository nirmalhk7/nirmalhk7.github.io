---
title: "Two 600 KB Events Broke My SSE Parser"
category: ['Engineering']
tags: ["javascript", "sse", "streaming", "nodejs", "testing"]
img: /assets/sse-frame-boundaries.webp
description: "Two valid events shared one network chunk and tripped my SSE parser's size limit. The fix required tracking event boundaries, partial lines, and shutdown."
date: "2026-11-05"
draft: false
---

Two messages, each comfortably under the limit. Put them in the same network chunk, and the stream fails.

That was the regression I found while working on authenticated chat streams in **Agrinet**, an open-source project I contribute to. I was addressing review feedback around stream authentication, cleanup, and oversized frames. The client needed to reject an event that grew too large without rejecting perfectly valid traffic just because it arrived together.

The uncomfortable part: the size check looked reasonable. It even had the right error message.

```javascript
buffer += decoder.decode(result.value, { stream: true });
if (buffer.length + frameSize > 1024 * 1024) {
  throw new Error('Stream frame too large');
}
```

It ran before parsing the newly received chunk. At that point, `buffer` could contain several complete events. The error said “frame”; the calculation included everything that happened to arrive in one read.

## The request needed a header

Our chat client used a small EventSource-shaped wrapper around `fetch`. It attached the account's bearer token as a request header and consumed the response through a `ReadableStream` reader. Credentials stayed out of the stream URL.

That wrapper also owned the connection's lifetime. Changing accounts closed the old stream. Authorization failures stopped reconnection. Ordinary connection failures could retry. These details mattered because a parser failure eventually reached that same lifecycle code.

Inside it, the parser had three different boundaries to keep track of:

- **A read:** the next chunk returned by `reader.read()`.
- **A line:** text ending in an SSE line separator, possibly split across reads.
- **An event:** fields accumulated until a blank line completes the event.

The [HTML event-stream specification](https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation) defines parsing in terms of lines and blank-line dispatch. A read from the transport does not give the application an event boundary.

I had accounted for fragmented lines. The early size check still allowed transport packaging to decide whether valid messages were accepted.

## Make the failure deterministic

I didn't need a live server or a conveniently misbehaving proxy to reproduce it. A `ReadableStream` fixture could supply exactly one chunk containing two events.

The regression used two ASCII payloads of 600,000 characters each. For those payloads, each character is also one UTF-8 byte: roughly 600 KB per payload, plus a few characters of SSE framing.

Each event fit under the parser's `1024 * 1024` threshold. Together, they exceeded it.

This is the core of the committed test:

```javascript
const first = 'a'.repeat(600000);
const second = 'b'.repeat(600000);
const bytes = new TextEncoder().encode(
  `data: ${first}\n\ndata: ${second}\n\n`
);
const body = new ReadableStream({
  start(controller) {
    controller.enqueue(bytes);
    controller.close();
  }
});
```

The test collects dispatched messages and asserts that both original payloads arrive, in order. The old guard rejects the combined buffer before it can dispatch either one.

This was a useful failure to pin down. Reducing message size or increasing the threshold would have hidden it for that fixture. Neither would explain why changing chunk boundaries changed the result.

## Consume complete lines before measuring the remainder

I extracted the frame reader into `sseFrames.mjs`, separate from the authenticated connection wrapper. The fixed read loop is short:

```javascript
buffer += decoder.decode(result.value, { stream: true });
buffer = consumeLines(buffer, frame, events, isClosed);
checkSize(buffer.length + frame.size);
```

`consumeLines` processes complete lines in order. Before consuming a line, it checks that line together with the current frame's accumulated size. A blank line dispatches the collected data and resets the frame's type, data array, and size.

That reset is the important boundary. Once the first event is complete, the second event gets its own allowance, even if both arrived in the same chunk.

After processing complete lines, the remaining buffer may hold an unfinished line. The final check accounts for that remainder together with the frame already being assembled. Otherwise, an unterminated `data:` line could keep growing while waiting for a newline that never arrives.

The decoder uses `{ stream: true }`, preserving decoding state between reads. The line splitter also leaves a trailing carriage return buffered until the next read can establish whether it belongs to a CRLF pair. Those existing fragmentation behaviors needed to survive the repair.

## The opposite test matters just as much

Moving a check later can fix false rejection while accidentally allowing a genuinely oversized event through. I kept a regression for the opposite direction.

That fixture sends two `data:` lines in separate chunks, each carrying 600,000 characters, with no blank line between them. Together they form **one** oversized event.

The expected result is rejection before dispatch:

```javascript
await assert.rejects(
  readFrames(body.getReader(), events, () => false),
  /Stream frame too large/
);
assert.equal(messages, 0);
```

The pair of tests checks a concrete distinction: two separate events must each get their own allowance; one event split across multiple reads must retain its accumulated size.

Both examples use almost identical amounts of text. The blank line changes their meaning.

## Reconnecting is a separate decision

The parser now throws a `RangeError` for an oversized frame. The connection wrapper handles that error by closing permanently and notifying listeners, rather than entering its normal reconnect path.

Without that distinction, retrying could repeatedly encounter the same oversized input. A fresh connection would offer little help.

Closing aborts the request, cancels the active reader, clears the retry timer, and removes the account-change listener. A wrapper-level regression checks that oversized input leaves the stream closed and causes only one request during its observation window.

Other tests cover bearer-header authentication, fragmented CRLF token and message events, account changes, and authorization failures. The two parser regressions add the coalescing and accumulation cases. I reran all six focused tests for this article; all passed.

## What this limit actually measures

There is an important qualification to the convenient “600 KB” description: the implementation uses JavaScript string `.length`. Its counter measures UTF-16 code units, not raw network bytes. The ASCII fixture makes those quantities line up for the payloads in these tests; arbitrary Unicode would not.

The frame counter accumulates `data:` line lengths, including their prefixes. It is an application guard around buffered event data, not a complete wire-byte accounting system. The fetch reader has already supplied a chunk before the parser checks it, so this repair also does not impose a hard ceiling on the allocation size of that incoming chunk.

Nor is this wrapper a full replacement for browser `EventSource`. It implements the subset the chat UI uses. The tests establish the behaviors described above, rather than complete SSE conformance or measured production memory usage.

Those limits don't weaken the regression's conclusion. The parser can now accept the two independently valid events in the fixture while rejecting the oversized event assembled across reads.

## Keep the unit of the limit visible

I like this bug because it fits in a few lines and still crosses several layers: decoded text, protocol framing, and connection recovery.

The early guard saw a large buffer and made a decision before the parser knew what that buffer contained. Processing the boundaries first gave it enough information to make the intended decision.

The useful test wasn't a bigger collection of sample messages. It was the same amount of data packaged two different ways, with an explicit assertion about when dispatch was allowed.

Source and regressions are in [Agrinet's authenticated-stream change](https://github.com/NTARI-RAND/Agrinet/commit/fc1c498): the [frame reader](https://github.com/NTARI-RAND/Agrinet/blob/fc1c498/frontend/chat-ui/src/sseFrames.mjs), [parser tests](https://github.com/NTARI-RAND/Agrinet/blob/fc1c498/frontend/chat-ui/sseFrames.test.js), and [connection tests](https://github.com/NTARI-RAND/Agrinet/blob/fc1c498/frontend/chat-ui/authenticatedStream.test.js). The failure described here was reproduced in controlled tests; this is not a claim about a measured production outage.
