import UploadForm from "./upload-form";

export default function AdminUploadPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Admin: Upload Player Stats CSV
      </h1>
      <p className="mb-4 text-muted-foreground">
        Upload a CSV file containing per-match player statistics. The CSV must
        contain columns for 'match_id', a unique 'player_identifier' (name or
        ID), and the player stats corresponding to the 'player_stats' table
        columns (e.g., impact, flag_captures, overall_kills, etc.).
      </p>
      <UploadForm />
    </div>
  );
}
