import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminApiPassword =
  process.env.ADMIN_API_PASSWORD || "samsmum_api_default";

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
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    const { playerName, teamId, password } = await request.json(); // teamId can be null

    if (password !== adminApiPassword) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API password." },
        { status: 401 }
      );
    }

    if (
      !playerName ||
      typeof playerName !== "string" ||
      playerName.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Invalid player name provided." },
        { status: 400 }
      );
    }

    if (teamId !== null && typeof teamId !== "number") {
      return NextResponse.json(
        { error: "Invalid team ID provided. Must be a number or null." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("players")
      .insert({
        name: playerName.trim(),
        team_id: teamId,
        // other fields like 'created_at' will be handled by Supabase defaults/triggers
      })
      .select()
      .single(); // Expecting a single record to be created and returned

    if (error) {
      console.error("Error creating player:", error);
      // Check for unique constraint violation on player name if applicable
      if (error.code === "23505") {
        // PostgreSQL unique violation code
        return NextResponse.json(
          { error: `Player with name '${playerName.trim()}\' already exists.` },
          { status: 409 } // Conflict
        );
      }
      return NextResponse.json(
        { error: `Failed to create player: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      // Should not happen if insert was successful and no error, but as a safeguard
      return NextResponse.json(
        { error: "Failed to create player, no data returned." },
        { status: 500 }
      );
    }

    // Create a corresponding player_stats entry
    const { error: statsError } = await supabaseAdmin
      .from("player_stats")
      .insert({ player_id: data.id }); // Initialize with default stats

    if (statsError) {
      console.error(
        `Failed to create player_stats for new player ${data.id}:`,
        statsError
      );
      // If this fails, the player is created but stats aren't.
      // This is a partial success. Decide on error handling:
      // Option 1: Delete the player and return full error (atomic)
      // Option 2: Return success for player creation but warn about stats (what I'll do here)
      return NextResponse.json({
        message: `Player '${data.name}' created successfully, but failed to initialize player_stats. Please create stats manually. `,
        newPlayer: data,
        warning: `Failed to initialize player_stats: ${statsError.message}`,
      });
    }

    return NextResponse.json({
      message: `Player '${data.name}' created and assigned successfully.`,
      newPlayer: data,
    });
  } catch (error: any) {
    console.error("API Error in create-player-and-assign:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
