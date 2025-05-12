"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Trophy, Users } from "lucide-react";
import { getTeams, getPlayers, subscribeToUpdates } from "@/lib/data-service";
import type {
  TeamWithStatsAndPlayers,
  PlayerWithStatsAndTeamName,
} from "@/lib/data-service";
import DataStatus from "@/components/data-status";
import Link from "next/link";

export default function LeaderboardsPage() {
  const [teams, setTeams] = useState<TeamWithStatsAndPlayers[]>([]);
  const [players, setPlayers] = useState<PlayerWithStatsAndTeamName[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [teamsData, playersData] = await Promise.all([
          getTeams(),
          getPlayers(),
        ]);
        setTeams(teamsData);
        setPlayers(playersData);
      } catch (error) {
        console.error("Error loading leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    // Subscribe to real-time updates
    subscribeToUpdates(
      (updatedTeams) => setTeams(updatedTeams),
      (updatedPlayers) => setPlayers(updatedPlayers)
    );

    // No need to return cleanup function since subscribeToUpdates doesn't return anything
  }, []);

  // Sort teams by points (descending)
  const sortedTeams = [...teams].sort(
    (a, b) => (b.team_stats?.points || 0) - (a.team_stats?.points || 0)
  );

  // Sort players by impact score (descending)
  const sortedPlayers = [...players].sort(
    (a, b) => (b.player_stats?.impact || 0) - (a.player_stats?.impact || 0)
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tournament Leaderboards
          </h1>
          <p className="text-muted-foreground">
            View team and player rankings for the JK2 CTF Tournament.
          </p>
        </div>
        <DataStatus />
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="teams">
            <Shield className="mr-2 h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="players">
            <Users className="mr-2 h-4 w-4" />
            Players
          </TabsTrigger>
        </TabsList>
        <TabsContent value="teams">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Matches</TableHead>
                  <TableHead className="text-right">W</TableHead>
                  <TableHead className="text-right">D</TableHead>
                  <TableHead className="text-right">L</TableHead>
                  <TableHead className="text-right">Captures</TableHead>
                  <TableHead className="text-right">Returns</TableHead>
                  <TableHead className="text-right">Kills</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeams.map((team, index) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                          {index + 1}
                        </div>
                      ) : (
                        index + 1
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/teams/${team.id}`}
                        className="hover:underline"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {team.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{team.name}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      {team.team_stats?.matches_played || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {team.team_stats?.matches_won || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {team.team_stats?.matches_drawn || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {team.team_stats?.matches_lost || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {team.team_stats?.captures || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {team.team_stats?.flag_returns || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {team.team_stats?.kills || 0}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {team.team_stats?.points || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="players">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Impact</TableHead>
                  <TableHead className="text-right">Captures</TableHead>
                  <TableHead className="text-right">Returns</TableHead>
                  <TableHead className="text-right">BC Kills</TableHead>
                  <TableHead className="text-right">Total Kills</TableHead>
                  <TableHead className="text-right">Deaths</TableHead>
                  <TableHead className="text-right">Flag Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlayers.map((player, index) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                          {index + 1}
                        </div>
                      ) : (
                        index + 1
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/players/${player.id}`}
                        className="hover:underline"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {(player.name || "NN")
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="font-medium">
                              {player.name || "Unknown Player"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {player.team_name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </Link>
                      {index === 0 && (
                        <Badge variant="secondary" className="ml-2">
                          MVP
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-jkhub">
                      {player.player_stats?.impact || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {player.player_stats?.flag_captures || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {player.player_stats?.flag_returns || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {player.player_stats?.bc_kills || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {player.player_stats?.overall_kills || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {player.player_stats?.overall_deaths || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {player.player_stats?.flaghold_time || 0}s
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
