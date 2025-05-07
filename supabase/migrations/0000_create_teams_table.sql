CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    manager_id UUID, -- Assuming this will be a FK to an auth.users table or a custom users table
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES auth.users(id) ON DELETE SET NULL -- Placeholder, might need adjustment based on actual users table
);

COMMENT ON COLUMN public.teams.manager_id IS 'FK to auth.users.id if Supabase Auth is used for managers';

-- Indexes
CREATE INDEX idx_teams_manager_id ON public.teams(manager_id); 