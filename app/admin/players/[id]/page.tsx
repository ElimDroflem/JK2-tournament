"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { players, teams } from "@/lib/data"
import Link from "next/link"

export default function EditPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const playerId = Number.parseInt(params.id)
  const player = players.find((p) => p.id === playerId)

  const [formData, setFormData] = useState({
    name: player?.name || "",
    team: player?.team || "",
    role: player?.role || "Player",
    impact: player?.stats.impact?.toString() || "0",
    flagCaptures: player?.stats.flagCaptures?.toString() || "0",
    flagReturns: player?.stats.flagReturns?.toString() || "0",
    bcKills: player?.stats.bcKills?.toString() || "0",
    dbsKills: player?.stats.dbsKills?.toString() || "0",
    dfaKills: player?.stats.dfaKills?.toString() || "0",
    overallKills: player?.stats.overallKills?.toString() || "0",
    overallDeaths: player?.stats.overallDeaths?.toString() || "0",
    flagholdTime: player?.stats.flagholdTime?.toString() || "0",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the database
    alert("Player updated successfully! (This is a demo - no actual data was changed)")
    router.push("/admin/players")
  }

  if (!player) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Player Not Found</CardTitle>
          <CardDescription>The player you're looking for doesn't exist.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/admin/players">
            <Button className="bg-jkhub hover:bg-jkhub-dark text-imperial">Back to Players</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Player: {player.name}</CardTitle>
        <CardDescription>Update player information and statistics</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Player Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select value={formData.team} onValueChange={(value) => handleSelectChange("team", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Player">Player</SelectItem>
                  <SelectItem value="Captain">Captain</SelectItem>
                  <SelectItem value="Coach">Coach</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Player Statistics</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="impact" className="text-jkhub">
                  Impact Score
                </Label>
                <Input
                  id="impact"
                  name="impact"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.impact}
                  onChange={handleChange}
                  required
                  className="border-jkhub/50 focus-visible:ring-jkhub"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flagCaptures">Flag Captures</Label>
                <Input
                  id="flagCaptures"
                  name="flagCaptures"
                  type="number"
                  min="0"
                  value={formData.flagCaptures}
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
                <Label htmlFor="flagholdTime">Flag Hold Time (s)</Label>
                <Input
                  id="flagholdTime"
                  name="flagholdTime"
                  type="number"
                  min="0"
                  value={formData.flagholdTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bcKills">BC Kills</Label>
                <Input
                  id="bcKills"
                  name="bcKills"
                  type="number"
                  min="0"
                  value={formData.bcKills}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dbsKills">DBS Kills</Label>
                <Input
                  id="dbsKills"
                  name="dbsKills"
                  type="number"
                  min="0"
                  value={formData.dbsKills}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dfaKills">DFA Kills</Label>
                <Input
                  id="dfaKills"
                  name="dfaKills"
                  type="number"
                  min="0"
                  value={formData.dfaKills}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overallKills">Total Kills</Label>
                <Input
                  id="overallKills"
                  name="overallKills"
                  type="number"
                  min="0"
                  value={formData.overallKills}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overallDeaths">Total Deaths</Label>
                <Input
                  id="overallDeaths"
                  name="overallDeaths"
                  type="number"
                  min="0"
                  value={formData.overallDeaths}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin/players">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-jkhub hover:bg-jkhub-dark text-imperial">
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
