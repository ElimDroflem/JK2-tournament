import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, FileEdit, Trash2 } from "lucide-react"
import Link from "next/link"
import { getMatchHistory } from "@/lib/data-service"

export default async function AdminMatchesPage() {
  // Fetch matches from Supabase
  const matches = await getMatchHistory()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Match History Management</CardTitle>
          <CardDescription>Manage completed matches in the tournament</CardDescription>
        </div>
        <Link href="/admin/matches/new">
          <Button className="bg-jkhub hover:bg-jkhub-dark text-imperial">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Match
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-imperial-light/10">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.id}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-jkhub/50">
                    {match.round}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {match.teamA} vs {match.teamB}
                </TableCell>
                <TableCell>
                  {match.scoreA} - {match.scoreB}
                </TableCell>
                <TableCell>{match.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/matches/${match.id}`}>
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
