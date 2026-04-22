---
title: "NodeChat Prototype"
description: "A secure, decentralized P2P messaging tool built in Rust to bypass central servers."
tags: ["Rust", "iroh", "QUIC", "E2EE"]
year: "2025"
status: "Active"
category: "P2P"
---

## The Problem
Modern messaging apps rely on central servers that act as single points of failure and surveillance. When the server is down, you can't communicate. When the company changes its policies, your privacy is at risk. 

The goal was to build a messaging system where two peers communicate directly — no central server in the path of the message.

## Architecture
NodeChat uses the `iroh` transport layer (built on QUIC) for direct peer-to-peer connections. Peers discover each other via a lightweight DHT relay when they're on separate networks. 

Once connected, all communication is encrypted at the session layer. The app ships as three Rust binaries:
1. A peer manager
2. A server node
3. A client

## Security Model
Key exchange uses ECDH (Elliptic Curve Diffie-Hellman) to establish a shared secret per session. All messages are then encrypted with ChaCha20-Poly1305, which provides authenticated encryption. 

Each session uses unique ephemeral keys, so compromise of one session does not expose past or future messages — perfect forward secrecy.

## What I Would Do Differently
I would have spent more time on the relay fallback path. Direct QUIC connections work well on the same network, but NAT traversal failures on hostile networks still cause silent drops instead of graceful fallback. That's the next thing to fix.
