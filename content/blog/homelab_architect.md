---
title: "Homelabs: Architecture Planning"
category: ['Guides']
tags: ["technology","project","personal","homelab"]
img: /assets/datacenter_1.png
description: "You have a homelab. How would you build it responsibly"
date: "2025-07-01"
draft: false
---

Its important that you think and decide (or atleast have a general idea) how you would want to build your homelab. These architecture plans can be at various levels: as I said, this part of software engineering is where a lot of the "black boxes" are at. 

I for one was happy with my hardware structure. But I needed to review my software plans. Broadly I divided into 3 parts:
- Managed: These are services that are critical to me or my homelab. This environment would have tight controls and minimal scope of chaos, and would only be accessible via a VPN.
- Dev: These are services that I'm testing out or my friends are testing out (maximal chaos). This would only be accessible via my LAN or my VPN.
- Live: These are services that are tied to applications that are exposed to the Internet. Again, these would have tight controls and minimal scope of chaos.

Ideally you should have an idea similar to above: what groups of services you want to install and how you'd want to restrict their access.

## Operating System
My prime usecase was to host everything on Kubernetes clusters. Everyone agrees VMs are a hassle to maintain, but I've seen firsthand how *big* of a hassle they are to maintain. I for one think that for most production applications, a Kubernetes cluster is much better than using VMs.

But Kubernetes clusters are not directly installed on baremetal: you install it over an OS. Regarding OS' you could choose:
- A desktop based OS: which is a *horrible* idea as you don't really need to see the desktop in your server.
- A server OS: which is a decent idea but it really depends on what OS you choose.
- A level 1 hypervisor: Okay, this is too many words. A hypervisor allows you to run multiple VMs on a single machine. A _level 1_ hypervisor is an operating system that allows you to run multiple VMs.

As I'm relatively new to this, I chose to go with the server OS.