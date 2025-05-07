import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Admin Dashboard - JK2 Summer Tournament 2025",
  description: "Admin dashboard for managing the JK2 Summer Tournament 2025",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-imperial-dark text-white border-b border-jkhub/20 py-2">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/images/jk2-logo-new.png" alt="JK2 Logo" width={20} height={20} className="h-5 w-5" />
            <span className="font-bold text-jkhub text-glow-jkhub">JK2 Summer Tournament 2025 Admin</span>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-jkhub text-jkhub hover:bg-jkhub/10">
              Back to Site
            </Button>
          </Link>
        </div>
      </div>

      <div className="container py-4">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-imperial-dark w-full justify-start mb-6">
            <TabsTrigger value="dashboard" asChild>
              <Link href="/admin">Dashboard</Link>
            </TabsTrigger>
            <TabsTrigger value="teams" asChild>
              <Link href="/admin/teams">Teams</Link>
            </TabsTrigger>
            <TabsTrigger value="players" asChild>
              <Link href="/admin/players">Players</Link>
            </TabsTrigger>
            <TabsTrigger value="matches" asChild>
              <Link href="/admin/matches">Matches</Link>
            </TabsTrigger>
            <TabsTrigger value="fixtures" asChild>
              <Link href="/admin/fixtures">Fixtures</Link>
            </TabsTrigger>
          </TabsList>

          {children}
        </Tabs>
      </div>
    </div>
  )
}
