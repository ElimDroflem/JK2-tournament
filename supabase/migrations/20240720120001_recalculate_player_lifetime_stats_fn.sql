BEGIN;

CREATE OR REPLACE FUNCTION public.recalculate_player_lifetime_stats(p_player_id INTEGER)
RETURNS VOID AS $$
BEGIN
    -- Ensure the player_stats row exists for this player
    INSERT INTO public.player_stats (player_id, impact, flag_captures, flag_returns, bc_kills, dbs_kills, dfa_kills, overall_kills, overall_deaths, flaghold_time)
    VALUES (p_player_id, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    ON CONFLICT (player_id) DO NOTHING;

    -- Update the lifetime stats by summing up all records from player_match_stats
    UPDATE public.player_stats ps
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
        FROM public.player_match_stats
        WHERE player_id = p_player_id
        GROUP BY player_id
    ) AS agg
    WHERE ps.player_id = p_player_id;

    -- If no match stats exist for this player, reset all stats to 0
    IF NOT EXISTS (SELECT 1 FROM public.player_match_stats WHERE player_id = p_player_id) THEN
        UPDATE public.player_stats
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

-- Example of how to call it:
-- SELECT recalculate_player_lifetime_stats(1);

COMMIT; 