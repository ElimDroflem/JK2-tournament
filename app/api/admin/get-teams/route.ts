import { NextResponse } from "next/server";
import { getTeams, type TeamWithStatsAndPlayers } from "@/lib/data-service";

export async function GET() {
  try {
    const teams: TeamWithStatsAndPlayers[] = await getTeams();
    return NextResponse.json(teams);
  } catch (error: any) {
    console.error("API Error fetching teams for admin:", error);
    return NextResponse.json(
      { error: `Failed to fetch teams: ${error.message}` },
      { status: 500 }
    );
  }
}
