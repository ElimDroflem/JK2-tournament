import { supabase } from "../lib/supabase"
import { teams, players, matchHistory, upcomingMatches } from "../lib/data"

async function migrateData() {
  try {
    console.log("Starting data migration to Supabase...")

    // Migrate teams
    console.log("Migrating teams...")
    for (const team of teams) {
      // Insert team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({
          id: team.id,
          name: team.name,
          founded: team.founded,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (teamError) {
        console.error(`Error inserting team ${team.name}:`, teamError)
        continue
      }

      // Insert team stats
      const { error: statsError } = await supabase.from("team_stats").insert({
        team_id: team.id,
        matches_played: team.stats.matchesPlayed,
        matches_won: team.stats.matchesWon,
        matches_drawn: team.stats.matchesDrawn,
        matches_lost: team.stats.matchesLost,
        captures: team.stats.captures,
        flag_returns: team.stats.flagReturns,
        kills: team.stats.kills,
        points: team.stats.points,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (statsError) {
        console.error(`Error inserting stats for team ${team.name}:`, statsError)
      }
    }

    // Migrate players
    console.log("Migrating players...")
    for (const player of players) {
      // Find team ID
      const teamName = player.team
      const team = teams.find((t) => t.name === teamName)

      if (!team) {
        console.error(`Team not found for player ${player.name}`)
        continue
      }

      // Insert player
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .insert({
          id: player.id,
          name: player.name,
          team_id: team.id,
          role: player.role || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (playerError) {
        console.error(`Error inserting player ${player.name}:`, playerError)
        continue
      }

      // Insert player stats
      const { error: statsError } = await supabase.from("player_stats").insert({
        player_id: player.id,
        impact: player.stats.impact,
        flag_captures: player.stats.flagCaptures,
        flag_returns: player.stats.flagReturns,
        bc_kills: player.stats.bcKills,
        dbs_kills: player.stats.dbsKills || 0,
        dfa_kills: player.stats.dfaKills || 0,
        overall_kills: player.stats.overallKills,
        overall_deaths: player.stats.overallDeaths,
        flaghold_time: player.stats.flagholdTime,
        nemesis_id: player.stats.nemesisId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (statsError) {
        console.error(`Error inserting stats for player ${player.name}:`, statsError)
      }
    }

    // Migrate match history
    console.log("Migrating match history...")
    for (const match of matchHistory) {
      // Find team IDs
      const teamA = teams.find((t) => t.name === match.teamA)
      const teamB = teams.find((t) => t.name === match.teamB)

      if (!teamA || !teamB) {
        console.error(`Teams not found for match ${match.id}`)
        continue
      }

      // Insert match
      const { error: matchError } = await supabase.from("matches").insert({
        id: match.id,
        round: match.round,
        team_a_id: teamA.id,
        team_b_id: teamB.id,
        score_a: match.scoreA,
        score_b: match.scoreB,
        date: match.date,
        time: null,
        team_a_returns: match.teamAReturns || null,
        team_b_returns: match.teamBReturns || null,
        team_a_kills: match.teamAKills || null,
        team_b_kills: match.teamBKills || null,
        team_a_flag_time: match.teamAFlagTime || null,
        team_b_flag_time: match.teamBFlagTime || null,
        is_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (matchError) {
        console.error(`Error inserting match ${match.id}:`, matchError)
      }
    }

    // Migrate upcoming matches
    console.log("Migrating upcoming matches...")
    for (const match of upcomingMatches) {
      // Find team IDs
      const teamA = teams.find((t) => t.name === match.teamA)
      const teamB = teams.find((t) => t.name === match.teamB)

      if (!teamA || !teamB) {
        console.error(`Teams not found for upcoming match ${match.id}`)
        continue
      }

      // Insert match
      const { error: matchError } = await supabase.from("matches").insert({
        id: match.id,
        round: match.round,
        team_a_id: teamA.id,
        team_b_id: teamB.id,
        score_a: null,
        score_b: null,
        date: match.date,
        time: match.time,
        team_a_returns: null,
        team_b_returns: null,
        team_a_kills: null,
        team_b_kills: null,
        team_a_flag_time: null,
        team_b_flag_time: null,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (matchError) {
        console.error(`Error inserting upcoming match ${match.id}:`, matchError)
      }
    }

    console.log("Data migration completed successfully!")
  } catch (error) {
    console.error("Error during data migration:", error)
  }
}

// Run the migration
migrateData()
