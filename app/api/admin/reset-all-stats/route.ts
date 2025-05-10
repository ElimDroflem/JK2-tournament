import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// IMPORTANT: Use a dedicated, strong password for this highly destructive action.
// Set this in your server-side environment variables.
const destructiveActionPassword =
  process.env.ADMIN_DESTRUCTIVE_ACTION_PASSWORD ||
  "samsmum_reset_all_local_default";

export async function POST(request: NextRequest) {
  if (!supabaseServiceRoleKey) {
    console.error("Supabase service role key is not configured.");
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const { password } = await request.json();

    if (!password || password !== destructiveActionPassword) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid password for reset action." },
        { status: 401 }
      );
    }

    // Proceed with deletions and updates
    // 1. Delete all from player_match_stats
    const { error: deletePlayerMatchStatsError } = await supabaseAdmin
      .from("player_match_stats")
      .delete()
      .neq("id", -1); // Trick to delete all rows without a specific filter like eq

    if (deletePlayerMatchStatsError) {
      console.error(
        "Error deleting player_match_stats:",
        deletePlayerMatchStatsError
      );
      return NextResponse.json(
        {
          error: `Failed to delete player_match_stats: ${deletePlayerMatchStatsError.message}`,
        },
        { status: 500 }
      );
    }

    // 2. Update player_stats to reset all stat fields
    const { error: updatePlayerStatsError } = await supabaseAdmin
      .from("player_stats")
      .update({
        impact: 0, // Or null if appropriate based on schema and preference
        flag_captures: 0,
        flag_returns: 0,
        bc_kills: 0,
        dbs_kills: 0,
        dfa_kills: 0,
        overall_kills: 0,
        overall_deaths: 0,
        flaghold_time: 0,
      })
      .neq("id", -1); // Explicitly update all rows by providing a condition that matches all

    if (updatePlayerStatsError) {
      console.error("Error resetting player_stats:", updatePlayerStatsError);
      return NextResponse.json(
        {
          error: `Failed to reset player_stats: ${updatePlayerStatsError.message}`,
        },
        { status: 500 }
      );
    }

    // 3. Update team_stats to reset all stat fields
    const { error: updateTeamStatsError } = await supabaseAdmin
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
      })
      .neq("id", -1); // Explicitly update all rows

    if (updateTeamStatsError) {
      console.error("Error resetting team_stats:", updateTeamStatsError);
      return NextResponse.json(
        {
          error: `Failed to reset team_stats: ${updateTeamStatsError.message}`,
        },
        { status: 500 }
      );
    }

    // 4. Update matches table
    const { error: updateMatchesError } = await supabaseAdmin
      .from("matches")
      .update({
        score_a: 0,
        score_b: 0,
        team_a_returns: 0,
        team_b_returns: 0,
        team_a_kills: 0,
        team_b_kills: 0,
        team_a_flag_time: 0, // Assuming these are nullable or default to 0
        team_b_flag_time: 0, // Assuming these are nullable or default to 0
        is_completed: false,
      })
      .neq("id", -1); // Explicitly update all rows

    if (updateMatchesError) {
      console.error("Error resetting matches:", updateMatchesError);
      return NextResponse.json(
        { error: `Failed to reset matches: ${updateMatchesError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        "All player stats, team stats, match performances, and match results have been reset.",
    });
  } catch (error: any) {
    console.error("API Error in reset-all-stats:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
