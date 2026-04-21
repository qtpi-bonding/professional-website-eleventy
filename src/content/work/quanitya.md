---
title: "Quanitya"
description: "The Life Laboratory Logbook — A Private, End-to-End Encrypted Self-Tracking App"
type: "project"
tags: ["tech"]
technologies: ["Flutter", "Serverpod", "Dart", "PostgreSQL", "PowerSync", "Redis", "Docker", "WASM"]
year: 2026
status: "ongoing"
featured: false
links:
  github: "https://github.com/qtpi-bonding-org/quanitya-cloud"
  live: "https://quanitya.com"
---

[Quanitya](https://quanitya.com) (*kwah-NIT-yuh*) is an end-to-end encrypted self-tracking app designed as a life laboratory logbook — a private, fully customizable notebook for the experiments you run on yourself. The name blends **Qua-** (quantitative / qualitative) with **Anitya** (Sanskrit for impermanence), reflecting a design philosophy that treats data as an analytical path to mindfulness rather than a metric to optimize.

Most tracking apps lock users into one domain — sleep, mood, calories, workouts. Quanitya gives users a blank page instead: define your own templates with custom fields, colors, and layouts, or generate them from natural language via an AI template generator that can run on the user's own API key for maximum sovereignty.

## Technical Foundation
Zero-knowledge architecture with AES-256-GCM data encryption, RSA-OAEP key wrapping, and ECDSA P-256 for anonymous authentication — accounts are cryptographic keys, not email addresses. Offline-first synchronization through PowerSync over PostgreSQL means the app works fully without connectivity, with encrypted cross-device sync when desired.

## Analysis Pipeline
A WASM-sandboxed JavaScript runtime lets users build custom analyses with scope-based isolation and no network access. Clean summaries and charts ship by default; deeper correlation analysis across metrics unlocks through the same pipeline — enabling rich analytical insight while keeping computation local and sovereign.

## AI-Augmented Development
Developed primarily through AI-augmented workflows: Google Antigravity for agentic multi-task orchestration, Claude Code for interactive development, and Kiro for spec-driven work.
