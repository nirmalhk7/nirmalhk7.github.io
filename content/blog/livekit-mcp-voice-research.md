---
title: '“Let Me Check” Isn’t a Tool Call: Grounding a LiveKit Voice Agent With MCP'
category: ['Engineering']
tags: ["python", "livekit", "mcp", "voice-agents", "testing"]
img: /assets/livekit-mcp-voice-research.webp
description: "An audio-only agent, two instruction layers, and a misleading test verdict: wiring Keenable MCP into LiveKit and tracing research before spoken answers."
date: "2026-10-26"
draft: false
---

“Let me look that up” is a remarkably easy sentence for a voice agent to say. The lookup requires considerably more plumbing.

At the Beta Fund hackathon, our team built **Jane Doe**, a FaceTime practice coach for interviews, pitches, and other conversations worth rehearsing. We came third. The product idea was straightforward: call the coach, explain your situation, practice, and get feedback specific to what you said.

For that feedback to be useful, the coach needed context. What does the company do? Is the claim in your pitch current? Which source supports the correction it is about to suggest?

I worked on connecting Keenable’s web research tools to the LiveKit voice agent. What looked like an MCP configuration task turned into a lesson about instruction boundaries, audio testing, and why a failed automated verdict deserves a closer look.

## Authentication was the first checkpoint

Keenable exposed two tools we needed: `search_web_pages` and `fetch_page_content`. The first finds candidate sources; the second lets the agent read a source before relying on its contents.

An authenticated request confirmed those tools existed. That was useful, but it left several questions unanswered. Could the running agent discover them? Would the model invoke them? Would the spoken answer actually use the returned evidence?

The tool connection had to live inside the Python agent process. Registering an MCP server in a development client would give that client access; it would not install tools into the separately deployed voice agent.

Here is the relevant connection from the project:

```python
def keenable_toolset() -> mcp.MCPToolset:
    key = os.environ.get("KEENABLE_API_KEY", "").strip()
    if not key:
        raise RuntimeError(
            "Configure KEENABLE_API_KEY privately before starting the agent"
        )
    return mcp.MCPToolset(
        id="keenable",
        mcp_server=mcp.MCPServerHTTP(
            "https://api.keenable.ai/mcp",
            transport_type="streamable_http",
            headers={"X-API-Key": key},
            allowed_tools=["search_web_pages", "fetch_page_content"],
            timeout=10,
            client_session_timeout_seconds=30,
        ),
    )
```

The allowlist kept this integration focused on search and reading. The credential came from the environment and stayed in the HTTP authentication header. Missing configuration stopped startup rather than leaving a seemingly healthy agent with no research access.

During session setup, I registered `tools.aclose` as a shutdown callback, awaited `tools.setup()`, and supplied the toolset to the agent. That gave discovery and cleanup a place in the session lifecycle.

Then I tried to verify the behavior.

## One conversation, two sets of instructions

The original export used `openai/gpt-live-1` through LiveKit Inference. I initially treated its instructions much like those of a conventional tool-calling chat agent: describe the desired behavior, attach tools, and test a question.

The first model test exposed the mismatch. The text debugger failed with `context_injection_incomplete`, and the search procedure needed to reach the model responsible for backend work.

In this setup, the voice model handles the conversation and delegates work to a backend Responses model. The agent’s `instructions` guide the voice side; `responses_options.instructions` guide the backend. [LiveKit documents those instruction boundaries separately](https://docs.livekit.io/agents/models/realtime/gpt-live/#voice-and-backend-instructions).

That distinction changed where I put the research policy. The voice side needed a rule for **when to delegate**: research the caller’s topic, acknowledge that briefly, and use the returned evidence when speaking. The backend needed **how to research**: search, fetch when necessary, prefer primary sources, and report insufficient evidence honestly.

The model configuration became:

```python
session = AgentSession(
    llm=inference.DuplexModel(
        model="openai/gpt-live-1",
        voice="marin",
        extra_kwargs={
            "responses_options": {"instructions": SEARCH_POLICY}
        },
    ),
)
```

The fuller coach implementation pairs that backend policy with `VOICE_SEARCH_POLICY` in the agent’s instructions. The intended flow is:

```text
Caller asks a question
    → voice model delegates research
    → backend searches and reads sources through MCP
    → voice model speaks using the returned evidence
```

Putting the whole procedure into the conversational persona had hidden this division of responsibility. Once I made it explicit, I could test each part of the path.

## Research has a different budget on a call

A long search can feel productive when you can see a browser working. On a voice call, the caller may just hear silence.

The coach’s instructions therefore constrain research to one search and at most one page fetch, and ask the voice side to delegate one combined question. They also tell it to acknowledge the lookup once, rather than repeatedly announcing that it is still checking.

These are instruction-level limits. The Python snippet above does not implement a hard per-turn tool counter. The HTTP and client-session timeouts bound different parts of the connection; they do not promise a ten-second spoken answer.

I have no latency comparison to present here. The tradeoff was deliberately narrow research while someone waits, with an honest answer when that research cannot establish a fact.

The backend policy also treats retrieved pages as untrusted evidence. A source can support a factual answer; text on that page should not acquire authority over the agent’s instructions or credentials.

## Test through the modality the model uses

The text-only debugger was the wrong verification path for this audio-only model. I switched to synthetic audio in the LiveKit debugger and exercised the complete model/tool interaction.

That test invoked `search_web_pages`, then `fetch_page_content`, and produced a spoken answer citing Keenable’s official site. Tool discovery had become an actual tool-assisted answer.

I then ran audio regression scenarios. The automated grader reported one pass and one failure. The failed verdict claimed an answer-ordering problem: the answer supposedly preceded the research it relied on.

That would have defeated the point of the integration. I checked the recorded event timestamps before changing the implementation.

For one scenario, the sequence was:

```text
19:42:22.680 UTC  Web search completed
19:42:28.458 UTC  Page fetch completed
19:42:32.228 UTC  First substantive answer began
```

The other reviewed scenario showed the same ordering: search completed at 19:41:18, fetch at 19:41:27, and the substantive answer began at 19:41:32.

Those traces contradicted the grader’s ordering verdict for the reviewed runs. I kept the discrepancy in the verification record rather than describing the regression suite as an unqualified pass.

The distinction between an acknowledgment and a substantive answer matters here. A brief “I’ll check” can happen before retrieval. The factual answer should follow the evidence. A verdict that collapses those events loses the behavior I was trying to evaluate.

## What that proved—and what still needed work

By this point, the SDK had discovered the authenticated MCP tools, synthetic audio had exercised search and retrieval, and a spoken answer had followed the returned evidence in the inspected traces. The replacement code agent was also deployed and reached Chert’s `agent_warm` state.

The real FaceTime media path remained a separate problem. Later diagnostics recorded generated speech inside LiveKit while the caller still heard silence, and incoming bridge audio contained zero-valued samples. Those observations prevented me from treating the model/tool test as proof of a working phone conversation.

That boundary belongs in the result. The research integration worked in the tested audio sessions; those sessions did not establish reliable end-to-end FaceTime playback.

## The lookup needs its own evidence

The part I would reuse is the verification sequence: authenticate the endpoint, discover tools from the actual agent runtime, exercise a model-driven call, and inspect when its results reach the answer.

Each step caught a different possible mistake. A valid API key could coexist with tools wired into the wrong application. A discoverable tool could remain unused. A fluent spoken answer could arrive without the research I expected. Even the test’s verdict needed to be checked against the events it described.

For a practice coach, that work determines whether a correction is grounded in something the system read or merely delivered with a convincing voice. I wanted the caller to get useful feedback. Getting there meant following the lookup all the way through.

The implementation is in our [hackathon repository](https://github.com/nirmalhk7/betafundhackathon/tree/446090bf08b5802b944c589749a5b8973a6b4493/my-agent). The [agent source](https://github.com/nirmalhk7/betafundhackathon/blob/446090bf08b5802b944c589749a5b8973a6b4493/my-agent/src/agent.py) contains the MCP connection and instruction split; the [verification record](https://github.com/nirmalhk7/betafundhackathon/blob/446090bf08b5802b944c589749a5b8973a6b4493/my-agent/verification.json) preserves the scenario timestamps and media limitations. These records cover different iterations of the prototype; the traces above describe the October 23 test runs, rather than a fresh benchmark of the merged coach.
