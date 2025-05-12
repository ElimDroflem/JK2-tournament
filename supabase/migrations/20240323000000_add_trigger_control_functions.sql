-- Create function to disable triggers
CREATE OR REPLACE FUNCTION disable_triggers()
RETURNS void AS $$
BEGIN
    -- Disable the player stats trigger if it exists
    BEGIN
        ALTER TABLE player_match_stats DISABLE TRIGGER on_player_match_stats_change;
    EXCEPTION WHEN undefined_object THEN
        -- Trigger doesn't exist, that's okay
        NULL;
    END;
    
    -- Disable the team stats trigger if it exists
    BEGIN
        ALTER TABLE matches DISABLE TRIGGER on_match_completion;
    EXCEPTION WHEN undefined_object THEN
        -- Trigger doesn't exist, that's okay
        NULL;
    END;
END;
$$ LANGUAGE plpgsql;

-- Create function to enable triggers
CREATE OR REPLACE FUNCTION enable_triggers()
RETURNS void AS $$
BEGIN
    -- Enable the player stats trigger if it exists
    BEGIN
        ALTER TABLE player_match_stats ENABLE TRIGGER on_player_match_stats_change;
    EXCEPTION WHEN undefined_object THEN
        -- Trigger doesn't exist, that's okay
        NULL;
    END;
    
    -- Enable the team stats trigger if it exists
    BEGIN
        ALTER TABLE matches ENABLE TRIGGER on_match_completion;
    EXCEPTION WHEN undefined_object THEN
        -- Trigger doesn't exist, that's okay
        NULL;
    END;
END;
$$ LANGUAGE plpgsql; 