import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, FileEdit, Trash2 } from "lucide-react"
import Link from "next/link"
import { getUpcomingMatches } from "@/lib/data-service"

export default async function AdminFixturesPage() {
  // Fetch upcoming matches from Supabase
  const upcomingMatches = await getUpcomingMatches()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Fixtures Management</CardTitle>
          <CardDescription>Manage upcoming matches in the tournament</CardDescription>
        </div>
        <Link href="/admin/fixtures/new">
          <Button className="bg-jkhub hover:bg-jkhub-dark text-imperial">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Fixture
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
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.id}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      match.round.toLowerCase().includes("final")
                        ? "bg-jkhub/10 text-jkhub border-jkhub"
                        : "border-jkhub/50"
                    }
                  >
                    {match.round}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {match.teamA} vs {match.teamB}
                </TableCell>
                <TableCell>{match.date}</TableCell>
                <TableCell>{match.time}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/fixtures/${match.id}`}>
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
