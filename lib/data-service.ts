import { supabase, isSupabaseConfigured } from "./supabase";
import {
  teams as staticTeams,
  players as staticPlayers,
  matchHistory as staticMatchHistory,
  upcomingMatches as staticUpcomingMatches,
} from "./data";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Cache for data
let teamsCache: any[] | null = null;
let playersCache: any[] | null = null;
let matchHistoryCache: any[] | null = null;
let upcomingMatchesCache: any[] | null = null;

// Reset the cache (useful for admin operations)
export function resetCache() {
  console.log("Resetting data cache...");
  teamsCache = null;
  playersCache = null;
  matchHistoryCache = null;
  upcomingMatchesCache = null;
}

// Function to format team data from Supabase to match our app's structure
function formatTeamData(team: any, teamStats: any, teamPlayers: string[]) {
  return {
    id: team.id,
    name: team.name || "Unknown Team",
    founded: team.founded || "Unknown",
    players: teamPlayers || [],
    stats: {
      matchesPlayed: teamStats?.matches_played || 0,
      matchesWon: teamStats?.matches_won || 0,
      matchesDrawn: teamStats?.matches_drawn || 0,
      matchesLost: teamStats?.matches_lost || 0,
      captures: teamStats?.captures || 0,
      flagReturns: teamStats?.flag_returns || 0,
      kills: teamStats?.kills || 0,
      points: teamStats?.points || 0,
    },
  };
}

// Function to format player data from Supabase to match our app's structure
function formatPlayerData(player: any, playerStats: any, teamName: string) {
  return {
    id: player.id,
    name: player.name || "Unknown Player",
    team: teamName || "Unknown Team",
    team_id: player.team_id || 0,
    role: player.role || "Player",
    stats: {
      impact: playerStats?.impact || 0,
      flagCaptures: playerStats?.flag_captures || 0,
      flagReturns: playerStats?.flag_returns || 0,
      bcKills: playerStats?.bc_kills || 0,
      dbsKills: playerStats?.dbs_kills || 0,
      dfaKills: playerStats?.dfa_kills || 0,
      overallKills: playerStats?.overall_kills || 0,
      overallDeaths: playerStats?.overall_deaths || 0,
      flagholdTime: playerStats?.flaghold_time || 0,
      nemesisId: playerStats?.nemesis_id || null,
    },
  };
}

// Function to format match data from Supabase to match our app's structure
function formatMatchData(match: any, teamAName: string, teamBName: string) {
  return {
    id: match.id,
    round: match.round || "Unknown Round",
    teamA: teamAName || "Unknown Team A",
    teamB: teamBName || "Unknown Team B",
    scoreA: match.score_a || 0,
    scoreB: match.score_b || 0,
    date: match.date || "TBD",
    time: match.time || "TBD",
    teamAReturns: match.team_a_returns || 0,
    teamBReturns: match.team_b_returns || 0,
    teamAKills: match.team_a_kills || 0,
    teamBKills: match.team_b_kills || 0,
    teamAFlagTime: match.team_a_flag_time || 0,
    teamBFlagTime: match.team_b_flag_time || 0,
    is_completed: match.is_completed || false,
  };
}

// Get teams data
export async function getTeams() {
  try {
    // Check if we have cached data
    if (teamsCache) {
      return teamsCache;
    }

    // Check if Supabase is configured
    if (!supabase || !isSupabaseConfigured()) {
      console.log("Supabase not configured, using static data for teams");
      return staticTeams;
    }

    const client = supabase as SupabaseClient<Database>;

    // Try to fetch from Supabase
    const { data: teamsData, error: teamsError } = await client
      .from("teams")
      .select("*")
      .order("id");

    if (teamsError || !teamsData) {
      console.error("Error fetching teams from Supabase:", teamsError);
      // Fall back to static data
      return staticTeams;
    }

    // Get team stats
    const { data: teamStatsData, error: teamStatsError } = await client
      .from("team_stats")
      .select("*");

    if (teamStatsError) {
      console.error("Error fetching team stats from Supabase:", teamStatsError);
      // Fall back to static data
      return staticTeams;
    }

    // Get players for each team
    const { data: playersData, error: playersError } = await client
      .from("players")
      .select("*");

    if (playersError) {
      console.error("Error fetching players from Supabase:", playersError);
      // Fall back to static data
      return staticTeams;
    }

    // Format the data
    const formattedTeams = teamsData.map((team) => {
      const teamStats = teamStatsData?.find(
        (stats) => stats.team_id === team.id
      );
      const teamPlayers =
        playersData
          ?.filter((player) => player.team_id === team.id)
          .map((player) => player.name) || [];

      return formatTeamData(team, teamStats, teamPlayers);
    });

    // Cache the formatted data
    teamsCache = formattedTeams;
    return formattedTeams;
  } catch (error) {
    console.error("Error in getTeams:", error);
    // Fall back to static data
    return staticTeams;
  }
}

// Get players data
export async function getPlayers() {
  try {
    // Check if we have cached data
    if (playersCache) {
      return playersCache;
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, using static data for players");
      return staticPlayers;
    }

    // Try to fetch from Supabase
    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("*")
      .order("id");

    if (playersError || !playersData) {
      console.error("Error fetching players from Supabase:", playersError);
      // Fall back to static data
      return staticPlayers;
    }

    // Get player stats
    const { data: playerStatsData, error: playerStatsError } = await supabase
      .from("player_stats")
      .select("*");

    if (playerStatsError) {
      console.error(
        "Error fetching player stats from Supabase:",
        playerStatsError
      );
      // Fall back to static data
      return staticPlayers;
    }

    // Get teams for mapping team names
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("*");

    if (teamsError) {
      console.error("Error fetching teams from Supabase:", teamsError);
      // Fall back to static data
      return staticPlayers;
    }

    // Format the data
    const formattedPlayers = playersData.map((player) => {
      const playerStats = playerStatsData?.find(
        (stats) => stats.player_id === player.id
      );
      const team = teamsData?.find((team) => team.id === player.team_id);
      const teamName = team?.name || "Unknown Team";

      return formatPlayerData(player, playerStats, teamName);
    });

    // Cache the formatted data
    playersCache = formattedPlayers;
    return formattedPlayers;
  } catch (error) {
    console.error("Error in getPlayers:", error);
    // Fall back to static data
    return staticPlayers;
  }
}

// Get match history data
export async function getMatchHistory() {
  try {
    // Check if we have cached data
    if (matchHistoryCache) {
      return matchHistoryCache;
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log(
        "Supabase not configured, using static data for match history"
      );
      return staticMatchHistory;
    }

    // Try to fetch from Supabase
    const { data: matchesData, error: matchesError } = await supabase
      .from("matches")
      .select("*")
      .eq("is_completed", true)
      .order("date", { ascending: false });

    if (matchesError || !matchesData) {
      console.error(
        "Error fetching match history from Supabase:",
        matchesError
      );
      // Fall back to static data
      return staticMatchHistory;
    }

    // Get teams for mapping team names
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("*");

    if (teamsError) {
      console.error("Error fetching teams from Supabase:", teamsError);
      // Fall back to static data
      return staticMatchHistory;
    }

    // Format the data
    const formattedMatches = matchesData.map((match) => {
      const teamA = teamsData?.find((team) => team.id === match.team_a_id);
      const teamB = teamsData?.find((team) => team.id === match.team_b_id);
      const teamAName = teamA?.name || "Unknown Team";
      const teamBName = teamB?.name || "Unknown Team";

      return formatMatchData(match, teamAName, teamBName);
    });

    // Cache the formatted data
    matchHistoryCache = formattedMatches;
    return formattedMatches;
  } catch (error) {
    console.error("Error in getMatchHistory:", error);
    // Fall back to static data
    return staticMatchHistory;
  }
}

// Get upcoming matches data
export async function getUpcomingMatches() {
  try {
    // Check if we have cached data
    if (upcomingMatchesCache) {
      return upcomingMatchesCache;
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log(
        "Supabase not configured, using static data for upcoming matches"
      );
      return staticUpcomingMatches;
    }

    // Try to fetch from Supabase
    const { data: matchesData, error: matchesError } = await supabase
      .from("matches")
      .select("*")
      .eq("is_completed", false)
      .order("date");

    if (matchesError || !matchesData) {
      console.error(
        "Error fetching upcoming matches from Supabase:",
        matchesError
      );
      // Fall back to static data
      return staticUpcomingMatches;
    }

    // Get teams for mapping team names
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("*");

    if (teamsError) {
      console.error("Error fetching teams from Supabase:", teamsError);
      // Fall back to static data
      return staticUpcomingMatches;
    }

    // Format the data
    const formattedMatches = matchesData.map((match) => {
      const teamA = teamsData?.find((team) => team.id === match.team_a_id);
      const teamB = teamsData?.find((team) => team.id === match.team_b_id);
      const teamAName = teamA?.name || "Unknown Team";
      const teamBName = teamB?.name || "Unknown Team";

      return {
        id: match.id,
        round: match.round || "Unknown Round",
        teamA: teamAName,
        teamB: teamBName,
        date: match.date || "TBD",
        time: match.time || "TBD",
      };
    });

    // Cache the formatted data
    upcomingMatchesCache = formattedMatches;
    return formattedMatches;
  } catch (error) {
    console.error("Error in getUpcomingMatches:", error);
    // Fall back to static data
    return staticUpcomingMatches;
  }
}

// Get a specific team by ID
export async function getTeamById(id: number) {
  try {
    // Try to get from cache first
    const teams = await getTeams();
    const team = teams.find((t) => t.id === id);
    if (team) {
      return team;
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, using static data for team");
      return staticTeams.find((t) => t.id === id);
    }

    // If not in cache, try to fetch directly
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", id)
      .single();

    if (teamError || !teamData) {
      console.error("Error fetching team from Supabase:", teamError);
      // Fall back to static data
      return staticTeams.find((t) => t.id === id);
    }

    // Get team stats
    const { data: teamStatsData, error: teamStatsError } = await supabase
      .from("team_stats")
      .select("*")
      .eq("team_id", id)
      .single();

    if (teamStatsError) {
      console.error("Error fetching team stats from Supabase:", teamStatsError);
      // Fall back to static data
      return staticTeams.find((t) => t.id === id);
    }

    // Get players for the team
    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("*")
      .eq("team_id", id);

    if (playersError) {
      console.error("Error fetching players from Supabase:", playersError);
      // Fall back to static data
      return staticTeams.find((t) => t.id === id);
    }

    const teamPlayers = playersData?.map((player) => player.name) || [];
    return formatTeamData(teamData, teamStatsData, teamPlayers);
  } catch (error) {
    console.error("Error in getTeamById:", error);
    // Fall back to static data
    return staticTeams.find((t) => t.id === id);
  }
}

// Get a specific player by ID
export async function getPlayerById(id: number) {
  try {
    // Try to get from cache first
    const players = await getPlayers();
    const player = players.find((p) => p.id === id);
    if (player) {
      return player;
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, using static data for player");
      return staticPlayers.find((p) => p.id === id);
    }

    // If not in cache, try to fetch directly
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

    if (playerError || !playerData) {
      console.error("Error fetching player from Supabase:", playerError);
      // Fall back to static data
      return staticPlayers.find((p) => p.id === id);
    }

    // Get player stats
    const { data: playerStatsData, error: playerStatsError } = await supabase
      .from("player_stats")
      .select("*")
      .eq("player_id", id)
      .single();

    if (playerStatsError) {
      console.error(
        "Error fetching player stats from Supabase:",
        playerStatsError
      );
      // Fall back to static data
      return staticPlayers.find((p) => p.id === id);
    }

    // Get team for the player
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", playerData.team_id)
      .single();

    if (teamError) {
      console.error("Error fetching team from Supabase:", teamError);
      // Fall back to static data
      return staticPlayers.find((p) => p.id === id);
    }

    return formatPlayerData(playerData, playerStatsData, teamData.name);
  } catch (error) {
    console.error("Error in getPlayerById:", error);
    // Fall back to static data
    return staticPlayers.find((p) => p.id === id);
  }
}

// Get a specific match by ID
export async function getMatchById(id: number) {
  try {
    // Try to get from cache first
    const matchHistory = await getMatchHistory();
    const match = matchHistory.find((m) => m.id === id);
    if (match) {
      return match;
    }

    const upcomingMatches = await getUpcomingMatches();
    const upcomingMatch = upcomingMatches.find((m) => m.id === id);
    if (upcomingMatch) {
      return upcomingMatch;
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, using static data for match");
      const staticMatch =
        staticMatchHistory.find((m) => m.id === id) ||
        staticUpcomingMatches.find((m) => m.id === id);
      if (!staticMatch) {
        console.log(`Match with ID ${id} not found in static data`);
        return null;
      }
      return staticMatch;
    }

    // If not in cache, try to fetch directly
    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("id", id)
      .single();

    if (matchError || !matchData) {
      console.error(
        `Error fetching match with ID ${id} from Supabase:`,
        matchError
      );
      // Return null to indicate match not found
      return null;
    }

    // Get teams for the match
    const { data: teamAData, error: teamAError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", matchData.team_a_id)
      .single();

    const { data: teamBData, error: teamBError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", matchData.team_b_id)
      .single();

    if (teamAError || teamBError) {
      console.error(
        "Error fetching teams from Supabase:",
        teamAError || teamBError
      );
      // Return null to indicate match not found
      return null;
    }

    if (matchData.is_completed) {
      return formatMatchData(matchData, teamAData.name, teamBData.name);
    } else {
      return {
        id: matchData.id,
        round: matchData.round,
        teamA: teamAData.name,
        teamB: teamBData.name,
        date: matchData.date,
        time: matchData.time || "",
      };
    }
  } catch (error) {
    console.error(`Error in getMatchById for ID ${id}:`, error);
    // Return null to indicate match not found
    return null;
  }
}
