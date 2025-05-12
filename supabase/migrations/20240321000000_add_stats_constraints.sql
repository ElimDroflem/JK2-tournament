-- Add unique constraints to player_stats table
ALTER TABLE player_stats
ADD CONSTRAINT player_stats_player_id_key UNIQUE (player_id);

-- Add unique constraints to team_stats table
ALTER TABLE team_stats
ADD CONSTRAINT team_stats_team_id_key UNIQUE (team_id);

-- Add unique constraint to player_match_stats table
ALTER TABLE player_match_stats
ADD CONSTRAINT player_match_stats_match_id_player_id_key UNIQUE (match_id, player_id); 