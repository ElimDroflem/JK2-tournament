import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, FileSpreadsheet, Database } from "lucide-react"
import Link from "next/link"
import { getTeams, getPlayers, getMatchHistory } from "@/lib/data-service"
import { RefreshDataForm } from "@/components/refresh-data-form"

export default async function AdminDashboard() {
  // Fetch data from Supabase
  const teams = await getTeams()
  const players = await getPlayers()
  const matches = await getMatchHistory()

  // Calculate total captures
  const totalCaptures = teams.reduce((acc, team) => acc + team.stats.captures, 0)
  const totalReturns = teams.reduce((acc, team) => acc + team.stats.flagReturns, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-jkhub text-jkhub hover:bg-jkhub/10">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" className="border-jkhub text-jkhub hover:bg-jkhub/10">
            <Database className="mr-2 h-4 w-4" />
            Backup Database
          </Button>
          <RefreshDataForm />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{players.length} players registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">3 matches remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Flag Captures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCaptures}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalReturns} flag returns</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Teams Management</CardTitle>
            <CardDescription>Manage teams participating in the tournament</CardDescription>
          </div>
          <Link href="/admin/teams/new">
            <Button className="bg-jkhub hover:bg-jkhub-dark text-imperial">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-imperial-light/10">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>Founded</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => {
                const teamPlayers = players.filter((p) => p.team === team.name)
                return (
                  <TableRow key={team.id}>
                    <TableCell>{team.id}</TableCell>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.founded}</TableCell>
                    <TableCell>{teamPlayers.length}</TableCell>
                    <TableCell>{team.stats.points}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/teams/${team.id}`}>
                          <Button variant="outline" size="sm" className="border-jkhub text-jkhub hover:bg-jkhub/10">
                            Edit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="border-sith text-sith hover:bg-sith/10">
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
