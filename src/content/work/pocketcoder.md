---
title: "PocketCoder"
description: "Sovereign, Mobile-First AI Coding Assistant"
type: "project"
tags: ["tech"]
technologies: ["Docker", "Docker MCP Gateway", "Flutter", "PocketBase", "OpenCode", "Tmux", "Go", "Rust", "TypeScript", "Dart", "Tailscale"]
year: 2026
status: "ongoing"
featured: false
links:
  github: "https://github.com/qtpi-bonding-org/pocketcoder"
  live: "https://pocketcoder.org"
---

[PocketCoder](https://pocketcoder.org) is a personal research project exploring what a "Sovereign AI" coding assistant looks like when it's built like Alpine Linux: a tiny, auditable surface area that leans on battle-tested Unix tools. It's designed for high-level agent orchestration from a phone — reviewing plans, assigning tasks, approving executions — without routing system-level commands through unauthenticated chat bridges.

## Technical Foundation
Lightweight glue connecting Docker, Tmux, PocketBase, OpenCode, and the Docker MCP Gateway. A Go backend and Rust proxy sit behind a Flutter client targeting iOS, Android, and F-Droid. A manager agent plans and approves while sandbox agents execute; all manager tool calls are intercepted by the Rust proxy and routed into disposable containers, so even a prompt-injected manager can only request what a human then approves. Remote access runs over Tailscale — no port forwarding required.

## Dynamic MCP Provisioning
MCP servers are not pre-configured or long-running. When the manager agent needs a tool, it requests an MCP through Docker's MCP Gateway, the request surfaces to the Flutter client for explicit approval, and the gateway spins up an isolated container for the sandbox's use. The container is torn down when the session ends — so the agent's tool surface itself is provisioned on demand, gated by human approval, and disposable by default.

## Design Principles
LLM-agnostic (bring your own API key), fully self-hosted with no telemetry, and intentionally scoped for orchestration rather than desktop IDE replacement. The core is small enough to audit in an afternoon.

## AI-Augmented Development
Developed primarily through AI-augmented workflows: Google Antigravity for agentic multi-task orchestration, Claude Code for interactive development, and Kiro for spec-driven work.
