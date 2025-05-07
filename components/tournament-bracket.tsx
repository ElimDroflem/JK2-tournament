"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { upcomingMatches } from "@/lib/data"
import Link from "next/link"

export default function TournamentBracket() {
  const [hoveredMatch, setHoveredMatch] = useState<number | null>(null)

  // Filter matches for semifinals and finals
  const semifinals = upcomingMatches.filter((match) => match.round.toLowerCase().includes("semifinal"))
  const finalMatch = upcomingMatches.find((match) => match.round.toLowerCase() === "final")
  const thirdPlaceMatch = upcomingMatches.find((match) => match.round.toLowerCase().includes("3rd place"))

  return (
    <div className="relative w-full h-[400px] p-4">
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <Trophy className="text-jkhub/10 h-64 w-64" />
      </div>

      <div className="relative z-10 w-full h-full">
        {/* Semifinals */}
        <div className="absolute left-0 top-[25%] transform -translate-y-1/2 w-[45%]">
          {semifinals[0] && (
            <Link href={`/matches/${semifinals[0].id}`}>
              <Card
                className={cn(
                  "overflow-hidden transition-all border-jkhub/50 hover:border-jkhub hover:border-glow-jkhub",
                  hoveredMatch === semifinals[0].id && "border-jkhub border-glow-jkhub",
                )}
                onMouseEnter={() => setHoveredMatch(semifinals[0].id)}
                onMouseLeave={() => setHoveredMatch(null)}
              >
                <CardContent className="p-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-jkhub/10 text-jkhub border-jkhub">
                        {semifinals[0].round}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {semifinals[0].date}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {semifinals[0].teamA} vs {semifinals[0].teamB}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {semifinals[0].time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Connector line to final */}
          <div className="bracket-line bracket-horizontal right-0 top-1/2 transform -translate-y-1/2"></div>
        </div>

        <div className="absolute left-0 bottom-[25%] transform translate-y-1/2 w-[45%]">
          {semifinals[1] && (
            <Link href={`/matches/${semifinals[1].id}`}>
              <Card
                className={cn(
                  "overflow-hidden transition-all border-jkhub/50 hover:border-jkhub hover:border-glow-jkhub",
                  hoveredMatch === semifinals[1].id && "border-jkhub border-glow-jkhub",
                )}
                onMouseEnter={() => setHoveredMatch(semifinals[1].id)}
                onMouseLeave={() => setHoveredMatch(null)}
              >
                <CardContent className="p-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-jkhub/10 text-jkhub border-jkhub">
                        {semifinals[1].round}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {semifinals[1].date}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {semifinals[1].teamA} vs {semifinals[1].teamB}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {semifinals[1].time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Connector line to final */}
          <div className="bracket-line bracket-horizontal right-0 top-1/2 transform -translate-y-1/2"></div>
        </div>

        {/* Vertical connectors */}
        <div className="bracket-connector left-[45%] top-[25%] h-[50%]"></div>

        {/* Final match */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[45%]">
          {finalMatch && (
            <Link href={`/matches/${finalMatch.id}`}>
              <Card
                className={cn(
                  "overflow-hidden transition-all border-jkhub hover:border-jkhub hover:border-glow-jkhub",
                  hoveredMatch === finalMatch.id && "border-jkhub border-glow-jkhub",
                )}
                onMouseEnter={() => setHoveredMatch(finalMatch.id)}
                onMouseLeave={() => setHoveredMatch(null)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-jkhub text-imperial border-jkhub">{finalMatch.round}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {finalMatch.date}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-center py-1 text-jkhub text-glow-jkhub">
                      {finalMatch.teamA} vs {finalMatch.teamB}
                    </div>
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {finalMatch.time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {/* 3rd Place Match */}
        <div className="absolute right-0 bottom-0 w-[45%]">
          {thirdPlaceMatch && (
            <Link href={`/matches/${thirdPlaceMatch.id}`}>
              <Card
                className={cn(
                  "overflow-hidden transition-all border-jkhub/50 hover:border-jkhub hover:border-glow-jkhub",
                  hoveredMatch === thirdPlaceMatch.id && "border-jkhub border-glow-jkhub",
                )}
                onMouseEnter={() => setHoveredMatch(thirdPlaceMatch.id)}
                onMouseLeave={() => setHoveredMatch(null)}
              >
                <CardContent className="p-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-bespin/10 text-bespin border-bespin">
                        {thirdPlaceMatch.round}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {thirdPlaceMatch.date}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {thirdPlaceMatch.teamA} vs {thirdPlaceMatch.teamB}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {thirdPlaceMatch.time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
