CREATE TYPE match_status AS ENUM ('scheduled', 'ongoing', 'completed', 'canceled');

CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_a_id UUID NOT NULL,
    team_b_id UUID NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    score_team_a INT,
    score_team_b INT,
    status match_status NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_matches_team_a FOREIGN KEY (team_a_id) REFERENCES public.teams(id) ON DELETE RESTRICT, -- Prevent team deletion if in matches
    CONSTRAINT fk_matches_team_b FOREIGN KEY (team_b_id) REFERENCES public.teams(id) ON DELETE RESTRICT, -- Prevent team deletion if in matches
    CONSTRAINT check_scores CHECK (score_team_a IS NULL OR score_team_a >= 0),
    CONSTRAINT check_scores_b CHECK (score_team_b IS NULL OR score_team_b >= 0),
    CONSTRAINT check_different_teams CHECK (team_a_id <> team_b_id)
);

-- Indexes
CREATE INDEX idx_matches_team_a_id ON public.matches(team_a_id);
CREATE INDEX idx_matches_team_b_id ON public.matches(team_b_id);
CREATE INDEX idx_matches_scheduled_at ON public.matches(scheduled_at);
CREATE INDEX idx_matches_status ON public.matches(status);

COMMENT ON TABLE public.matches IS 'Schedules and tracks scores for matches between two teams.';
COMMENT ON COLUMN public.matches.status IS 'Match status: scheduled, ongoing, completed, canceled.'; 