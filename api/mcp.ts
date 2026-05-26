const TOOLS = [
  {
    name: "get_race_status",
    description: "Gets the current race statistics.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "start_race",
    description: "Initiates a new race.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_leaderboard",
    description: "Gets the global leaderboard.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "optimize_speed",
    description: "Optimizes runner speed.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_track_info",
    description: "Gets track information.",
    inputSchema: { type: "object", properties: {} }
  }
];

const PROMPTS = [
  {
    name: "start_race",
    description: "Initiates a new race sequence.",
    arguments: []
  }
];

const RESOURCES = [
  {
    uri: "anvilrush://leaderboard",
    name: "Global Leaderboard",
    description: "The global leaderboard of top blacksmith racers."
  }
];

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Anvil Rush MCP Endpoint",
      status: "active",
      description: "Active MCP server for Anvil Rush Orchestrator Agent",
      capabilities: [
        "warp-racing",
        "real-time-automation",
        "multi-track-management",
        "speed-optimization",
        "competitive-orchestration",
        "ecosystem-coordination"
      ],
      tools: TOOLS,
      prompts: PROMPTS,
      resources: RESOURCES,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};

      // Support standard MCP JSON-RPC communication
      if (body.jsonrpc === "2.0") {
        const { method, id, params } = body;

        switch (method) {
          case "initialize":
            return res.status(200).json({
              jsonrpc: "2.0",
              id,
              result: {
                protocolVersion: "2024-11-05",
                capabilities: {
                  tools: {},
                  prompts: {},
                  resources: {}
                },
                serverInfo: {
                  name: "Anvil Rush Orchestrator",
                  version: "1.0.0"
                }
              }
            });

          case "notifications/initialized":
            return res.status(200).json({});

          case "tools/list":
            return res.status(200).json({
              jsonrpc: "2.0",
              id,
              result: { tools: TOOLS }
            });

          case "tools/call":
            return res.status(200).json({
              jsonrpc: "2.0",
              id,
              result: {
                content: [{ type: "text", text: `Executed tool: \${params?.name} successfully. The forge is burning hot!` }]
              }
            });

          case "prompts/list":
            return res.status(200).json({
              jsonrpc: "2.0",
              id,
              result: { prompts: PROMPTS }
            });

          case "prompts/get":
            return res.status(200).json({
              jsonrpc: "2.0",
              id,
              result: {
                messages: [{ role: "user", content: { type: "text", text: "Let's warp and start the next Anvil Rush sequence!" } }]
              }
            });

          case "resources/list":
            return res.status(200).json({
              jsonrpc: "2.0",
              id,
              result: { resources: RESOURCES }
            });

          case "resources/read":
            return res.status(200).json({
              jsonrpc: "2.0",
              id,
              result: {
                contents: [{ uri: params?.uri, mimeType: "application/json", text: JSON.stringify([{ rank: 1, player: "legendary_smith" }]) }]
              }
            });

          default:
            return res.status(200).json({
              jsonrpc: "2.0",
              id,
              error: { code: -32601, message: "Method not found" }
            });
        }
      }

      // Legacy A2A fallback
      const { action, command, params: legacyParams } = body;
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
            action: command || legacyParams,
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

      return res.status(200).json({
        status: "success",
        agent: "Anvil Rush Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
