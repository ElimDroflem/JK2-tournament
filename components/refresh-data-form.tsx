"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { refreshData } from "@/lib/actions"
import { ReloadIcon, CheckIcon, CrossCircledIcon } from "@radix-ui/react-icons"

export function RefreshDataForm() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [status, setStatus] = useState<{
    success?: boolean
    message?: string
  } | null>(null)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setStatus(null)

    try {
      const result = await refreshData()
      setStatus({
        success: result.success,
        message: result.success ? result.message : result.error,
      })
    } catch (error) {
      setStatus({
        success: false,
        message: "An unexpected error occurred",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleRefresh} disabled={isRefreshing} className="w-full">
        {isRefreshing ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Refreshing...
          </>
        ) : (
          "Refresh Data Cache"
        )}
      </Button>

      {status && (
        <div
          className={`flex items-center rounded-md p-3 text-sm ${
            status.success
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {status.success ? <CheckIcon className="mr-2 h-4 w-4" /> : <CrossCircledIcon className="mr-2 h-4 w-4" />}
          {status.message}
        </div>
      )}
    </div>
  )
}
