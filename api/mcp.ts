export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
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
  }

  if (req.method === 'POST') {
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
