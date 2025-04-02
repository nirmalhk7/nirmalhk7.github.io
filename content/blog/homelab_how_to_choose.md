---
title: "Homelabs: How to start one"
category: ['Guides']
tags: ["technology","project","personal","homelab"]
img: /assets/homelab.png
description: "Interested in building a homelab: here's what you need to know"
date: "2025-04-01"
draft: false
---

A lot of software engineers don't know what it takes to actually get code deployed. Some would know how to create CI scripts and use kubernetes. Even fewer would know how these CI platforms are built and how kubernetes clusters are set up. And even fewer would know how these clusters would work in a multi-system setup in different regions on different networks.

As a software engineer I always like to have a full ownership of my code, and for me it includes understanding about deployments and infrastructure. I wanted to learn what an infrastructure engineer would do. Which is where my dream of a homelab comes in.

# Lexicon
A homelab can mean many things. I call mine a "lab" because it's my software testing environment, though it's just a single desktop computer. Your homelab could range from an actual server rack to a cluster of computers, a single machine, or even just a Raspberry Pi. It might include routers and switches, or none at all.

Ultimately, the most critical factor in building your homelab is:

# Budget
Your budget will determine what type of homelab you can build. You have three main options:

- Assemble a computer yourself (typically the most cost-effective)
- Buy a secondhand computer
- Buy a new computer

If you're assembling a computer, you need to carefully consider the compatibility of components (power ratings, maximum supported RAM/storage). Since I wasn't completely confident in this area and was working with limited funds, I opted for a secondhand computer.

## Raspberry Pis
While Raspberry Pis are popular for homelabs, they rarely sell at their MSRP these days. You can often get a more powerful computer for the same price or slightly more. If you do choose a Pi, avoid the Pi Zeros—512MB of RAM simply isn't sufficient for most homelab applications.

## Secondhand Computer
You can find excellent secondhand computers on eBay for under $200. Look for machines with at least 16GB of RAM (or motherboards with extra RAM slots) and avoid computers older than 8 years. Newer computers include more modern chipsets that are more power-efficient and will remain viable longer.

Always prioritize RAM capacity—16GB is the minimum I recommend for running serious homelab applications like Grafana, Immich, or other containerized services.

### GPU
GPUs consume *significant* power, so only include one if you have specific needs that require GPU processing. Additionally, ensure any GPU you purchase meets your specific requirements, as they represent a *substantial* investment.

### What I did
I was fortunate to discover that my university operates a distribution center where they sell used or excess equipment to the public. I acquired a 2018 Dell Optiplex 7040 with 32GB DDR5 RAM and a 0.5TB SSD. If you have access to an authorized used equipment store, **definitely** explore that option—these vendors typically perform their own quality and health checks.


## DISASTER
I encountered an unexpected issue: desktop computers often don't include built-in WiFi capabilities. This presents several considerations for homelab builders:

- For a professional setup, always use a wired LAN connection when possible
- If you need WiFi, pay attention to the standard—opt for WiFi 5 or WiFi 6
- PCIe WiFi adapters offer the best performance, but require an available PCIe slot
- USB WiFi adapters should be your last resort, as the USB interface will limit throughput

I eventually purchased a TP-Link AC600 PCIe WiFi adapter. Fortunately, I did this before removing Windows, which saved me considerable trouble. My total investment came to $112.

# Future Plans
After witnessing how organizations like Visa maintain their infrastructure, I realized that certain concepts are difficult to learn without hands-on experience. With my homelab, I plan to replicate professional infrastructure practices, including proper networking, monitoring systems, containerization, high availability setups, and security best practices. This practical experience will give me deeper insights into production-grade infrastructure management.