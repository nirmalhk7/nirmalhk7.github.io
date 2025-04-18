---
title: "Homelabs: Introduction to Hypervisors and Proxmox"
category: ['Guides']
tags: ["technology", "project", "personal", "homelab", "proxmox", "virtualization", "hypervisors", "kubernetes"]
img: /assets/proxmox.jpeg
description: "Discover the power of hypervisors and how Proxmox can transform your homelab into a robust virtualization environment."
date: "2025-04-16"
draft: false
---

When diving into the world of homelabs, one of the first concepts you'll encounter is **virtualization**. Virtualization allows you to run multiple operating systems on a single physical machine, making it a cornerstone of modern IT infrastructure. At the heart of virtualization lies the **hypervisor**. In this blog, we’ll explore what hypervisors are, their types, and how Proxmox can be a game-changer for your homelab.

## What is a Hypervisor?

A **hypervisor** is software that creates and manages virtual machines (VMs). It acts as a layer between the physical hardware and the virtualized environments, enabling multiple operating systems to run simultaneously on a single physical machine. 

### Types of Hypervisors

Hypervisors come in two main types:

1. **Hosted Hypervisors**: These run on top of an existing operating system. Examples include VirtualBox and VMware Workstation. They are beginner-friendly and easy to set up but inherit the limitations and overhead of the host OS.

2. **Bare-Metal Hypervisors**: These run directly on the hardware, bypassing the need for a host OS. They are leaner, faster, and optimized for performance but require more expertise to configure. Examples include Proxmox and VMware ESXi. If you're serious about performance and scalability, bare-metal hypervisors are the way to go.

## Why Use Proxmox?

As someone who primarily runs Kubernetes clusters on my homelab, you might wonder why I even bother with hypervisors. The answer lies in **isolation and scalability**. I wanted to run three Kubernetes clusters:

- **Dev Cluster**: For current projects and experimentation.
- **Managed Cluster**: For hosting internal services.
- **Live Cluster**: For internet-exposed services with strict security controls.

Proxmox allowed me to achieve this setup efficiently by running three Alpine Linux VMs, each hosting a Kubernetes cluster. This separation ensures maximum security and flexibility.

## Challenges with Proxmox: My WiFi Disaster

Proxmox is designed to work best with Ethernet, but my setup required WiFi due to the constraints of my living space. Here's how I tackled the challenge:

- **WiFi Configuration**: I followed this excellent guide: [Proxmox VE 8.x.x WiFi with Routed Configuration](https://forum.proxmox.com/threads/howto-proxmox-ve-8-x-x-wifi-with-routed-configuration.147714/).
- **Driver Installation**: I had to install third-party WiFi drivers to get Proxmox working with my adapter.
- **Performance Issues**: Even after setup, my WiFi speed was only a third of the actual speed. It took some tweaking to optimize performance.

Despite these hurdles, I successfully configured Proxmox to run my Kubernetes clusters. If you're in a similar situation, don't hesitate to reach out—I’d be happy to share more details.

## Final Thoughts

Setting up a homelab with Proxmox can be a rewarding experience, but it’s not without its challenges—especially when dealing with WiFi connectivity. While Proxmox is designed to work best with Ethernet, with some effort and the right resources, you can make it work with WiFi as well.

If you’re considering setting up your own homelab, don’t be afraid to dive in, experiment, and learn along the way. The challenges you face will only make the end result more satisfying.

Till next time—happy homelabbing!