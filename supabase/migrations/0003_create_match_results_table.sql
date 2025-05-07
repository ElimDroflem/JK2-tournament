CREATE TABLE public.match_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL UNIQUE, -- Each match should only have one result
    winner_team_id UUID NOT NULL,
    details TEXT,                  -- Game notes or logs
    reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_match_results_match FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE, -- If match is deleted, result is too
    CONSTRAINT fk_match_results_winner_team FOREIGN KEY (winner_team_id) REFERENCES public.teams(id) ON DELETE RESTRICT -- Don't delete winning team if in results
);

-- Indexes
CREATE INDEX idx_match_results_match_id ON public.match_results(match_id);
CREATE INDEX idx_match_results_winner_team_id ON public.match_results(winner_team_id);

COMMENT ON TABLE public.match_results IS 'Stores the outcome and details of a completed match.';
COMMENT ON COLUMN public.match_results.match_id IS 'FK to matches.id; unique to ensure one result per match.';

-- Trigger to update matches.status (as per PRD)
-- This will be a separate function and trigger definition, typically in its own file or later in the migration process.
-- For now, this table schema is complete. 