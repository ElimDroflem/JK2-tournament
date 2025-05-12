-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_player_match_stats_change ON player_match_stats;

-- Drop the existing function
DROP FUNCTION IF EXISTS trigger_update_player_stats();

-- Create the updated trigger function
CREATE OR REPLACE FUNCTION trigger_update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        -- For DELETE operations, use OLD.player_id
        PERFORM recalculate_player_lifetime_stats(OLD.player_id);
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        -- For INSERT and UPDATE operations, use NEW.player_id
        PERFORM recalculate_player_lifetime_stats(NEW.player_id);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER on_player_match_stats_change
    AFTER INSERT OR UPDATE OR DELETE ON player_match_stats
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_player_stats(); 