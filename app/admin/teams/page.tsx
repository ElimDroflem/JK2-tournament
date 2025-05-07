import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, FileEdit, Trash2 } from "lucide-react"
import Link from "next/link"
import { getTeams } from "@/lib/data-service"

export default async function AdminTeamsPage() {
  // Fetch teams from Supabase
  const teams = await getTeams()

  return (
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
              <TableHead>Points</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.id}</TableCell>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.founded}</TableCell>
                <TableCell>{team.stats.points}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/teams/${team.id}`}>
                      <Button variant="outline" size="sm" className="border-jkhub text-jkhub hover:bg-jkhub/10">
                        <FileEdit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="border-sith text-sith hover:bg-sith/10">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
