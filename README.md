# Anvil Rush Orchestrator

Anvil Rush is an epic, high-performance endless runner and forging hybrid game deployed on the Base network. You play as a legendary Mythic Blacksmith navigating dangerous mythic realms, forging weapons and armor on the move.

The project features a specialized AI Agent (the Orchestrator) focused on warp racing mechanics, real-time automation, multi-track management, competitive optimization, and ecosystem coordination.

## 🚀 Features

- **Endless Runner Mechanics:** Fast-paced action with procedural challenges.
- **Dynamic Forging:** Tap the anvil perfectly to generate legendary items.
- **AI Orchestration:** Real-time API and MCP logic managing performance and automation.

## 🤖 Agent Orchestrator (ERC-8004 compatible)

- **A2A Endpoint:** Standardized interaction paths exist at `/.well-known/agent-card.json`.
- **MCP Active Endpoint:** Direct Model Context Protocol integration via `/api/mcp` for actions like ping, get_info, and command execution.
- **Primary Agent Interface:** Central agent communication at `/api/agent`.

### Capabilities 
`warp-racing`, `real-time-automation`, `multi-track-management`, `speed-optimization`, `competitive-orchestration`, `ecosystem-coordination`

### Skills
- **Anvil Mechanics:** Real-time forging mechanics, timing, and material processing.
- **Rush Mode:** Manage and synchronize endless runner intense sessions.
- **Performance Optimization:** Analyze and optimize racing performance, timing, and strategy.

## ⚡ Setup & Development

Ensure you have a recent version of Node installed. 

This repository leverages Next.js 14 App Router formatting for the API routes.
Run the local dev server and connect your MCP clients to `http://localhost:3000/api/mcp`.
