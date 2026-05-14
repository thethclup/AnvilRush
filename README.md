# Mythic Anvil Rush

Mythic Anvil Rush is an epic, fast-paced, and satisfying endless runner + forging hybrid game deployed on the Base network. You are a legendary **Mythic Blacksmith** running through dangerous mythic realms while forging powerful weapons and armor on the move.

## 🚀 Features

- **Endless Runner Mechanics:** Fast-paced action where the blacksmith runs automatically.
- **Dynamic Forging:** Tap the anvil at the exact perfect time to generate legendary items that buff your score multiplayer and styling.
- **Engaging Visuals & Sound:** Built using an Immersive UI logic, complete with dynamic bloom, canvas-based rendering, and epic thematic visuals.
- **On-chain Integrations (ERC-8004/ERC-8021):** Users interact directly with an advanced AI Orchestrator that uses MCP. Player capabilities are recorded directly on-chain on Base Mainnet. Ensure wallet connections and SIWE signatures authenticate your interactions!

## ⚡ Setup & Development

This application is built with React, Vite, TailwindCSS (v4), and Express.

### Scripts
- `npm run dev`: Starts the local development environment using `tsx` and sets up a Vite middleware wrapper around Express supporting dynamic active game endpoints.
- `npm run build`: Bundles the output for deployment, utilizing `esbuild` to compile the Express backend into `dist/server.cjs`.
- `npm run start`: Serves the fully bundled application locally in production mode.

## 🤖 Anvil Rush Orchestrator (Agent)

Mythic Anvil Rush ships with a deeply integrated, ERC-8004 standard active AI Agent. This agent helps manage forging automation, tracks survival rushes, and maintains high-intensity operations across the realm. 

### Key Capabilities
- **A2A Endpoint:** Standardized interaction paths available via `/.well-known/agent-card.json`.
- **MCP Active Endpoint:** Direct model context protocol integration with a live agent to execute `ping`, `get_info`, and dynamic action streams at `/api/mcp`.
- **Primary Agent Interface:** API checkouts at `/api/agent`.

## 🛠 Built By

Builder: `bc_xhh7du90`
Protocol Standard: `ERC-8021` and `ERC-8004` natively.

Have fun forging legends!
