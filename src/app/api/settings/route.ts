import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/lib/settings.json");

function readSettings() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading settings.json", err);
  }
  // Default fallback values
  return { 
    requireProof: false, 
    badgeAutoAward: false, 
    autoFlagOverdue: true,
    esgWeights: { env: 40, soc: 30, gov: 30 }
  };
}

function writeSettings(settings: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing settings.json", err);
  }
}

export async function GET() {
  const settings = readSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = readSettings();
    const updated = {
      ...current,
      ...body
    };
    writeSettings(updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
