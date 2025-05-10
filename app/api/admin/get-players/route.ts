import { NextResponse } from "next/server";
import {
  getPlayers,
  type PlayerWithStatsAndTeamName,
} from "@/lib/data-service";

export async function GET() {
  try {
    const players: PlayerWithStatsAndTeamName[] = await getPlayers();
    return NextResponse.json(players);
  } catch (error: any) {
    console.error("API Error fetching players for admin:", error);
    return NextResponse.json(
      { error: `Failed to fetch players: ${error.message}` },
      { status: 500 }
    );
  }
}
