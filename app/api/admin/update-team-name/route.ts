import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use a specific password for admin API actions, distinct from the panel access password
// or CSV upload password for more granular control if needed.
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
    const { teamId, newName, password } = await request.json();

    if (password !== adminApiPassword) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API password." },
        { status: 401 }
      );
    }

    if (!teamId || typeof teamId !== "number") {
      return NextResponse.json(
        { error: "Invalid team ID provided." },
        { status: 400 }
      );
    }

    if (!newName || typeof newName !== "string" || newName.trim() === "") {
      return NextResponse.json(
        { error: "Invalid new team name provided." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("teams")
      .update({ name: newName.trim() })
      .eq("id", teamId)
      .select();

    if (error) {
      console.error("Error updating team name:", error);
      return NextResponse.json(
        { error: `Failed to update team name: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: `Team with ID ${teamId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Team name updated successfully to '${data[0].name}'.`,
      updatedTeam: data[0],
    });
  } catch (error: any) {
    console.error("API Error in update-team-name:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
