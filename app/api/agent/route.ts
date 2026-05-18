import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: "Anvil Rush Orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Anvil Rush",
    version: "1.0.0"
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    return NextResponse.json({
      status: "success",
      message: "Command received",
      data: body
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process agent command"
    }, { status: 400 });
  }
}
