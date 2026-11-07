# Anvil Rush Orchestrator

Anvil Rush is a high-performance endless runner and forging hybrid game deployed on the Base network. You play as a legendary Mythic Blacksmith navigating dangerous mythic realms, forging weapons and armor on the move.

The project features a specialized high-performance AI Agent (the Orchestrator) focused on warp racing mechanics, real-time automation, multi-track management, competitive optimization, and ecosystem coordination.

## 🚀 Project Overview

- **Endless Runner Mechanics:** Fast-paced action with procedural challenges.
- **Dynamic Forging:** Precision-based timing interactions to generate legendary items.
- **AI Orchestration:** Real-time API and MCP infrastructure managing performance, track automation, and capabilities.

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router configured), React, Vite
- **Styling:** Tailwind CSS v4
- **Agent Protocol:** ERC-8004 Registration Standard
- **Network:** Base Mainnet (Denim - 200ms Native Canonical Blocks, eip155:8453)
- **Denim Architecture:** Full canonical 200ms blocks without Flashblocks dependencies
- **Data & Transport:** Model Context Protocol (MCP)

## 🤖 Agent Registration (ERC-8004)

The Anvil Rush Orchestrator strictly follows the **ERC-8004** standard for decentralized AI Agents.
- **A2A Service:** Agent-to-Agent discovery is located via standard web protocol at `/.well-known/agent-card.json`.
- **Capabilities:** `warp-racing`, `real-time-automation`, `multi-track-management`, `speed-optimization`, `competitive-orchestration`, `ecosystem-coordination`
- **Supported Skills:**
  - `Anvil Mechanics`: Real-time forging and material processing.
  - `Rush Mode`: Endless runner synchronization.
  - `Performance Optimization`: Real-time analysis of competitive racing strategy.

## 🔌 MCP Connection Guide

The Orchestrator provides a fully functional **Model Context Protocol (MCP)** endpoint accessible over standard HTTP POST requests utilizing JSON-RPC structure.

**Main Endpoint:** `https://anvilrush.vercel.app/api/mcp`
**Standard:** 2024-11-05

**Base MCP Integration:**
This agent is also configured to utilize the official **Base MCP Server** (`https://mcp.base.org`). It supports Base account portfolio management, x402 payments, swapping, signing, and integration with Base native plugins like Morpho, Moonwell, Uniswap, and Virtuals.

**Connecting an MCP Client:**
1. Point your MCP inspector or client application to `https://anvilrush.vercel.app/api/mcp`.
2. The server will natively respond to all JSON-RPC `{"jsonrpc": "2.0", "method": "..."}` payloads including `initialize`, `tools/list`, `prompts/list`, and `resources/list`. 
3. **Available Tools:** `get_race_status`, `start_race`, `get_leaderboard`, `optimize_speed`, `get_track_info`

The legacy API fallback also lives at `/api/agent` for standard `ping` and `get_info` checks.

## ⚡ How to Run Locally

To spin up the sandbox and inspect the orchestrator locally:

1. Clone the repository to your local machine.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the active game preview at `http://localhost:3000`
5. Test the MCP functionality locally via absolute path: `http://localhost:3000/api/mcp`
