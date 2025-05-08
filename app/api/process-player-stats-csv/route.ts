import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// import Papa from 'papaparse'; // Will need to install papaparse
import type { Database } from "@/types/supabase";

// IMPORTANT: Use environment variables for Supabase credentials
// Ensure these are set in your Vercel/deployment environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use the SERVICE ROLE KEY for admin operations - DO NOT EXPOSE THIS PUBLICLY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminPassword = process.env.ADMIN_UPLOAD_PASSWORD || "samsmum"; // Use env var or default

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

    // --- CSV Processing (Placeholder) ---
    console.log(`Processing file: ${file.name}`);
    // TODO:
    // 1. Read file content: const csvText = await file.text();
    // 2. Parse CSV: const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    // 3. Validate headers/required columns (match_id, player_identifier, stats...)
    // 4. Iterate through parsedData.data
    // 5. For each row:
    //    - Find player_id from player_identifier
    //    - Update player_stats using INSERT ON CONFLICT
    //    - Aggregate scores per team for the match_id
    // 6. After loop:
    //    - Update the matches table row (score_a, score_b, is_completed = true)
    //    - Call Supabase DB function: supabaseAdmin.rpc('update_team_stats_for_match', { p_match_id: matchId })

    // --- Placeholder Success Response ---
    return NextResponse.json({
      message: `CSV '${file.name}' received. Processing logic not yet implemented.`,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
