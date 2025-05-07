CREATE TABLE public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,      -- FK to auth.users.id
    team_id UUID NOT NULL,      -- FK to teams.id
    username TEXT NOT NULL,     -- In-game username
    avatar_url TEXT,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_players_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_players_team FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE,
    CONSTRAINT uq_player_team UNIQUE (user_id, team_id) -- A user can only be on one team
);

-- Indexes
CREATE INDEX idx_players_user_id ON public.players(user_id);
CREATE INDEX idx_players_team_id ON public.players(team_id);
CREATE INDEX idx_players_username ON public.players(username);

COMMENT ON COLUMN public.players.user_id IS 'FK to auth.users.id, representing the authenticated user playing';
COMMENT ON COLUMN public.players.username IS 'In-game display name, may differ from auth username'; 