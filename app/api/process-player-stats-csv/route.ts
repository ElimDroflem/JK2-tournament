import { type NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Papa from "papaparse";
import type { Database, Tables } from "@/types/supabase";
import { revalidatePath } from "next/cache";

// IMPORTANT: Use environment variables for Supabase credentials
// Ensure these are set in your Vercel/deployment environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use the SERVICE ROLE KEY for admin operations - DO NOT EXPOSE THIS PUBLICLY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminPassword = process.env.ADMIN_UPLOAD_PASSWORD || "samsmum"; // Use env var or default

interface CsvPlayerStatRow {
  match_id: string; // Will be parsed to number
  player_name: string;
  final_score_a: string; // Will be parsed to number
  final_score_b: string; // Will be parsed to number
  flag_captures: string; // Will be parsed to number
  flag_returns: string; // Will be parsed to number
  bc_kills: string; // Will be parsed to number
  dbs_kills: string; // Will be parsed to number
  dfa_kills: string; // Will be parsed to number
  overall_kills: string; // Will be parsed to number
  overall_deaths: string; // Will be parsed to number
  flaghold_time: string; // Will be parsed to number
  impact: string; // Will be parsed to number (1,2,3)
  [key: string]: any; // For any other columns that might be present but ignored
}

// Type for player_match_stats insert, assuming supabase.ts will be updated
// We define it locally for now to help with typings in this file.
type PlayerMatchStatInsert = Tables<"player_match_stats">["Insert"];

async function getPlayerIdAndTeamId(
  supabaseAdmin: SupabaseClient<Database>,
  playerName: string
): Promise<{ player_id: number; team_id: number | null } | null> {
  const { data, error } = await supabaseAdmin
    .from("players")
    .select("id, team_id")
    .eq("name", playerName)
    .single();
  if (error || !data) {
    return null;
  }
  return { player_id: data.id, team_id: data.team_id };
}

export async function POST(request: NextRequest) {
  // Check for Supabase service role key
  if (!supabaseServiceRoleKey) {
    console.error("Supabase service role key is not configured.");
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  // Initialize Supabase client with admin privileges
  const supabaseAdmin = createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const password = formData.get("password") as string | null;

    // --- Authentication ---
    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid password." },
        { status: 401 }
      );
    }

    // --- File Validation ---
    if (!file) {
      return NextResponse.json(
        { error: "No CSV file provided." },
        { status: 400 }
      );
    }
    if (file.type !== "text/csv") {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a CSV." },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const parseResult = Papa.parse<CsvPlayerStatRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    if (parseResult.errors.length > 0) {
      console.error("CSV Parsing errors:", parseResult.errors);
      return NextResponse.json(
        {
          error: "Failed to parse CSV file.",
          details: parseResult.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }
    if (!parseResult.data || parseResult.data.length === 0) {
      return NextResponse.json(
        { error: "CSV file is empty or contains no data rows." },
        { status: 400 }
      );
    }

    const rows = parseResult.data;

    // Validate consistent match_id, final_score_a, final_score_b
    const firstRow = rows[0];
    const commonMatchIdStr = firstRow.match_id;
    const commonScoreAStr = firstRow.final_score_a;
    const commonScoreBStr = firstRow.final_score_b;

    if (!commonMatchIdStr || !commonScoreAStr || !commonScoreBStr) {
      return NextResponse.json(
        {
          error:
            "CSV missing match_id, final_score_a, or final_score_b in the first row.",
        },
        { status: 400 }
      );
    }

    const matchId = parseInt(commonMatchIdStr, 10);
    const finalScoreA = parseInt(commonScoreAStr, 10);
    const finalScoreB = parseInt(commonScoreBStr, 10);

    if (isNaN(matchId) || isNaN(finalScoreA) || isNaN(finalScoreB)) {
      return NextResponse.json(
        {
          error:
            "Invalid number format for match_id, final_score_a, or final_score_b.",
        },
        { status: 400 }
      );
    }

    const playerStatsToUpsert: PlayerMatchStatInsert[] = [];
    const missingPlayerNames: string[] = [];
    const validationErrors: string[] = [];
    const playerIdsToRecalculate = new Set<number>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowIndex = i + 2; // CSV row number (1-based, plus header)

      if (
        row.match_id !== commonMatchIdStr ||
        row.final_score_a !== commonScoreAStr ||
        row.final_score_b !== commonScoreBStr
      ) {
        validationErrors.push(
          `Row ${rowIndex}: Inconsistent match_id, final_score_a, or final_score_b. Expected ${commonMatchIdStr}, ${commonScoreAStr}, ${commonScoreBStr}.`
        );
        continue;
      }

      const playerInfo = await getPlayerIdAndTeamId(
        supabaseAdmin,
        row.player_name
      );
      if (!playerInfo) {
        if (!missingPlayerNames.includes(row.player_name)) {
          missingPlayerNames.push(row.player_name);
        }
        continue;
      }

      const numericStats: { [key: string]: number | undefined } = {
        flag_captures: parseInt(row.flag_captures, 10),
        flag_returns: parseInt(row.flag_returns, 10),
        bc_kills: parseInt(row.bc_kills, 10),
        dbs_kills: parseInt(row.dbs_kills, 10),
        dfa_kills: parseInt(row.dfa_kills, 10),
        overall_kills: parseInt(row.overall_kills, 10),
        overall_deaths: parseInt(row.overall_deaths, 10),
        flaghold_time: parseInt(row.flaghold_time, 10),
        impact: parseInt(row.impact, 10),
      };

      for (const [key, value] of Object.entries(numericStats)) {
        if (value === undefined || isNaN(value)) {
          validationErrors.push(
            `Row ${rowIndex} ('${
              row.player_name
            }'): Invalid or missing number for ${key}: '${(row as any)[key]}'.`
          );
        }
      }
      if (
        numericStats.impact !== undefined &&
        ![1, 2, 3].includes(numericStats.impact)
      ) {
        validationErrors.push(
          `Row ${rowIndex} ('${row.player_name}'): Impact score must be 1, 2, or 3. Got '${row.impact}'.`
        );
      }

      if (validationErrors.length > 0) continue; // Skip to next row if this one has errors

      playerStatsToUpsert.push({
        match_id: matchId,
        player_id: playerInfo.player_id,
        flag_captures: numericStats.flag_captures as number,
        flag_returns: numericStats.flag_returns as number,
        bc_kills: numericStats.bc_kills as number,
        dbs_kills: numericStats.dbs_kills as number,
        dfa_kills: numericStats.dfa_kills as number,
        overall_kills: numericStats.overall_kills as number,
        overall_deaths: numericStats.overall_deaths as number,
        flaghold_time: numericStats.flaghold_time as number,
        impact: numericStats.impact as number, // Validated to be 1, 2, or 3
      } as PlayerMatchStatInsert);
      playerIdsToRecalculate.add(playerInfo.player_id);
    }

    if (missingPlayerNames.length > 0) {
      return NextResponse.json(
        {
          error:
            "CSV processing failed: The following player names were not found in the database. Please add them or correct the names in the CSV.",
          missing_players: missingPlayerNames,
        },
        { status: 400 }
      );
    }
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "CSV processing failed due to data validation errors.",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // All validations passed, proceed with database operations
    const { error: upsertError } = await supabaseAdmin
      .from("player_match_stats")
      .upsert(playerStatsToUpsert, { onConflict: "match_id,player_id" });

    if (upsertError) {
      console.error("Error upserting player_match_stats:", upsertError);
      return NextResponse.json(
        { error: `Failed to save player match stats: ${upsertError.message}` },
        { status: 500 }
      );
    }

    // Calculate team-level aggregate stats for this match from the just-upserted player_match_stats
    const { data: matchAggregates, error: aggregateError } = await supabaseAdmin
      .from("player_match_stats")
      .select(
        `
            players!inner(team_id),
            overall_kills,
            flag_returns
        `
      )
      .eq("match_id", matchId);

    if (aggregateError) {
      console.error(
        "Error fetching aggregates for match update:",
        aggregateError
      );
      return NextResponse.json(
        {
          error: `Failed to fetch aggregates for match update: ${aggregateError.message}`,
        },
        { status: 500 }
      );
    }

    let teamAKills = 0,
      teamBKills = 0,
      teamAReturns = 0,
      teamBReturns = 0;
    // We need the team_a_id and team_b_id for the match to correctly assign these aggregates
    const { data: matchDetails, error: matchDetailsError } = await supabaseAdmin
      .from("matches")
      .select("team_a_id, team_b_id")
      .eq("id", matchId)
      .single();
    if (matchDetailsError || !matchDetails) {
      console.error(
        "Error fetching match details for team assignment of aggregates:",
        matchDetailsError
      );
      return NextResponse.json(
        {
          error: `Failed to fetch match details for aggregate assignment: ${matchDetailsError?.message}`,
        },
        { status: 500 }
      );
    }

    matchAggregates?.forEach((stat) => {
      const playerTeamId = (stat.players as any)?.team_id;
      if (playerTeamId === matchDetails.team_a_id) {
        teamAKills += stat.overall_kills || 0;
        teamAReturns += stat.flag_returns || 0;
      } else if (playerTeamId === matchDetails.team_b_id) {
        teamBKills += stat.overall_kills || 0;
        teamBReturns += stat.flag_returns || 0;
      }
    });

    // Update the matches table
    const { error: matchUpdateError } = await supabaseAdmin
      .from("matches")
      .update({
        score_a: finalScoreA,
        score_b: finalScoreB,
        is_completed: true,
        team_a_kills: teamAKills,
        team_b_kills: teamBKills,
        team_a_returns: teamAReturns,
        team_b_returns: teamBReturns,
        // team_a_flag_time and team_b_flag_time could also be aggregated if available per player or team in CSV
      })
      .eq("id", matchId);

    if (matchUpdateError) {
      console.error("Error updating matches table:", matchUpdateError);
      return NextResponse.json(
        {
          error: `Failed to update match details: ${matchUpdateError.message}`,
        },
        { status: 500 }
      );
    }

    // Trigger recalculation of lifetime stats for each affected player
    for (const playerId of playerIdsToRecalculate) {
      const { error: playerRecalcError } = await supabaseAdmin.rpc(
        "recalculate_player_lifetime_stats",
        { p_player_id: playerId }
      );
      if (playerRecalcError) {
        console.error(
          `Error recalculating lifetime stats for player ${playerId}:`,
          playerRecalcError
        );
      }
    }

    // Trigger update of team_stats (lifetime team stats)
    const { error: teamRecalcError } = await supabaseAdmin.rpc(
      "update_team_stats_for_match",
      { p_match_id: matchId }
    );
    if (teamRecalcError) {
      console.error(
        `Error updating team_stats for match ${matchId}:`,
        teamRecalcError
      );
    }

    // Revalidate all relevant paths
    revalidatePath("/leaderboards");
    revalidatePath("/teams");
    revalidatePath("/players");
    revalidatePath(`/matches/${matchId}`);

    return NextResponse.json({
      message: `CSV '${file.name}' processed successfully for match ID ${matchId}. ${playerStatsToUpsert.length} players updated.`,
    });
  } catch (error: any) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: `Failed to process CSV: ${error.message}` },
      { status: 500 }
    );
  }
}
