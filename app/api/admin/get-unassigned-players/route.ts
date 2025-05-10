import { NextResponse } from "next/server";
import {
  getUnassignedPlayers,
  type PlayerWithStatsAndTeamName,
} from "@/lib/data-service";

export async function GET() {
  try {
    const players: PlayerWithStatsAndTeamName[] = await getUnassignedPlayers();
    return NextResponse.json(players);
  } catch (error: any) {
    console.error("API Error fetching unassigned players for admin:", error);
    return NextResponse.json(
      { error: `Failed to fetch unassigned players: ${error.message}` },
      { status: 500 }
    );
  }
}
