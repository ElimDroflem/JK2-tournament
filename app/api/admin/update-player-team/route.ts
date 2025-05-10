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
    const { playerId, newTeamId, password } = await request.json();

    if (password !== adminApiPassword) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API password." },
        { status: 401 }
      );
    }

    if (!playerId || typeof playerId !== "number") {
      return NextResponse.json(
        { error: "Invalid player ID provided." },
        { status: 400 }
      );
    }

    // newTeamId can be a number (team_id) or null (to unassign)
    if (newTeamId !== null && typeof newTeamId !== "number") {
      return NextResponse.json(
        { error: "Invalid new team ID provided. Must be a number or null." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("players")
      .update({ team_id: newTeamId })
      .eq("id", playerId)
      .select();

    if (error) {
      console.error("Error updating player's team:", error);
      return NextResponse.json(
        { error: `Failed to update player\'s team: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: `Player with ID ${playerId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Player ${data[0].name} team assignment updated successfully.`,
      updatedPlayer: data[0],
    });
  } catch (error: any) {
    console.error("API Error in update-player-team:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
