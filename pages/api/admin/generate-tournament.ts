import type { NextApiRequest, NextApiResponse } from "next";
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check if matches already exist
  const { data: existingMatches, error: matchError } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true });
  if (matchError) {
    return res.status(500).json({ error: matchError.message });
  }
  if (existingMatches && existingMatches.length > 0) {
    return res
      .status(400)
      .json({
        error: "Matches already exist. Reset all matches to re-randomise.",
      });
  }

  // Fetch all teams
  const { data: teams, error: teamError } = await supabase
    .from("teams")
    .select("id, name");
  if (teamError) {
    return res.status(500).json({ error: teamError.message });
  }
  if (!teams || teams.length < 2) {
    return res
      .status(400)
      .json({ error: "At least 2 teams are required to generate fixtures." });
  }

  // Shuffle teams
  const shuffledTeams = shuffle(teams);

  // Generate group stage matches (each team vs each other twice)
  let fixtures: any[] = [];
  let matchId = 1;
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
        date: null,
        is_completed: false,
        stage: "group",
      });
      fixtures.push({
        id: matchId++,
        round: "Group",
        team_a_id: shuffledTeams[j].id,
        team_b_id: shuffledTeams[i].id,
        team_a_name: shuffledTeams[j].name,
        team_b_name: shuffledTeams[i].name,
        date: null,
        is_completed: false,
        stage: "group",
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
    date: null,
    is_completed: false,
    stage: "semi-final",
  });
  fixtures.push({
    id: matchId++,
    round: "Semi-final 2",
    team_a_id: null,
    team_b_id: null,
    team_a_name: null,
    team_b_name: null,
    date: null,
    is_completed: false,
    stage: "semi-final",
  });
  fixtures.push({
    id: matchId++,
    round: "Final",
    team_a_id: null,
    team_b_id: null,
    team_a_name: null,
    team_b_name: null,
    date: null,
    is_completed: false,
    stage: "final",
  });

  // Insert all fixtures into the database
  const { error: insertError } = await supabase.from("matches").insert(
    fixtures.map((f) => ({
      id: f.id,
      round: f.round,
      team_a_id: f.team_a_id,
      team_b_id: f.team_b_id,
      date: f.date,
      is_completed: f.is_completed,
      stage: f.stage,
    }))
  );
  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  res.status(200).json({ fixtures });
}
