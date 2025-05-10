BEGIN;

CREATE TABLE IF NOT EXISTS public.player_match_stats (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    flag_captures INTEGER NOT NULL DEFAULT 0,
    flag_returns INTEGER NOT NULL DEFAULT 0,
    bc_kills INTEGER NOT NULL DEFAULT 0,
    dbs_kills INTEGER NOT NULL DEFAULT 0,
    dfa_kills INTEGER NOT NULL DEFAULT 0,
    overall_kills INTEGER NOT NULL DEFAULT 0,
    overall_deaths INTEGER NOT NULL DEFAULT 0,
    flaghold_time INTEGER NOT NULL DEFAULT 0, -- Assuming seconds
    impact INTEGER CHECK (impact IN (1, 2, 3)), -- Can be NULL if a player played but had no impact score submitted yet, or NOT NULL if always required from CSV
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_player_in_match UNIQUE (match_id, player_id)
);

-- Optional: Add a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_player_match_stats_updated_at
BEFORE UPDATE ON public.player_match_stats
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

COMMIT; 