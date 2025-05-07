"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { teams } from "@/lib/data"
import Link from "next/link"

export default function EditTeamPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const teamId = Number.parseInt(params.id)
  const team = teams.find((t) => t.id === teamId)

  const [formData, setFormData] = useState({
    name: team?.name || "",
    founded: team?.founded || "",
    players: team?.players.join(", ") || "",
    matchesPlayed: team?.stats.matchesPlayed.toString() || "0",
    matchesWon: team?.stats.matchesWon.toString() || "0",
    matchesDrawn: team?.stats.matchesDrawn.toString() || "0",
    matchesLost: team?.stats.matchesLost.toString() || "0",
    captures: team?.stats.captures.toString() || "0",
    flagReturns: team?.stats.flagReturns.toString() || "0",
    kills: team?.stats.kills.toString() || "0",
    points: team?.stats.points.toString() || "0",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the database
    alert("Team updated successfully! (This is a demo - no actual data was changed)")
    router.push("/admin")
  }

  if (!team) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Not Found</CardTitle>
          <CardDescription>The team you're looking for doesn't exist.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/admin">
            <Button>Back to Teams</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Team: {team.name}</CardTitle>
        <CardDescription>Update team information and statistics</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founded">Founded</Label>
                <Input id="founded" name="founded" value={formData.founded} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="players">Players (comma separated)</Label>
              <Input id="players" name="players" value={formData.players} onChange={handleChange} required />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Team Statistics</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="matchesPlayed">Matches Played</Label>
                <Input
                  id="matchesPlayed"
                  name="matchesPlayed"
                  type="number"
                  min="0"
                  value={formData.matchesPlayed}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matchesWon">Matches Won</Label>
                <Input
                  id="matchesWon"
                  name="matchesWon"
                  type="number"
                  min="0"
                  value={formData.matchesWon}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matchesDrawn">Matches Drawn</Label>
                <Input
                  id="matchesDrawn"
                  name="matchesDrawn"
                  type="number"
                  min="0"
                  value={formData.matchesDrawn}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matchesLost">Matches Lost</Label>
                <Input
                  id="matchesLost"
                  name="matchesLost"
                  type="number"
                  min="0"
                  value={formData.matchesLost}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="captures">Flag Captures</Label>
                <Input
                  id="captures"
                  name="captures"
                  type="number"
                  min="0"
                  value={formData.captures}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flagReturns">Flag Returns</Label>
                <Input
                  id="flagReturns"
                  name="flagReturns"
                  type="number"
                  min="0"
                  value={formData.flagReturns}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kills">Total Kills</Label>
                <Input
                  id="kills"
                  name="kills"
                  type="number"
                  min="0"
                  value={formData.kills}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Tournament Points</Label>
                <Input
                  id="points"
                  name="points"
                  type="number"
                  min="0"
                  value={formData.points}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-jedi hover:bg-jedi-dark">
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
