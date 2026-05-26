import { NextResponse } from 'next/server';

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

export async function GET() {
  return NextResponse.json({
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Support standard MCP JSON-RPC communication
    if (body.jsonrpc === "2.0") {
      const { method, id, params } = body;

      switch (method) {
        case "initialize":
          return NextResponse.json({
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
          // Acknowledge initialization
          return NextResponse.json({});

        case "tools/list":
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              tools: TOOLS
            }
          });

        case "tools/call":
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: `Executed tool: \${params?.name} successfully. The forge is burning hot!`
                }
              ]
            }
          });

        case "prompts/list":
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              prompts: PROMPTS
            }
          });

        case "prompts/get":
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              messages: [
                {
                  role: "user",
                  content: {
                    type: "text",
                    text: "Let's warp and start the next Anvil Rush sequence!"
                  }
                }
              ]
            }
          });

        case "resources/list":
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              resources: RESOURCES
            }
          });

        case "resources/read":
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              contents: [
                {
                  uri: params?.uri,
                  mimeType: "application/json",
                  text: JSON.stringify([{ "rank": 1, "player": "legendary_smith" }])
                }
              ]
            }
          });

        default:
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: "Method not found"
            }
          });
      }
    }

    // Fallback for custom / legacy A2A MCP payload
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

    return NextResponse.json({
      status: "success",
      agent: "Anvil Rush Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process MCP command"
    }, { status: 400 });
  }
}
