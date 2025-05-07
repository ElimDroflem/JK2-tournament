"use server"

import { revalidatePath } from "next/cache"
import { supabase, isSupabaseConfigured } from "./supabase"
import { resetCache } from "./data-service"
import { redirect } from "next/navigation"

// Helper function to handle errors
function handleError(error: any, entityType: string, action: string) {
  console.error(`Error ${action} ${entityType}:`, error)
  return { success: false, error: `Failed to ${action} ${entityType}` }
}

// Add a new team
export async function addTeam(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured" }
  }

  try {
    const name = formData.get("name") as string
    const logo = formData.get("logo") as string
    const description = formData.get("description") as string
    const wins = Number.parseInt(formData.get("wins") as string) || 0
    const losses = Number.parseInt(formData.get("losses") as string) || 0
    const draws = Number.parseInt(formData.get("draws") as string) || 0

    const { data, error } = await supabase
      .from("teams")
      .insert([
        {
          name,
          logo,
          description,
          wins,
          losses,
          draws,
        },
      ])
      .select()

    if (error) {
      return handleError(error, "team", "adding")
    }

    // Reset cache and revalidate paths
    resetCache()
    revalidatePath("/teams")
    revalidatePath("/admin/teams")

    // Redirect to the teams admin page
    redirect("/admin/teams")
  } catch (error) {
    return handleError(error, "team", "adding")
  }
}

// Update an existing team
export async function updateTeam(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured" }
  }

  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const logo = formData.get("logo") as string
    const description = formData.get("description") as string
    const wins = Number.parseInt(formData.get("wins") as string) || 0
    const losses = Number.parseInt(formData.get("losses") as string) || 0
    const draws = Number.parseInt(formData.get("draws") as string) || 0

    const { error } = await supabase
      .from("teams")
      .update({
        name,
        logo,
        description,
        wins,
        losses,
        draws,
      })
      .eq("id", id)

    if (error) {
      return handleError(error, "team", "updating")
    }

    // Reset cache and revalidate paths
    resetCache()
    revalidatePath("/teams")
    revalidatePath(`/teams/${id}`)
    revalidatePath("/admin/teams")
    revalidatePath(`/admin/teams/${id}`)

    // Redirect to the teams admin page
    redirect("/admin/teams")
  } catch (error) {
    return handleError(error, "team", "updating")
  }
}

// Delete a team
export async function deleteTeam(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured" }
  }

  try {
    const id = formData.get("id") as string

    const { error } = await supabase.from("teams").delete().eq("id", id)

    if (error) {
      return handleError(error, "team", "deleting")
    }

    // Reset cache and revalidate paths
    resetCache()
    revalidatePath("/teams")
    revalidatePath("/admin/teams")

    // Redirect to the teams admin page
    redirect("/admin/teams")
  } catch (error) {
    return handleError(error, "team", "deleting")
  }
}

// Add a new player
export async function addPlayer(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured" }
  }

  try {
    const name = formData.get("name") as string
    const team_id = formData.get("team_id") as string
    const avatar = formData.get("avatar") as string
    const role = formData.get("role") as string
    const kills = Number.parseInt(formData.get("kills") as string) || 0
    const deaths = Number.parseInt(formData.get("deaths") as string) || 0
    const assists = Number.parseInt(formData.get("assists") as string) || 0

    const { data, error } = await supabase
      .from("players")
      .insert([
        {
          name,
          team_id,
          avatar,
          role,
          kills,
          deaths,
          assists,
        },
      ])
      .select()

    if (error) {
      return handleError(error, "player", "adding")
    }

    // Reset cache and revalidate paths
    resetCache()
    revalidatePath("/players")
    revalidatePath("/admin/players")
    revalidatePath(`/teams/${team_id}`)

    // Redirect to the players admin page
    redirect("/admin/players")
  } catch (error) {
    return handleError(error, "player", "adding")
  }
}

// Update an existing player
export async function updatePlayer(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured" }
  }

  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const team_id = formData.get("team_id") as string
    const avatar = formData.get("avatar") as string
    const role = formData.get("role") as string
    const kills = Number.parseInt(formData.get("kills") as string) || 0
    const deaths = Number.parseInt(formData.get("deaths") as string) || 0
    const assists = Number.parseInt(formData.get("assists") as string) || 0

    const { error } = await supabase
      .from("players")
      .update({
        name,
        team_id,
        avatar,
        role,
        kills,
        deaths,
        assists,
      })
      .eq("id", id)

    if (error) {
      return handleError(error, "player", "updating")
    }

    // Reset cache and revalidate paths
    resetCache()
    revalidatePath("/players")
    revalidatePath(`/players/${id}`)
    revalidatePath("/admin/players")
    revalidatePath(`/admin/players/${id}`)
    revalidatePath(`/teams/${team_id}`)

    // Redirect to the players admin page
    redirect("/admin/players")
  } catch (error) {
    return handleError(error, "player", "updating")
  }
}

// Delete a player
export async function deletePlayer(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured" }
  }

  try {
    const id = formData.get("id") as string

    const { error } = await supabase.from("players").delete().eq("id", id)

    if (error) {
      return handleError(error, "player", "deleting")
    }

    // Reset cache and revalidate paths
    resetCache()
    revalidatePath("/players")
    revalidatePath("/admin/players")

    // Redirect to the players admin page
    redirect("/admin/players")
  } catch (error) {
    return handleError(error, "player", "deleting")
  }
}

// Refresh data cache
export async function refreshData() {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured" }
  }

  try {
    // Reset the cache to force a fresh fetch from Supabase on next request
    resetCache()

    // Revalidate all main paths
    revalidatePath("/")
    revalidatePath("/teams")
    revalidatePath("/players")
    revalidatePath("/matches")
    revalidatePath("/leaderboards")
    revalidatePath("/admin")

    return { success: true, message: "Data cache refreshed successfully" }
  } catch (error) {
    return handleError(error, "data", "refreshing")
  }
}
