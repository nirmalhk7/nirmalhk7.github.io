---
title: "From an In-Memory Cart to a Tenant-Scoped Checkout with Prisma"
category: ['Engineering']
tags: ["engineering", "postgresql", "prisma", "payments", "saas"]
img: /assets/prisma-tenant-checkout.webp
description: "Building DishSense beyond a demo: Prisma-backed orders, server-side repricing, tenant checks, and Razorpay payment verification for restaurant pickup."
date: "2026-10-09"
draft: false
---

The first version of DishSense could take a pickup order. It could also forget that order when the server restarted. That is a useful prototype and a terrible restaurant system.

I was building a direct-ordering app for independent restaurants in India. The customer path was simple on purpose: open the menu, choose a dish and its customizations, pay, collect it. Behind that short path sat a longer question: what would have to be true before a merchant could trust the order screen?

The demo kept orders, coupons, events, and payment state in memory. Merchant screens existed, but tenant ownership and roles were not enforced throughout the domain. The UI proved the flow; it did not yet provide durable records or strong boundaries between restaurants. I moved the domain toward PostgreSQL through **Prisma as the sole ORM**, with Better Auth for merchant sessions and roles.

## Start with ownership

The data model separates an organization, its restaurant brand, and its outlets. Menus and pickup hours belong to outlets; customers, promotions, and payment connections belong to a brand. Orders record both brand and outlet IDs. Merchant routes check the signed-in actor's organization and brand, and outlet-specific actions check the assigned outlet too.

That structure is less exciting than a checkout animation, but it answers an important question: if two restaurants use the same app, why should one merchant ever be able to edit the other's menu or see its orders? A `brandId` in a URL is not authorization. The server has to establish ownership before a mutation.

I also made the customer menu read the stored menu for a published restaurant. Categories, item availability, variants, modifier groups, spice labels, and pickup settings can be edited from the admin side. A repeatable seed supplies fictional demo dishes, and later local checks confirmed those dishes appeared on both the customer and admin menus without duplicate inserts on repeat runs.

## The browser does not set the bill

The cart can display an estimate, but checkout asks the server to price it again from the current menu. The pricing function rejects missing or unavailable items, invalid quantities, duplicate modifiers, and selections that violate required choice groups. It then calculates item prices, modifier deltas, tax, packaging, and coupon discounts in **integer paise**.

That matters when a menu changes between “add to cart” and “pay,” or when a browser sends a cheaper number than the merchant configured. The order stores item and modifier snapshots so a later menu edit does not rewrite what the customer bought. It also stores a checkout key, pending payment, customer details, and the initial status event.

Coupons get the same treatment. A code shown in the browser is checked again during server quote and order creation. Percentage discounts respect their cap; the total cannot go below zero. Early browser testing caught a smaller but revealing bug: editing a coupon code left the old discount visible. That display now clears until the new code is validated.

## “Payment succeeded” needs proof

The persisted Razorpay path does not place an order merely because the browser reports success. It checks the checkout signature, fetches the payment from Razorpay, and confirms that it is **captured**, belongs to the expected provider order, has the expected amount, and uses INR. Only then does a database transaction move the order from `PENDING_PAYMENT` to `PLACED`, mark the payment captured, write a status event, and record commerce and outbox events.

The conditional updates matter: if another callback changed the order while verification was running, the transaction refuses to quietly overwrite that state. The schema also has unique provider order and payment identifiers, plus a webhook inbox keyed by provider event ID to handle duplicate notifications. Refund requests are persisted and use a stable idempotency key when sent to the provider.

These are mechanisms for handling retries and races; they are not a claim that every payment edge case is solved. Payments are exactly where I want a real database and provider test to challenge the code.

## What I verified, and what I still owe

During this build, Prisma generation and schema validation, TypeScript, lint, **30 tests across 13 files**, and a Webpack production build passed. I later verified local admin sign-in and that seeded dishes appeared in both menus. The source and tests cover tenant checks, pricing, signatures, state transitions, and several failure cases.

The important limit: the full PostgreSQL integration path and a live Razorpay test-account payment were **not** exercised in that verification run. The sandbox blocked database initialization then. Multi-outlet management and broader end-to-end coverage were still open. DishSense remained a private, noncommercial prototype, not a service ready to process a real restaurant's orders.

That is the part of this project I find most instructive. A demo can make the happy path look complete. Engineering starts when I ask what happens after a restart, a price change, a duplicate webhook, or a merchant opening the wrong restaurant. Those questions forced the data model, authorization boundary, and payment state machine into the design.
