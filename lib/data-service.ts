import { supabase, isSupabaseConfigured } from "./supabase";
import {
  teams as staticTeams,
  players as staticPlayers,
  matchHistory as staticMatchHistory,
  upcomingMatches as staticUpcomingMatches,
} from "./data";
import type { Database, Tables, Enums } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

// Define more specific types for what our service functions will return
// These can be adjusted based on exact frontend needs

export type Team = Tables<"teams">;
export type Player = Tables<"players">;
export type Match = Tables<"matches">;
export type TeamStats = Tables<"team_stats">;
export type PlayerStats = Tables<"player_stats">;

export interface TeamWithStatsAndPlayers extends Team {
  team_stats: TeamStats | null;
  players_list: Pick<Player, "id" | "name">[]; // Only basic player info for the list
}

export interface PlayerWithStatsAndTeamName extends Player {
  player_stats: PlayerStats | null;
  team_name: string | null;
}

export interface MatchWithTeamNames extends Match {
  team_a_name: string | null;
  team_b_name: string | null;
  order?: number;
}

// Cache management
let teamsCache: TeamWithStatsAndPlayers[] | null = null;
let playersCache: PlayerWithStatsAndTeamName[] | null = null;
let matchHistoryCache: MatchWithTeamNames[] | null = null;
let upcomingMatchesCache: MatchWithTeamNames[] | null = null; // Upcoming matches will also have team names
let lastCacheUpdate = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper to check if cache is stale
function isCacheStale() {
  return Date.now() - lastCacheUpdate > CACHE_TTL;
}

// Reset cache
export function resetCache() {
  console.log("Resetting data cache...");
  teamsCache = null;
  playersCache = null;
  matchHistoryCache = null;
  upcomingMatchesCache = null;
  lastCacheUpdate = 0;
}

// Helper to get Supabase client, ensuring it's configured
function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!supabase || !isSupabaseConfigured()) {
    return null;
  }
  return supabase as SupabaseClient<Database>;
}

// Get teams data with real-time updates
export async function getTeams(): Promise<TeamWithStatsAndPlayers[]> {
  if (teamsCache && !isCacheStale()) {
    return teamsCache;
  }

  const client = getSupabaseClient();
  if (!client) {
    console.log("Supabase not configured, using static data for teams");
    return staticTeams as any;
  }

  try {
    const { data: teamsData, error: teamsError } = await client
      .from("teams")
      .select(
        `
        *,
        team_stats (*),
        players_list:players (
          id,
          name,
          role,
          player_stats (*)
        )
      `
      )
      .order("name", { ascending: true });

    if (teamsError) {
      console.error("Error fetching teams from Supabase:", teamsError.message);
      return staticTeams as any;
    }

    if (!teamsData) {
      return [];
    }

    const formattedTeams = teamsData.map((team) => ({
      ...team,
      team_stats: Array.isArray(team.team_stats)
        ? team.team_stats[0] || null
        : team.team_stats || null,
      players_list: team.players_list || [],
    }));

    teamsCache = formattedTeams;
    lastCacheUpdate = Date.now();
    return formattedTeams;
  } catch (error: any) {
    console.error("Error in getTeams:", error.message);
    return staticTeams as any;
  }
}

// Get players data with real-time updates
export async function getPlayers(): Promise<PlayerWithStatsAndTeamName[]> {
  if (playersCache && !isCacheStale()) {
    return playersCache;
  }

  const client = getSupabaseClient();
  if (!client) {
    console.log("Supabase not configured, using static data for players");
    return staticPlayers as any;
  }

  try {
    const { data: playersData, error: playersError } = await client
      .from("players")
      .select(
        `
        *,
        player_stats (*),
        teams (name)
      `
      )
      .order("name", { ascending: true });

    if (playersError) {
      console.error(
        "Error fetching players from Supabase:",
        playersError.message
      );
      return staticPlayers as any;
    }

    if (!playersData) {
      return [];
    }

    const formattedPlayers = playersData.map((player) => {
      const team = player.teams as Tables<"teams"> | null;
      return {
        ...player,
        player_stats: Array.isArray(player.player_stats)
          ? player.player_stats[0] || null
          : player.player_stats || null,
        team_name: team?.name || "N/A",
        teams: undefined,
      };
    });

    playersCache = formattedPlayers;
    lastCacheUpdate = Date.now();
    return formattedPlayers;
  } catch (error: any) {
    console.error("Error in getPlayers:", error.message);
    return staticPlayers as any;
  }
}

// Get match history data (completed matches)
export async function getMatchHistory(): Promise<MatchWithTeamNames[]> {
  if (matchHistoryCache) {
    return matchHistoryCache;
  }
  const client = getSupabaseClient();
  if (!client) {
    console.log("Supabase not configured, using static data for match history");
    return staticMatchHistory as any; // Adjust static data shape if necessary
  }

  try {
    const { data: matchesData, error: matchesError } = await client
      .from("matches")
      .select(
        `
        *,
        team_a:teams!matches_team_a_id_fkey (name),
        team_b:teams!matches_team_b_id_fkey (name)
      `
      )
      .eq("is_completed", true)
      .order("order", { ascending: true });

    if (matchesError) {
      console.error(
        "Error fetching match history from Supabase:",
        matchesError.message
      );
      return staticMatchHistory as any;
    }
    if (!matchesData) return [];

    const formattedMatches: MatchWithTeamNames[] = matchesData.map((match) => ({
      ...match,
      team_a_name: (match.team_a as any)?.name || "N/A",
      team_b_name: (match.team_b as any)?.name || "N/A",
      team_a: undefined, // clean up
      team_b: undefined, // clean up
    }));

    matchHistoryCache = formattedMatches;
    return formattedMatches;
  } catch (error: any) {
    console.error("Error in getMatchHistory:", error.message);
    return staticMatchHistory as any;
  }
}

// Get upcoming matches data (non-completed matches)
export async function getUpcomingMatches(): Promise<MatchWithTeamNames[]> {
  if (upcomingMatchesCache) {
    return upcomingMatchesCache;
  }
  const client = getSupabaseClient();
  if (!client) {
    console.log(
      "Supabase not configured, using static data for upcoming matches"
    );
    return staticUpcomingMatches as any; // Adjust static data shape
  }
  try {
    const { data: matchesData, error: matchesError } = await client
      .from("matches")
      .select(
        `
        *,
        team_a:teams!matches_team_a_id_fkey (name),
        team_b:teams!matches_team_b_id_fkey (name)
      `
      )
      .eq("is_completed", false)
      .order("order", { ascending: true });

    if (matchesError) {
      console.error(
        "Error fetching upcoming matches from Supabase:",
        matchesError.message
      );
      return staticUpcomingMatches as any;
    }
    if (!matchesData) return [];

    const formattedMatches: MatchWithTeamNames[] = matchesData.map((match) => ({
      ...match,
      team_a_name: (match.team_a as any)?.name || "N/A",
      team_b_name: (match.team_b as any)?.name || "N/A",
      team_a: undefined, // clean up
      team_b: undefined, // clean up
    }));

    upcomingMatchesCache = formattedMatches;
    return formattedMatches;
  } catch (error: any) {
    console.error("Error in getUpcomingMatches:", error.message);
    return staticUpcomingMatches as any;
  }
}

// Get a specific team by ID
export async function getTeamById(
  id: number
): Promise<TeamWithStatsAndPlayers | null> {
  // Try to get from cache first (implementation detail: might need to ensure cache is populated)
  if (teamsCache) {
    const cachedTeam = teamsCache.find((t) => t.id === id);
    if (cachedTeam) return cachedTeam;
  }

  const client = getSupabaseClient();
  if (!client) {
    console.log(
      `Supabase not configured, attempting to find team ID ${id} in static data.`
    );
    // TODO: Adjust staticTeams structure or provide a mapping function
    return (staticTeams as any[]).find((t) => t.id === id) || null;
  }

  try {
    const { data: teamData, error: teamError } = await client
      .from("teams")
      .select(
        `
        *,
        team_stats (*),
        players (id, name)
      `
      )
      .eq("id", id)
      .single();

    if (teamError) {
      console.error(
        `Error fetching team ID ${id} from Supabase:`,
        teamError.message
      );
      return null;
    }
    if (!teamData) return null;

    const formattedTeam: TeamWithStatsAndPlayers = {
      ...teamData,
      team_stats: Array.isArray(teamData.team_stats)
        ? teamData.team_stats[0] || null
        : teamData.team_stats || null,
      players_list: teamData.players || [],
    };

    // Optionally, update the cache
    if (teamsCache) {
      const index = teamsCache.findIndex((t) => t.id === id);
      if (index !== -1) teamsCache[index] = formattedTeam;
      else teamsCache.push(formattedTeam);
    } else {
      teamsCache = [formattedTeam];
    }
    return formattedTeam;
  } catch (error: any) {
    console.error(`Error in getTeamById for ID ${id}:`, error.message);
    return null;
  }
}

// Get a specific player by ID
export async function getPlayerById(
  id: number
): Promise<PlayerWithStatsAndTeamName | null> {
  if (playersCache) {
    const cachedPlayer = playersCache.find((p) => p.id === id);
    if (cachedPlayer) return cachedPlayer;
  }

  const client = getSupabaseClient();
  if (!client) {
    console.log(
      `Supabase not configured, attempting to find player ID ${id} in static data.`
    );
    return (staticPlayers as any[]).find((p) => p.id === id) || null;
  }

  try {
    const { data: playerData, error: playerError } = await client
      .from("players")
      .select(
        `
        *,
        player_stats (*),
        teams (name) 
      `
      )
      .eq("id", id)
      .single();

    if (playerError) {
      console.error(
        `Error fetching player ID ${id} from Supabase:`,
        playerError.message
      );
      return null;
    }
    if (!playerData) return null;

    const team = playerData.teams as Tables<"teams"> | null;
    const formattedPlayer: PlayerWithStatsAndTeamName = {
      ...playerData,
      player_stats: Array.isArray(playerData.player_stats)
        ? playerData.player_stats[0] || null
        : playerData.player_stats || null,
      team_name: team?.name || "N/A",
      teams: undefined, // clean up
    } as PlayerWithStatsAndTeamName;

    // Optionally, update the cache
    if (playersCache) {
      const index = playersCache.findIndex((p) => p.id === id);
      if (index !== -1) playersCache[index] = formattedPlayer;
      else playersCache.push(formattedPlayer);
    } else {
      playersCache = [formattedPlayer];
    }
    return formattedPlayer;
  } catch (error: any) {
    console.error(`Error in getPlayerById for ID ${id}:`, error.message);
    return null;
  }
}

// Get a specific match by ID
export async function getMatchById(
  id: number
): Promise<MatchWithTeamNames | null> {
  if (matchHistoryCache) {
    const cachedMatch = matchHistoryCache.find((m) => m.id === id);
    if (cachedMatch) return cachedMatch;
  }
  if (upcomingMatchesCache) {
    const cachedMatch = upcomingMatchesCache.find((m) => m.id === id);
    if (cachedMatch) return cachedMatch;
  }

  const client = getSupabaseClient();
  if (!client) {
    console.log(
      `Supabase not configured, attempting to find match ID ${id} in static data.`
    );
    // Assuming staticMatchHistory and staticUpcomingMatches items are now shaped like MatchWithTeamNames
    // or have a compatible structure. If not, they need adjustment or a mapping function.
    const staticMatchFromHistory = staticMatchHistory.find(
      (m: any) => m.id === id
    ) as MatchWithTeamNames | undefined;
    if (staticMatchFromHistory) return staticMatchFromHistory;
    const staticMatchUpcoming = staticUpcomingMatches.find(
      (m: any) => m.id === id
    ) as MatchWithTeamNames | undefined;
    return staticMatchUpcoming || null;
  }

  try {
    const { data: matchData, error: matchError } = await client
      .from("matches")
      .select(
        `
        *,
        team_a:teams!matches_team_a_id_fkey (name),
        team_b:teams!matches_team_b_id_fkey (name)
      `
      )
      .eq("id", id)
      .single();

    if (matchError) {
      console.error(
        `Error fetching match ID ${id} from Supabase:`,
        matchError.message
      );
      return null;
    }
    if (!matchData) return null;

    const formattedMatch: MatchWithTeamNames = {
      ...matchData,
      team_a_name: (matchData.team_a as any)?.name || "N/A",
      team_b_name: (matchData.team_b as any)?.name || "N/A",
    };

    // Optionally, update the appropriate cache
    if (formattedMatch.is_completed) {
      if (matchHistoryCache) {
        const index = matchHistoryCache.findIndex((m) => m.id === id);
        if (index !== -1) matchHistoryCache[index] = formattedMatch;
        else matchHistoryCache.push(formattedMatch);
      } else {
        matchHistoryCache = [formattedMatch];
      }
    } else {
      if (upcomingMatchesCache) {
        const index = upcomingMatchesCache.findIndex((m) => m.id === id);
        if (index !== -1) upcomingMatchesCache[index] = formattedMatch;
        else upcomingMatchesCache.push(formattedMatch);
      } else {
        upcomingMatchesCache = [formattedMatch];
      }
    }
    return formattedMatch;
  } catch (error: any) {
    console.error(`Error in getMatchById for ID ${id}:`, error.message);
    return null;
  }
}

// Get unassigned players (players with team_id = null)
export async function getUnassignedPlayers(): Promise<
  PlayerWithStatsAndTeamName[]
> {
  const client = getSupabaseClient();
  if (!client) {
    console.log("Supabase not configured, cannot fetch unassigned players.");
    return [];
  }

  try {
    const { data: playersData, error: playersError } = await client
      .from("players")
      .select(
        `
        *,\n        player_stats (*),\n        teams (name) \n      `
      )
      .is("team_id", null) // Filter for team_id IS NULL
      .order("name", { ascending: true });

    if (playersError) {
      console.error(
        "Error fetching unassigned players from Supabase:",
        playersError.message
      );
      return [];
    }
    if (!playersData) {
      return [];
    }

    const formattedPlayers: PlayerWithStatsAndTeamName[] = playersData.map(
      (player) => {
        const team = player.teams as Tables<"teams"> | null;
        return {
          ...player,
          player_stats: Array.isArray(player.player_stats)
            ? player.player_stats[0] || null
            : player.player_stats || null,
          team_name: team?.name || "N/A", // Should be N/A for unassigned
          teams: undefined,
        } as PlayerWithStatsAndTeamName;
      }
    );

    return formattedPlayers;
  } catch (error: any) {
    console.error("Error in getUnassignedPlayers:", error.message);
    return [];
  }
}

// Subscribe to real-time updates
export function subscribeToUpdates(
  onTeamsUpdate: (teams: TeamWithStatsAndPlayers[]) => void,
  onPlayersUpdate: (players: PlayerWithStatsAndTeamName[]) => void
) {
  const client = getSupabaseClient();
  if (!client) return;

  // Subscribe to team_stats changes
  client
    .channel("team_stats_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "team_stats",
      },
      async () => {
        const teams = await getTeams();
        onTeamsUpdate(teams);
      }
    )
    .subscribe();

  // Subscribe to player_stats changes
  client
    .channel("player_stats_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "player_stats",
      },
      async () => {
        const players = await getPlayers();
        onPlayersUpdate(players);
      }
    )
    .subscribe();
}
