---
title: "Achaean"
description: "Reference Implementation of the Koinon Protocol for Trust-Gated Social Networking"
type: "project"
tags: ["tech"]
technologies: ["Flutter", "Serverpod", "Dart", "PostgreSQL", "Apache AGE", "Forgejo"]
year: 2026
status: "ongoing"
featured: false
links:
  github: "https://github.com/qtpi-bonding-org/achaean"
---

[Achaean](https://github.com/qtpi-bonding-org/achaean) is the first reference implementation of the Koinon Protocol — a social platform where communities are trust-gated rather than moderation-gated. Every other platform's social layer is a graph, but the moment moderation arrives, that graph collapses into an admin → mod → user tree. Koinon keeps the social graph *and* the moderation layer as the same structure, so community boundaries emerge from mutual trust relationships rather than being enforced by volunteer moderators.

## Technical Foundation
Dart top-to-bottom with shared models across client and server. Identity is an ECDSA P-256 keypair stored in the platform keychain. Content lives in user-owned git repositories (Forgejo, GitHub, Codeberg, or Radicle); the Serverpod backend is a metadata index that never stores or serves content. Trust graphs and membership are computed with PostgreSQL + Apache AGE, handling relational and graph queries in a single database.

## Architecture
Three intentionally decoupled layers: the Flutter client holds the user's keypair and a local copy of their repo; the Synedrion indexer computes membership and serves agora feeds; the Archeion git forge stores the actual content. Six protocol primitives — README, trust, observe, flag, signature, and a membership function — produce emergent community governance without hardcoded roles.

## AI-Augmented Development
Developed primarily through AI-augmented workflows with Claude Code, working against the explicit Koinon protocol spec as the source of truth for implementation.
