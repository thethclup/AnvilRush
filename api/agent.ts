export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Anvil Rush Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Anvil Rush",
      version: "1.0.0"
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
