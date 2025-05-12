-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_player_match_stats_change ON player_match_stats;
DROP FUNCTION IF EXISTS trigger_update_player_stats();
DROP FUNCTION IF EXISTS recalculate_player_lifetime_stats(integer);

-- Create updated trigger function
CREATE OR REPLACE FUNCTION trigger_update_player_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Determine which player_id to use based on operation
    IF (TG_OP = 'DELETE') THEN
        v_player_id := OLD.player_id;
    ELSE
        v_player_id := NEW.player_id;
    END IF;

    -- Ensure we have a valid player_id
    IF v_player_id IS NULL THEN
        RAISE EXCEPTION 'player_id cannot be null';
    END IF;

    -- Call recalculation function
    PERFORM recalculate_player_lifetime_stats(v_player_id);

    -- Return appropriate record based on operation
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated recalculation function
CREATE OR REPLACE FUNCTION recalculate_player_lifetime_stats(p_player_id INTEGER)
RETURNS VOID AS $$
BEGIN
    -- Ensure we have a valid player_id
    IF p_player_id IS NULL THEN
        RAISE EXCEPTION 'player_id cannot be null';
    END IF;

    -- First ensure the player_stats row exists
    INSERT INTO player_stats (
        player_id,
        impact,
        flag_captures,
        flag_returns,
        bc_kills,
        dbs_kills,
        dfa_kills,
        overall_kills,
        overall_deaths,
        flaghold_time,
        created_at,
        updated_at
    )
    VALUES (
        p_player_id,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        NOW(),
        NOW()
    )
    ON CONFLICT (player_id) DO NOTHING;

    -- Update stats based on match stats
    UPDATE player_stats ps
    SET
        flag_captures = COALESCE(agg.total_flag_captures, 0),
        flag_returns = COALESCE(agg.total_flag_returns, 0),
        bc_kills = COALESCE(agg.total_bc_kills, 0),
        dbs_kills = COALESCE(agg.total_dbs_kills, 0),
        dfa_kills = COALESCE(agg.total_dfa_kills, 0),
        overall_kills = COALESCE(agg.total_overall_kills, 0),
        overall_deaths = COALESCE(agg.total_overall_deaths, 0),
        flaghold_time = COALESCE(agg.total_flaghold_time, 0),
        impact = COALESCE(agg.avg_impact, 0),
        updated_at = NOW()
    FROM (
        SELECT
            player_id,
            SUM(flag_captures) AS total_flag_captures,
            SUM(flag_returns) AS total_flag_returns,
            SUM(bc_kills) AS total_bc_kills,
            SUM(dbs_kills) AS total_dbs_kills,
            SUM(dfa_kills) AS total_dfa_kills,
            SUM(overall_kills) AS total_overall_kills,
            SUM(overall_deaths) AS total_overall_deaths,
            SUM(flaghold_time) AS total_flaghold_time,
            ROUND(AVG(impact))::integer AS avg_impact
        FROM player_match_stats
        WHERE player_id = p_player_id
        GROUP BY player_id
    ) AS agg
    WHERE ps.player_id = p_player_id;

    -- If no match stats exist, ensure all stats are zero
    IF NOT EXISTS (SELECT 1 FROM player_match_stats WHERE player_id = p_player_id) THEN
        UPDATE player_stats
        SET
            flag_captures = 0,
            flag_returns = 0,
            bc_kills = 0,
            dbs_kills = 0,
            dfa_kills = 0,
            overall_kills = 0,
            overall_deaths = 0,
            flaghold_time = 0,
            impact = 0,
            updated_at = NOW()
        WHERE player_id = p_player_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_player_match_stats_change
    AFTER INSERT OR UPDATE OR DELETE ON player_match_stats
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_player_stats(); 