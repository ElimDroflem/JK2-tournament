import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, FileEdit, Trash2 } from "lucide-react"
import Link from "next/link"
import { getPlayers } from "@/lib/data-service"

export default async function AdminPlayersPage() {
  // Fetch players from Supabase
  const players = await getPlayers()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Players Management</CardTitle>
          <CardDescription>Manage players participating in the tournament</CardDescription>
        </div>
        <Link href="/admin/players/new">
          <Button className="bg-jkhub hover:bg-jkhub-dark text-imperial">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Player
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-imperial-light/10">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Captures</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.id}</TableCell>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell>{player.role || "Player"}</TableCell>
                <TableCell className="font-medium text-jkhub">{player.stats.impact}</TableCell>
                <TableCell>{player.stats.flagCaptures}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/players/${player.id}`}>
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
