"use client";

import { useState, type FormEvent, useEffect } from "react"; // Added useEffect
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
import { getTeams, type TeamWithStatsAndPlayers } from "@/lib/data-service";

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
      try {
        // Client-side fetch to an API route is preferred for client components
        const response = await fetch("/api/admin/get-teams"); // Create this API route
        if (!response.ok) throw new Error("Failed to fetch teams");
        const fetchedTeams = await response.json();
        setTeams(fetchedTeams || []);
      } catch (e: any) {
        console.error("Failed to fetch teams for admin panel:", e);
        setError(`Could not load teams: ${e.message}`);
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
function ManagePlayersSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Players</CardTitle>
        <CardDescription>
          Manage team rosters and player assignments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Player management features coming soon.
        </p>
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
  );
}
