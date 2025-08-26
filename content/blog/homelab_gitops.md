---
title: "Streamlining Deployments with GitOps"
category: ['Guides']
tags: ["technology", "project", "personal", "homelab", "proxmox", "virtualization", "hypervisors", "kubernetes"]
img: /assets/proxmox.jpeg
description: "Learn how GitOps simplifies infrastructure management and deployment in modern setups."
date: "2025-04-16"
draft: false
---

Kubernetes has been an open-source project since 2014, but it wasn’t until 2022-23 that many companies fully realized its advantages over traditional virtual machines (VMs). 

VMs are essentially full-fledged operating systems running in a sandboxed environment using hypervisors like Proxmox (something I’ve personally worked with!). This setup allows all processes for running an application to exist within the same system, avoiding excessive network calls.

In professional-grade setups, tools like Ansible are often used to automate deployments. Ansible pipelines SSH into systems, install dependencies, and execute applications. However, this approach comes with significant challenges. Each deployment involves managing a complete OS, which increases the complexity and the likelihood of errors. For instance, updating or changing a single dependency could break the entire pipeline.

But this also means that you’re working with a full-fledged OS for every new deployment. While this might not sound overly complicated at first, the "things-that-might-get-wrong" plane here is massive. Any dependency update or change could easily break your pipeline, leading to frustrating debugging sessions and wasted time.

Docker containers introduced the concept of images, where all application dependencies are packaged together. While this reduces the "things-that-might-get-wrong" plane size compared to traditional VMs, you still need to run a Docker engine on the VM to serve these images. This approach simplifies things but doesn’t eliminate the challenges entirely. Over time, Ansible scripts can become lengthy and difficult to maintain.

The biggest drawback, however, is the tendency in professional setups to prioritize quick fixes over sustainable solutions. For example, instead of updating an Ansible script to regularly clear the `logs` directory, someone might simply SSH into the VM and do it manually. This approach, while convenient in the short term, undermines the reliability and repeatability of the deployment process.

This is where Kubernetes shines.