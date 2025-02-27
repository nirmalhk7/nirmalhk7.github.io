---
title: Preemptive Kubernetes Autoscaler
tags: ["Kubernetes", "Docker", "Python"]
---

Existing Kubernetes autoscalers are great but they are reactive in nature: it will only scale if your deployment has too much or too little traffic. Since human usage has patterns, deployment traffic will always have patterns, which is where our application comes in. We built a horizontal and vertical autoscaler that uses past historical data and accordingly adjust resources on the cluster.