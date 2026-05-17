import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON body parsing for our API endpoints
  app.use(express.json());

  // --- API Endpoints ---
  
  // MCP Active Endpoint
  // app/api/mcp/route.ts equivalent
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Anvil Rush MCP Endpoint",
      status: "active",
      description: "Active MCP server for Anvil Rush Orchestrator Agent",
      capabilities: ["anvil-mechanics", "rush-mode", "forging-automation"],
      tools: [
        {
          name: "forge_item",
          description: "Forges a new mythical item."
        },
        {
          name: "get_run_status",
          description: "Gets the current runner's statistics."
        }
      ],
      prompts: [
        {
          name: "start_rush",
          description: "Initiates a new rush sequence."
        }
      ],
      resources: [
        {
          uri: "anvilrush://leaderboard",
          name: "Global Leaderboard"
        }
      ],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body || {};
      const { action, command, params } = body;

      let result: any = {};

      switch (action || command) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Anvil Rush Orchestrator",
            message: "Forge is hot - Ready to rush!" 
          };
          break;

        case "execute":
          result = {
            success: true,
            action: command || params,
            executedAt: new Date().toISOString(),
            message: "Anvil Rush command executed successfully"
          };
          break;

        case "get_info":
          result = {
            name: "Anvil Rush Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Command received",
            data: body
          };
      }

      res.status(200).json({
        status: "success",
        agent: "Anvil Rush Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  });

  // Agent API
  // app/api/agent/route.ts equivalent
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Anvil Rush Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Anvil Rush",
      version: "1.0.0"
    });
  });

  // Serve static files dynamically through Vite in dev, or statically in prod
  if (process.env.NODE_ENV !== "production") {
    // Serve the public directory for static features like .well-known
    app.use(express.static('public'));

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, everything inside public/ is handled if we also static serve dist/
    // as Vite copies public/ resources to dist/ automatically
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
