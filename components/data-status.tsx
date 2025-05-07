"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DataStatus() {
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    updateLastUpdatedTime()
  }, [])

  const updateLastUpdatedTime = () => {
    setLastUpdated(new Date().toLocaleTimeString())
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      // Force a refresh by calling the API route
      await fetch("/api/refresh-data", { method: "POST" })
      // Reload the page to show new data
      window.location.reload()
    } catch (error) {
      console.error("Error refreshing data:", error)
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Data last updated: {lastUpdated}</span>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={refreshData} disabled={isRefreshing}>
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        <span className="sr-only">Refresh data</span>
      </Button>
    </div>
  )
}
