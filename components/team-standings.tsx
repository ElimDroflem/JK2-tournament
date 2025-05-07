import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getTeams } from "@/lib/data-service"

export default async function TeamStandings() {
  // Fetch teams from Supabase
  const teams = await getTeams()

  // Sort teams by points (descending)
  const sortedTeams = [...teams].sort((a, b) => b.stats.points - a.stats.points)

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-imperial-light/10">
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTeams.map((team, index) => (
            <TableRow key={team.id} className="hover:bg-imperial-light/5">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <Link href={`/teams/${team.id}`} className="font-medium hover:underline">
                  {team.name}
                </Link>
              </TableCell>
              <TableCell className="text-center">{team.stats.matchesWon}</TableCell>
              <TableCell className="text-center">{team.stats.matchesDrawn}</TableCell>
              <TableCell className="text-center">{team.stats.matchesLost}</TableCell>
              <TableCell className="text-right font-medium text-jkhub">{team.stats.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 text-center">
        <Link href="/teams" className="text-sm text-jkhub hover:underline">
          View all teams
        </Link>
      </div>
    </div>
  )
}
