---
title: "Qtπ"
description: "Commitment-Based Dating and Relationship Platform"
type: "project"
tags: ["tech"]
technologies: ["Docker", "Django", "PostgreSQL", "DGraph", "Redis", "SeaweedFS", "Keycloak", "KrakenD", "Flutter", "Posthog", "Glitchtip"]
year: 2024
status: "paused"
featured: false
links:
  github: "https://github.com/qtpi-bonding/"
  live: "https://qtpi.app"
---

[Qtpi](https://qtpi.app) (Cutie Pie) was a solo-founded dating and relationship platform built on the premise that engagement-optimized dating apps have the wrong objective function. Where most platforms profit from keeping users swiping, Qtpi was designed to get users *off* the app and into real relationships — with privacy, agency, and thoughtfulness built into the architecture rather than bolted on.

The core mechanic was a **Pledge System**: matches required mutual up-front commitment, making high-intent interactions the default and filtering out the passive-swipe dynamics of engagement-driven apps. The roadmap extended past the initial match into a Relationship Toolkit — shared scrapbooks, date scheduling, and tools to support couples through the rest of the relationship, not just the first message.

## Technical Foundation
A modular, self-hosted stack: Django (DRF) and PostgreSQL for the backend, DGraph for relationship modeling, SeaweedFS for media, Keycloak for identity, and Matrix for end-to-end encrypted messaging, all routed through KrakenD. Flutter handled cross-platform mobile. Every component was chosen to keep user data under the project's control rather than delegated to a third party.

## Matching Algorithm
A custom PostgreSQL matching query enforced 100% mutual satisfaction of declared deal-breakers, then scored remaining candidates with a two-level geometric-mean compatibility model. Filters were applied cheapest-first (requisites → cooldown → pledge state → hard constraints → scoring), so the expensive scoring stage ran over the smallest possible candidate set.

## AI-Augmented Development
Used AI tooling (Gemini, Kiro) to both accelerate development and as a structured way to learn mobile app development while shipping.

Qtpi is currently paused.
