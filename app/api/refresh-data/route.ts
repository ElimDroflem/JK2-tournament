import { NextResponse } from "next/server"
import { resetCache } from "@/lib/data-service"
import { isSupabaseConfigured } from "@/lib/supabase"

export async function POST() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase is not configured. Please set up your environment variables.",
        },
        { status: 400 },
      )
    }

    // Reset the cache to force a fresh fetch from Supabase on next request
    resetCache()
    return NextResponse.json({ success: true, message: "Data cache cleared successfully" })
  } catch (error) {
    console.error("Error refreshing data:", error)
    return NextResponse.json({ success: false, error: "Failed to refresh data" }, { status: 500 })
  }
}
