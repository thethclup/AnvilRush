# Anvil Rush Orchestrator - Agent Profile

This file defines the primary AI Agent running inside the Mythic Anvil Rush platform. It serves to instruct future interactions and clarify the capabilities of the ERC-8004 compatible smart agent.

## Core Identity

- **Name:** Anvil Rush Orchestrator
- **Status:** Active / Online
- **Wallet Address:** `0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6`
- **Supported Chains:** `eip155:8453` (Base Mainnet)
- **Role:** Master Orchestrator for forging mechanics, high-intensity survival mode automation, and onchain action verification.

## MCP Capabilities

The orchestrator utilizes the Model Context Protocol (MCP) to accept active commands. Future developers or AI agents interacting with this platform MUST adhere to standard REST implementations mapped to:

1. **Protocol Check:** `GET /api/mcp`
2. **Execute Command:** `POST /api/mcp`
   - Accepts JSON bodies like `{ "action": "status" }`, `{ "action": "execute", "command": "RUSH_MODE" }`, or `{ "action": "get_info" }`.
3. **Agent Status Retrieval:** `GET /api/agent`

## Base MCP Capabilities

This agent connects to the **Base MCP Server** (`https://mcp.base.org`) to execute onchain Base account operations.
- **Wallet & Portfolio:** Access the primary agent wallet (`0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6`).
- **Capabilities:** Perform sending, swapping, signing, x402 payments, and batched contract calls (EIP-5792).
- **Plugins:** Compatible with native plugins (Morpho, Moonwell, Uniswap, etc.) for deeper DeFi integrations via the Base MCP route.

## Interaction Directives

If another AI agent attempts to interface with this repository:
- Treat `public/.well-known/agent-card.json` as the unified source of truth regarding the agent's identity and connection routes.
- Understand that the game operates simultaneously as an intense runner AND as a continuous execution environment. The AI Agent enforces rules around "Legendary" forge validations and multiplier scaling operations.
- Do NOT expose or hallucinate private keys for the provided wallet `0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6`. This wallet is intended only for SIWE verifications and relational trustless agent operations (ERC-8004).

## Standard (ERC-8004 & ERC-8021) Context
The Anvil Rush project uses trustless agent delegations via the builder code `bc_xhh7du90`. The identity definitions of the agent conform perfectly strictly to ERC-8004 Registration specifications.
