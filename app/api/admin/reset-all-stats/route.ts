import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Clean up any bad data before proceeding
    await supabase.from("player_stats").delete().is("player_id", null);

    // Get all player IDs first
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id");

    if (playersError) {
      console.error("Error fetching players:", playersError);
      return NextResponse.json(
        { error: "Failed to fetch players" },
        { status: 500 }
      );
    }

    // Reset player stats first
    for (const player of players) {
      const { error: statsError } = await supabase.from("player_stats").upsert(
        {
          player_id: player.id,
          impact: 0,
          flag_captures: 0,
          flag_returns: 0,
          bc_kills: 0,
          dbs_kills: 0,
          dfa_kills: 0,
          overall_kills: 0,
          overall_deaths: 0,
          flaghold_time: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "player_id" }
      );

      if (statsError) {
        console.error(
          `Error resetting stats for player ${player.id}:`,
          statsError
        );
        return NextResponse.json(
          { error: "Failed to reset player stats" },
          { status: 500 }
        );
      }
    }

    // Delete player match stats
    const { error: matchStatsError } = await supabase
      .from("player_match_stats")
      .delete()
      .neq("id", 0); // Delete all records

    if (matchStatsError) {
      console.error("Error deleting player match stats:", matchStatsError);
      return NextResponse.json(
        { error: "Failed to delete player match stats" },
        { status: 500 }
      );
    }

    // Reset matches
    const { error: matchesError } = await supabase
      .from("matches")
      .update({
        score_a: 0,
        score_b: 0,
        team_a_returns: 0,
        team_b_returns: 0,
        team_a_kills: 0,
        team_b_kills: 0,
        team_a_flag_time: 0,
        team_b_flag_time: 0,
        is_completed: false,
        updated_at: new Date().toISOString(),
      })
      .neq("id", 0); // Update all records

    if (matchesError) {
      console.error("Error resetting matches:", matchesError);
      return NextResponse.json(
        { error: "Failed to reset matches" },
        { status: 500 }
      );
    }

    // Reset team stats
    const { error: teamStatsError } = await supabase
      .from("team_stats")
      .update({
        matches_played: 0,
        matches_won: 0,
        matches_drawn: 0,
        matches_lost: 0,
        captures: 0,
        flag_returns: 0,
        kills: 0,
        points: 0,
        updated_at: new Date().toISOString(),
      })
      .neq("id", 0); // Update all records

    if (teamStatsError) {
      console.error("Error resetting team stats:", teamStatsError);
      return NextResponse.json(
        { error: "Failed to reset team stats" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "All stats reset successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
