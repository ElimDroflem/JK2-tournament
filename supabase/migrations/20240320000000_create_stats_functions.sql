-- Function to recalculate player lifetime stats
CREATE OR REPLACE FUNCTION recalculate_player_lifetime_stats(p_player_id INTEGER)
RETURNS void AS $$
BEGIN
    -- Update player_stats with aggregated data from player_match_stats using UPSERT
    INSERT INTO player_stats (
        player_id,
        flag_captures,
        flag_returns,
        bc_kills,
        dbs_kills,
        dfa_kills,
        overall_kills,
        overall_deaths,
        flaghold_time,
        impact,
        updated_at
    )
    SELECT 
        p_player_id,
        COALESCE(SUM(flag_captures), 0),
        COALESCE(SUM(flag_returns), 0),
        COALESCE(SUM(bc_kills), 0),
        COALESCE(SUM(dbs_kills), 0),
        COALESCE(SUM(dfa_kills), 0),
        COALESCE(SUM(overall_kills), 0),
        COALESCE(SUM(overall_deaths), 0),
        COALESCE(SUM(flaghold_time), 0),
        COALESCE(AVG(impact), 0),
        NOW()
    FROM player_match_stats
    WHERE player_id = p_player_id
    ON CONFLICT (player_id) DO UPDATE SET
        flag_captures = EXCLUDED.flag_captures,
        flag_returns = EXCLUDED.flag_returns,
        bc_kills = EXCLUDED.bc_kills,
        dbs_kills = EXCLUDED.dbs_kills,
        dfa_kills = EXCLUDED.dfa_kills,
        overall_kills = EXCLUDED.overall_kills,
        overall_deaths = EXCLUDED.overall_deaths,
        flaghold_time = EXCLUDED.flaghold_time,
        impact = EXCLUDED.impact,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

-- Function to update team stats for a match
CREATE OR REPLACE FUNCTION update_team_stats_for_match(p_match_id INTEGER)
RETURNS void AS $$
DECLARE
    v_team_a_id INTEGER;
    v_team_b_id INTEGER;
    v_score_a INTEGER;
    v_score_b INTEGER;
BEGIN
    -- Get match details
    SELECT team_a_id, team_b_id, score_a, score_b
    INTO v_team_a_id, v_team_b_id, v_score_a, v_score_b
    FROM matches
    WHERE id = p_match_id;

    -- Update team A stats using UPSERT
    INSERT INTO team_stats (
        team_id,
        matches_played,
        matches_won,
        matches_drawn,
        matches_lost,
        points,
        updated_at
    )
    SELECT 
        v_team_a_id,
        COALESCE(matches_played, 0) + 1,
        CASE WHEN v_score_a > v_score_b THEN COALESCE(matches_won, 0) + 1 ELSE COALESCE(matches_won, 0) END,
        CASE WHEN v_score_a = v_score_b THEN COALESCE(matches_drawn, 0) + 1 ELSE COALESCE(matches_drawn, 0) END,
        CASE WHEN v_score_a < v_score_b THEN COALESCE(matches_lost, 0) + 1 ELSE COALESCE(matches_lost, 0) END,
        CASE 
            WHEN v_score_a > v_score_b THEN COALESCE(points, 0) + 3
            WHEN v_score_a = v_score_b THEN COALESCE(points, 0) + 1
            ELSE COALESCE(points, 0)
        END,
        NOW()
    FROM team_stats
    WHERE team_id = v_team_a_id
    ON CONFLICT (team_id) DO UPDATE SET
        matches_played = EXCLUDED.matches_played,
        matches_won = EXCLUDED.matches_won,
        matches_drawn = EXCLUDED.matches_drawn,
        matches_lost = EXCLUDED.matches_lost,
        points = EXCLUDED.points,
        updated_at = EXCLUDED.updated_at;

    -- Update team B stats using UPSERT
    INSERT INTO team_stats (
        team_id,
        matches_played,
        matches_won,
        matches_drawn,
        matches_lost,
        points,
        updated_at
    )
    SELECT 
        v_team_b_id,
        COALESCE(matches_played, 0) + 1,
        CASE WHEN v_score_b > v_score_a THEN COALESCE(matches_won, 0) + 1 ELSE COALESCE(matches_won, 0) END,
        CASE WHEN v_score_b = v_score_a THEN COALESCE(matches_drawn, 0) + 1 ELSE COALESCE(matches_drawn, 0) END,
        CASE WHEN v_score_b < v_score_a THEN COALESCE(matches_lost, 0) + 1 ELSE COALESCE(matches_lost, 0) END,
        CASE 
            WHEN v_score_b > v_score_a THEN COALESCE(points, 0) + 3
            WHEN v_score_b = v_score_a THEN COALESCE(points, 0) + 1
            ELSE COALESCE(points, 0)
        END,
        NOW()
    FROM team_stats
    WHERE team_id = v_team_b_id
    ON CONFLICT (team_id) DO UPDATE SET
        matches_played = EXCLUDED.matches_played,
        matches_won = EXCLUDED.matches_won,
        matches_drawn = EXCLUDED.matches_drawn,
        matches_lost = EXCLUDED.matches_lost,
        points = EXCLUDED.points,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updates
CREATE OR REPLACE FUNCTION trigger_update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM recalculate_player_lifetime_stats(NEW.player_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_player_match_stats_change
    AFTER INSERT OR UPDATE OR DELETE ON player_match_stats
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_player_stats();

CREATE OR REPLACE FUNCTION trigger_update_team_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.is_completed = false AND NEW.is_completed = true) THEN
        PERFORM update_team_stats_for_match(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_match_completion
    AFTER UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_team_stats(); 