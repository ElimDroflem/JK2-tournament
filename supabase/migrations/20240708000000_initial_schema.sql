-- ==== Teams Table ====
CREATE TABLE IF NOT EXISTS public.teams (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    founded TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.teams IS '''Stores information about participating teams.''';

-- ==== Players Table ====
CREATE TABLE IF NOT EXISTS public.players (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    team_id INTEGER NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    role TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON public.players(team_id);
COMMENT ON TABLE public.players IS '''Stores information about individual players and their team affiliation.''';

-- ==== Matches Table ====
CREATE TABLE IF NOT EXISTS public.matches (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    round TEXT NOT NULL,
    team_a_id INTEGER NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    team_b_id INTEGER NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    score_a INTEGER,
    score_b INTEGER,
    date TEXT NOT NULL, -- Consider DATE type if format is consistent
    time TEXT, -- Consider TIME type if format is consistent
    team_a_returns INTEGER,
    team_b_returns INTEGER,
    team_a_kills INTEGER,
    team_b_kills INTEGER,
    team_a_flag_time INTEGER, -- Consider INTERVAL or store as seconds
    team_b_flag_time INTEGER, -- Consider INTERVAL or store as seconds
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT check_different_teams CHECK (team_a_id <> team_b_id)
);
CREATE INDEX IF NOT EXISTS idx_matches_team_a_id ON public.matches(team_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_team_b_id ON public.matches(team_b_id);
CREATE INDEX IF NOT EXISTS idx_matches_is_completed ON public.matches(is_completed);
COMMENT ON TABLE public.matches IS '''Stores information about scheduled and played matches.''';

-- ==== Team Stats Table ====
CREATE TABLE IF NOT EXISTS public.team_stats (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    team_id INTEGER NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    matches_played INTEGER NOT NULL DEFAULT 0,
    matches_won INTEGER NOT NULL DEFAULT 0,
    matches_drawn INTEGER NOT NULL DEFAULT 0,
    matches_lost INTEGER NOT NULL DEFAULT 0,
    captures INTEGER NOT NULL DEFAULT 0,
    flag_returns INTEGER NOT NULL DEFAULT 0,
    kills INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.team_stats IS '''Aggregated statistics for each team.''';

-- ==== Player Stats Table ====
CREATE TABLE IF NOT EXISTS public.player_stats (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    player_id INTEGER NOT NULL UNIQUE REFERENCES public.players(id) ON DELETE CASCADE,
    impact INTEGER NOT NULL DEFAULT 0, -- Assuming this is a numeric value
    flag_captures INTEGER NOT NULL DEFAULT 0,
    flag_returns INTEGER NOT NULL DEFAULT 0,
    bc_kills INTEGER NOT NULL DEFAULT 0,
    dbs_kills INTEGER NOT NULL DEFAULT 0,
    dfa_kills INTEGER NOT NULL DEFAULT 0,
    overall_kills INTEGER NOT NULL DEFAULT 0,
    overall_deaths INTEGER NOT NULL DEFAULT 0,
    flaghold_time INTEGER NOT NULL DEFAULT 0, -- Consider INTERVAL or store as seconds
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.player_stats IS '''Aggregated statistics for each player.''';

-- ==== Enable RLS for all tables ====
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

-- ==== Basic RLS Policies (Public Read, Admin Full Control) ====
-- For simplicity, 'admin' access is granted if true. Replace with actual role checks as needed.

-- Teams
CREATE POLICY "Public can read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Admins can manage teams" ON public.teams FOR ALL USING (true) WITH CHECK (true);

-- Players
CREATE POLICY "Public can read players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Admins can manage players" ON public.players FOR ALL USING (true) WITH CHECK (true);

-- Matches
CREATE POLICY "Public can read matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Admins can manage matches" ON public.matches FOR ALL USING (true) WITH CHECK (true);

-- Team Stats
CREATE POLICY "Public can read team_stats" ON public.team_stats FOR SELECT USING (true);
CREATE POLICY "Admins can manage team_stats" ON public.team_stats FOR ALL USING (true) WITH CHECK (true);

-- Player Stats
CREATE POLICY "Public can read player_stats" ON public.player_stats FOR SELECT USING (true);
CREATE POLICY "Admins can manage player_stats" ON public.player_stats FOR ALL USING (true) WITH CHECK (true);

-- ==== Function to update 'updated_at' column ====
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==== Apply 'updated_at' trigger to tables ====
CREATE TRIGGER set_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_team_stats_updated_at
BEFORE UPDATE ON public.team_stats
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_player_stats_updated_at
BEFORE UPDATE ON public.player_stats
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp(); 