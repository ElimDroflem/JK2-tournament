"use client";

import { useState, type FormEvent, useEffect, useCallback } from "react"; // Added useEffect and useCallback
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getTeams,
  type TeamWithStatsAndPlayers,
  type PlayerWithStatsAndTeamName,
} from "@/lib/data-service";

// CSV Upload Form
function CsvUploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [csvPassword, setCsvPassword] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !csvPassword) {
      setError("Password and CSV file are required for CSV processing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", csvPassword);
    try {
      const response = await fetch("/api/process-player-stats-csv", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }
      setSuccessMessage(result.message || "CSV processed successfully!");
      setFile(null);
    } catch (err: any) {
      console.error("Upload Error:", err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Player Stats CSV</CardTitle>
        <CardDescription>
          Upload per-match player stats. Requires 'match_id', 'player_name',
          stat columns, 'final_score_a', 'final_score_b'.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Upload Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="csvProcessingPassword">CSV API Password</Label>
            <Input
              id="csvProcessingPassword"
              type="password"
              value={csvPassword}
              onChange={(e) => setCsvPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter password for CSV API"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="csvFile">CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
              disabled={isLoading}
              key={file ? "file-selected" : "no-file"}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !file || !csvPassword}>
            {isLoading ? "Processing..." : "Upload and Process CSV"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// --- Manage Teams Section ---
function ManageTeamsSection() {
  const [teams, setTeams] = useState<TeamWithStatsAndPlayers[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [newTeamName, setNewTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiPassword, setApiPassword] = useState("");

  useEffect(() => {
    async function fetchAdminTeams() {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const response = await fetch("/api/admin/get-teams");
        if (!response.ok) {
          let errorMsg = "Failed to fetch teams";
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || `API error: ${response.status}`;
          } catch (parseError) {
            errorMsg = `Failed to fetch teams and parse error response (status: ${response.status})`;
          }
          throw new Error(errorMsg);
        }
        const fetchedTeams = await response.json();
        setTeams(fetchedTeams || []);
      } catch (e: any) {
        console.error("Failed to fetch teams for admin panel:", e);
        setError(`Could not load teams: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdminTeams();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTeamId || !newTeamName || !apiPassword) {
      setError("Team, new name, and API password are required.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch("/api/admin/update-team-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: parseInt(selectedTeamId, 10),
          newName: newTeamName,
          password: apiPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      setSuccessMessage(result.message || "Team name updated successfully!");
      setNewTeamName("");
      setSelectedTeamId("");
      // Refetch teams
      const updatedResponse = await fetch("/api/admin/get-teams");
      const updatedTeams = await updatedResponse.json();
      setTeams(updatedTeams || []);
    } catch (err: any) {
      setError(err.message || "Failed to update team name.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Teams</CardTitle>
        <CardDescription>Amend team names.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Error and Success Alerts */}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="teamSelect">Select Team</Label>
            <Select
              value={selectedTeamId}
              onValueChange={setSelectedTeamId}
              disabled={isLoading || teams.length === 0}
            >
              <SelectTrigger id="teamSelect">
                <SelectValue
                  placeholder={
                    teams.length === 0 ? "Loading teams..." : "Select a team"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name} (ID: {team.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newTeamName">New Team Name</Label>
            <Input
              id="newTeamName"
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter new team name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teamApiPassword">
              API Password (for this action)
            </Label>
            <Input
              id="teamApiPassword"
              type="password"
              value={apiPassword}
              onChange={(e) => setApiPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter API password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={
              isLoading || !selectedTeamId || !newTeamName || !apiPassword
            }
          >
            {isLoading ? "Updating..." : "Update Team Name"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// --- Manage Players Section (Placeholder) ---
// function ManagePlayersSection() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Manage Players</CardTitle>
//         <CardDescription>
//           Manage team rosters and player assignments.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p className="text-muted-foreground">
//           Player management features coming soon.
//         </p>
//       </CardContent>
//     </Card>
//   );
// }

// --- Manage Players Section ---
function ManagePlayersSection() {
  // State for teams and selected team (for managing its roster)
  const [allTeams, setAllTeams] = useState<TeamWithStatsAndPlayers[]>([]);
  const [selectedTeamForRosterMgmtId, setSelectedTeamForRosterMgmtId] =
    useState<string>("");

  // Derived state for the currently selected team's details
  const selectedTeamDetails = allTeams.find(
    (t) => t.id.toString() === selectedTeamForRosterMgmtId
  );

  // State for unassigned players
  const [unassignedPlayers, setUnassignedPlayers] = useState<
    PlayerWithStatsAndTeamName[]
  >([]);
  const [selectedUnassignedPlayerId, setSelectedUnassignedPlayerId] =
    useState<string>("");

  // State for creating a new player
  const [newPlayerName, setNewPlayerName] = useState("");

  // Common state for actions
  const [playerMgmtApiPassword, setPlayerMgmtApiPassword] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false); // For initial load and refresh
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submissions
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initial data fetching for teams and unassigned players
  useEffect(() => {
    async function fetchData() {
      setIsLoadingData(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const [teamsRes, unassignedPlayersRes] = await Promise.all([
          fetch("/api/admin/get-teams"),
          fetch("/api/admin/get-unassigned-players"),
        ]);

        if (!teamsRes.ok) {
          const err = await teamsRes.json();
          throw new Error(err.error || "Failed to fetch teams");
        }
        const teamsData = await teamsRes.json();
        setAllTeams(teamsData || []);

        if (!unassignedPlayersRes.ok) {
          const err = await unassignedPlayersRes.json();
          throw new Error(err.error || "Failed to fetch unassigned players");
        }
        const unassignedData = await unassignedPlayersRes.json();
        setUnassignedPlayers(unassignedData || []);
      } catch (e: any) {
        setError(`Could not load initial player/team data: ${e.message}`);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, []);

  // Function to refresh teams and unassigned players data
  const refreshAllPlayerData = async () => {
    setIsLoadingData(true);
    // setError(null); setSuccessMessage(null); // Keep existing success/error from the action that triggered refresh for a bit
    try {
      const [teamsRes, unassignedPlayersRes] = await Promise.all([
        fetch("/api/admin/get-teams"),
        fetch("/api/admin/get-unassigned-players"),
      ]);

      if (!teamsRes.ok)
        throw new Error("Failed to re-fetch teams during refresh");
      const teamsData = await teamsRes.json();
      setAllTeams(teamsData || []);

      if (!unassignedPlayersRes.ok)
        throw new Error("Failed to re-fetch unassigned players during refresh");
      const unassignedData = await unassignedPlayersRes.json();
      setUnassignedPlayers(unassignedData || []);
    } catch (e: any) {
      // Append to existing error or set new one
      setError((prev) =>
        prev
          ? `${prev}. Additionally, error refreshing data: ${e.message}`
          : `Error refreshing data: ${e.message}`
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleRemovePlayerFromTeam = async (playerIdToRemove: number) => {
    if (!selectedTeamForRosterMgmtId || !playerMgmtApiPassword) {
      setError(
        "Selected team and API password are required to remove a player."
      );
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch("/api/admin/update-player-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: playerIdToRemove,
          newTeamId: null, // Unassign
          password: playerMgmtApiPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to remove player from team.");
      setSuccessMessage(
        result.message || "Player removed from team successfully."
      );
      await refreshAllPlayerData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPlayerToTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !selectedTeamForRosterMgmtId ||
      !selectedUnassignedPlayerId ||
      !playerMgmtApiPassword
    ) {
      setError(
        "A team to add to, an unassigned player, and the API password are required."
      );
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch("/api/admin/update-player-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: parseInt(selectedUnassignedPlayerId, 10),
          newTeamId: parseInt(selectedTeamForRosterMgmtId, 10),
          password: playerMgmtApiPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to add player to team.");
      setSuccessMessage(result.message || "Player added to team successfully.");
      setSelectedUnassignedPlayerId("");
      await refreshAllPlayerData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePlayer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPlayerName.trim() || !playerMgmtApiPassword) {
      setError("New player name and API password are required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch("/api/admin/create-player-and-assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: newPlayerName.trim(),
          teamId: selectedTeamForRosterMgmtId
            ? parseInt(selectedTeamForRosterMgmtId, 10)
            : null,
          password: playerMgmtApiPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to create player.");

      let message = result.message || "Player created successfully.";
      if (result.warning) {
        message = `${message} WARNING: ${result.warning}`;
      }
      setSuccessMessage(message);
      setNewPlayerName("");
      await refreshAllPlayerData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Players & Team Rosters</CardTitle>
        <CardDescription>
          Assign players to teams, remove them, or create new players. All
          actions in this section require the API password below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoadingData && (
          <p className="text-blue-500">Loading player/team data...</p>
        )}
        {error && (
          <Alert variant="destructive" className="my-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="default" className="my-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 p-4 border rounded-md">
          <Label htmlFor="playerMgmtApiPassword">
            API Password (for Player Actions)
          </Label>
          <Input
            id="playerMgmtApiPassword"
            type="password"
            value={playerMgmtApiPassword}
            onChange={(e) => setPlayerMgmtApiPassword(e.target.value)}
            placeholder="Enter API password"
            disabled={isSubmitting}
          />
          <p className="text-sm text-muted-foreground">
            This password is required for all remove, add, or create player
            operations below.
          </p>
        </div>

        {/* Team Roster Management */}
        <Card className="border-2 border-dashed p-0">
          <CardHeader>
            <CardTitle className="text-lg">Team Roster Management</CardTitle>
            <CardDescription>
              Select a team to view and manage its players.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rosterTeamSelect">Team</Label>
              <Select
                value={selectedTeamForRosterMgmtId}
                onValueChange={(value) => {
                  setSelectedTeamForRosterMgmtId(value);
                  setError(null);
                  setSuccessMessage(null);
                }}
                disabled={
                  isLoadingData || isSubmitting || allTeams.length === 0
                }
              >
                <SelectTrigger id="rosterTeamSelect">
                  <SelectValue
                    placeholder={
                      allTeams.length === 0
                        ? "Loading teams..."
                        : "Select a team"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {allTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name} (ID: {team.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTeamDetails && (
              <div className="mt-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800">
                <h4 className="font-semibold mb-2">
                  Players in {selectedTeamDetails.name}:
                </h4>
                {selectedTeamDetails.players_list.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTeamDetails.players_list.map((player) => (
                      <li
                        key={player.id}
                        className="flex justify-between items-center p-2 bg-white dark:bg-slate-700 rounded"
                      >
                        <span>
                          {player.name} (ID: {player.id})
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePlayerFromTeam(player.id)}
                          disabled={isSubmitting || !playerMgmtApiPassword}
                        >
                          Remove from Team
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    This team has no players.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Existing Unassigned Player to Selected Team */}
        <Card className="border-2 border-dashed p-0">
          <CardHeader>
            <CardTitle className="text-lg">
              Add Existing Player to Team
            </CardTitle>
            <CardDescription>
              Select an unassigned player and add them to the currently selected
              team above.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAddPlayerToTeam}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unassignedPlayerSelect">
                  Unassigned Player
                </Label>
                <Select
                  value={selectedUnassignedPlayerId}
                  onValueChange={setSelectedUnassignedPlayerId}
                  disabled={
                    isLoadingData ||
                    isSubmitting ||
                    unassignedPlayers.length === 0 ||
                    !selectedTeamForRosterMgmtId
                  }
                >
                  <SelectTrigger id="unassignedPlayerSelect">
                    <SelectValue
                      placeholder={
                        unassignedPlayers.length === 0
                          ? "No unassigned players"
                          : "Select player to add"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedPlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id.toString()}>
                        {player.name} (ID: {player.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Target team:{" "}
                  {selectedTeamDetails ? (
                    selectedTeamDetails.name
                  ) : (
                    <span className="text-orange-500">
                      No team selected above
                    </span>
                  )}
                  .
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !selectedTeamForRosterMgmtId ||
                  !selectedUnassignedPlayerId ||
                  !playerMgmtApiPassword
                }
              >
                {isSubmitting ? "Adding..." : "Add Player to Selected Team"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Create New Player */}
        <Card className="border-2 border-dashed p-0">
          <CardHeader>
            <CardTitle className="text-lg">Create New Player</CardTitle>
            <CardDescription>
              Create a new player. They will be assigned to the selected team
              above, or unassigned if no team is selected.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreatePlayer}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPlayerNameVal">New Player Name</Label>
                <Input
                  id="newPlayerNameVal"
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter name for the new player"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  Assign to team:{" "}
                  {selectedTeamDetails ? (
                    selectedTeamDetails.name
                  ) : (
                    <span className="text-orange-500">
                      Unassigned (no team selected above)
                    </span>
                  )}
                  .
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !newPlayerName.trim() ||
                  !playerMgmtApiPassword
                }
              >
                {isSubmitting ? "Creating..." : "Create New Player"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </CardContent>
    </Card>
  );
}

// --- Correct Data Section (Placeholder) ---
function CorrectDataSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Correct Data</CardTitle>
        <CardDescription>
          Manually correct team/player lifetime stats or reset a match status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Data correction features coming soon.
        </p>
      </CardContent>
    </Card>
  );
}

// New component for the reset stats section
function ResetStatsSection() {
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // For this specific destructive action, the client-side check should ideally align with
  // what the backend expects for THE destructive password, not necessarily the main panel login password.
  // The backend API for reset-all-stats uses ADMIN_DESTRUCTIVE_ACTION_PASSWORD (defaults to "samsmum_reset_all_local_default").
  // We make the client-side check expect this default if no specific NEXT_PUBLIC_ env var is set for it.
  const clientSideExpectedPassword =
    process.env.NEXT_PUBLIC_ADMIN_DESTRUCTIVE_CONFIRM_PASSWORD ||
    "samsmum_reset_all_local_default";

  const handleResetStats = async () => {
    if (confirmationPassword !== clientSideExpectedPassword) {
      setError(
        "Incorrect confirmation password. Please enter the main admin password to proceed."
      );
      setSuccessMessage(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/admin/reset-all-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The API route will validate this password against its own secure env var.
        body: JSON.stringify({ password: confirmationPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset stats.");
      }
      setSuccessMessage(
        result.message ||
          "All player and team stats have been reset successfully."
      );
      setConfirmationPassword(""); // Clear password on success
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-8 border-red-500 border-2 bg-red-50 dark:bg-red-900/30">
      <CardHeader>
        <CardTitle className="text-red-700 dark:text-red-400">
          DANGER ZONE: Reset All Stats
        </CardTitle>
        <CardDescription className="text-red-600 dark:text-red-300">
          This action is irreversible and will reset all player lifetime stats,
          team lifetime stats, individual match performances
          (player_match_stats), and match scores/completions to zero or their
          initial states. Player and team records themselves will not be
          deleted.
          <strong>Exercise extreme caution.</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert
            variant="default"
            className="border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
          >
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="resetConfirmationPassword">
            Confirm Admin Password to Reset Stats
          </Label>
          <Input
            id="resetConfirmationPassword"
            type="password"
            value={confirmationPassword}
            onChange={(e) => {
              setConfirmationPassword(e.target.value);
              setError(null); // Clear error when user types
            }}
            placeholder="Enter main admin password to confirm"
            disabled={isSubmitting}
            className="border-red-500 focus:ring-red-500"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          onClick={handleResetStats}
          disabled={
            isSubmitting || confirmationPassword !== clientSideExpectedPassword
          }
        >
          {isSubmitting
            ? "Resetting Stats..."
            : "Reset All Player and Team Stats Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// --- Tournament Structure Section ---
function TournamentStructureSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [matchesExist, setMatchesExist] = useState(false);

  // Check if matches already exist
  useEffect(() => {
    async function checkMatches() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/check-matches-exist");
        if (!res.ok) throw new Error("Failed to check matches");
        const data = await res.json();
        setMatchesExist(data.matchesExist);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    checkMatches();
  }, []);

  const handleRandomise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setFixtures([]);
    try {
      const res = await fetch("/api/admin/generate-tournament", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate fixtures");
      setFixtures(data.fixtures || []);
      setSuccessMessage("Tournament fixtures generated successfully!");
      setMatchesExist(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Tournament Structure</CardTitle>
        <CardDescription>
          Randomly generate all group stage, semi-final, and final fixtures.
          This can only be done once per tournament.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="default">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleRandomise}
          disabled={isLoading || matchesExist}
          className="mb-4"
        >
          {isLoading ? "Generating..." : "Randomise & Generate Fixtures"}
        </Button>
        {matchesExist && !fixtures.length && (
          <p className="text-orange-600">
            Tournament fixtures already exist. Reset all matches to
            re-randomise.
          </p>
        )}
        {fixtures.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Stage</th>
                  <th className="border px-2 py-1">Round</th>
                  <th className="border px-2 py-1">Team A</th>
                  <th className="border px-2 py-1">Team B</th>
                </tr>
              </thead>
              <tbody>
                {fixtures.map((f, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{f.stage}</td>
                    <td className="border px-2 py-1">{f.round}</td>
                    <td className="border px-2 py-1">
                      {f.team_a_name || f.team_a_id}
                    </td>
                    <td className="border px-2 py-1">
                      {f.team_b_name || f.team_b_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      password === (process.env.NEXT_PUBLIC_ADMIN_MAIN_PASSWORD || "samsmum")
    ) {
      setIsAdminAuthenticated(true);
      setAuthError(null);
      setPassword("");
    } else {
      setAuthError("Incorrect admin password.");
      setIsAdminAuthenticated(false);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>
            Enter the password to access admin controls.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            {authError && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Admin Password</Label>
              <Input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Login</Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <>
      <TournamentStructureSection />
      <Tabs defaultValue="csv_upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="csv_upload">CSV Upload</TabsTrigger>
          <TabsTrigger value="manage_teams">Manage Teams</TabsTrigger>
          <TabsTrigger value="manage_players">Manage Players</TabsTrigger>
          <TabsTrigger value="correct_data">Correct Data</TabsTrigger>
        </TabsList>
        <TabsContent value="csv_upload">
          <CsvUploadSection />
        </TabsContent>
        <TabsContent value="manage_teams">
          <ManageTeamsSection />
        </TabsContent>
        <TabsContent value="manage_players">
          <ManagePlayersSection />
        </TabsContent>
        <TabsContent value="correct_data">
          <CorrectDataSection />
        </TabsContent>
      </Tabs>
      <ResetStatsSection />
    </>
  );
}
