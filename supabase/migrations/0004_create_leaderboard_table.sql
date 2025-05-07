CREATE TABLE public.leaderboard (
    team_id UUID PRIMARY KEY,    -- PK, FK to teams.id
    wins INT NOT NULL DEFAULT 0,
    losses INT NOT NULL DEFAULT 0,
    draws INT NOT NULL DEFAULT 0,
    points INT NOT NULL DEFAULT 0, -- Computed: wins*3 + draws*1 (will be maintained by trigger/logic)
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- Last recalculation timestamp
    CONSTRAINT fk_leaderboard_team FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE -- If team is deleted, remove from leaderboard
);

-- Indexes
CREATE INDEX idx_leaderboard_points ON public.leaderboard(points DESC); -- For ordered leaderboard queries

COMMENT ON TABLE public.leaderboard IS 'Stores aggregated team statistics for leaderboard ranking.';
COMMENT ON COLUMN public.leaderboard.points IS 'Computed: wins*3 + draws*1. Maintained by triggers or scheduled functions.';
COMMENT ON COLUMN public.leaderboard.updated_at IS 'Timestamp of the last update to this teams record.';

-- Note: The PRD specifies points as "Computed: wins*3 + draws*1".
-- This computation will need to be handled by a database trigger 
-- (e.g., on insert/update of match_results) or a scheduled function that recalculates these values.
-- A CHECK constraint could enforce points = wins*3 + draws*1, but that makes direct updates to wins/losses/draws complex.
-- It is often better to ensure this logic in the function/trigger that updates these rows. 