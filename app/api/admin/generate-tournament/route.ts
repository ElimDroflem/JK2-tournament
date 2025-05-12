import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function shuffle<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(req: NextRequest) {
  // Check if matches already exist
  const { data: existingMatches, error: matchError } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true });
  if (matchError) {
    return NextResponse.json({ error: matchError.message }, { status: 500 });
  }
  if (existingMatches && existingMatches.length > 0) {
    return NextResponse.json(
      { error: "Matches already exist. Reset all matches to re-randomise." },
      { status: 400 }
    );
  }

  // Fetch all teams
  const { data: teams, error: teamError } = await supabase
    .from("teams")
    .select("id, name");
  if (teamError) {
    return NextResponse.json({ error: teamError.message }, { status: 500 });
  }
  if (!teams || teams.length < 2) {
    return NextResponse.json(
      { error: "At least 2 teams are required to generate fixtures." },
      { status: 400 }
    );
  }

  // Shuffle teams
  const shuffledTeams = shuffle(teams);

  // Generate group stage matches (each team vs each other twice)
  let fixtures: any[] = [];
  let matchId = 1;
  let matchOrder = 1;
  for (let i = 0; i < shuffledTeams.length; i++) {
    for (let j = i + 1; j < shuffledTeams.length; j++) {
      // Each pair plays twice
      fixtures.push({
        id: matchId++,
        round: "Group",
        team_a_id: shuffledTeams[i].id,
        team_b_id: shuffledTeams[j].id,
        team_a_name: shuffledTeams[i].name,
        team_b_name: shuffledTeams[j].name,
        is_completed: false,
        stage: "group",
        order: matchOrder++,
      });
      fixtures.push({
        id: matchId++,
        round: "Group",
        team_a_id: shuffledTeams[j].id,
        team_b_id: shuffledTeams[i].id,
        team_a_name: shuffledTeams[j].name,
        team_b_name: shuffledTeams[i].name,
        is_completed: false,
        stage: "group",
        order: matchOrder++,
      });
    }
  }

  // Pre-create semi-final and final placeholders (team IDs null for now)
  fixtures.push({
    id: matchId++,
    round: "Semi-final 1",
    team_a_id: null,
    team_b_id: null,
    team_a_name: null,
    team_b_name: null,
    is_completed: false,
    stage: "semi-final",
    order: matchOrder++,
  });
  fixtures.push({
    id: matchId++,
    round: "Semi-final 2",
    team_a_id: null,
    team_b_id: null,
    team_a_name: null,
    team_b_name: null,
    is_completed: false,
    stage: "semi-final",
    order: matchOrder++,
  });
  fixtures.push({
    id: matchId++,
    round: "Final",
    team_a_id: null,
    team_b_id: null,
    team_a_name: null,
    team_b_name: null,
    is_completed: false,
    stage: "final",
    order: matchOrder++,
  });

  // Insert all fixtures into the database (omit date)
  const { error: insertError } = await supabase.from("matches").insert(
    fixtures.map((f) => ({
      id: f.id,
      round: f.round,
      team_a_id: f.team_a_id,
      team_b_id: f.team_b_id,
      is_completed: f.is_completed,
      stage: f.stage,
      order: f.order,
    }))
  );
  if (insertError) {
    // If 'order' column does not exist, try again without it
    if (insertError.message.includes('column "order"')) {
      const { error: fallbackError } = await supabase.from("matches").insert(
        fixtures.map((f) => ({
          id: f.id,
          round: f.round,
          team_a_id: f.team_a_id,
          team_b_id: f.team_b_id,
          is_completed: f.is_completed,
          stage: f.stage,
        }))
      );
      if (fallbackError) {
        return NextResponse.json(
          { error: fallbackError.message },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ fixtures });
}
