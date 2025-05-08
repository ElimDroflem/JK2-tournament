-- Function to update team_stats based on a completed match result
CREATE OR REPLACE FUNCTION public.update_team_stats_for_match(p_match_id INT)
RETURNS VOID AS $$
DECLARE
    match_record RECORD;
    team_a_result TEXT;
    team_b_result TEXT;
    team_a_points INT;
    team_b_points INT;
    team_a_captures INT;
    team_b_captures INT;
    team_a_kills INT;
    team_b_kills INT;
    team_a_returns INT;
    team_b_returns INT;
BEGIN
    -- 1. Get the completed match details
    SELECT * 
    INTO match_record
    FROM public.matches
    WHERE id = p_match_id AND is_completed = true;

    -- Exit if match not found or not completed
    IF NOT FOUND THEN
        RAISE WARNING '''Match ID % not found or not completed. No team stats updated.''', p_match_id;
        RETURN;
    END IF;

    -- 2. Determine result and points based on scores already in the matches table
    IF match_record.score_a > match_record.score_b THEN
        team_a_result := '''win''';
        team_b_result := '''loss''';
        team_a_points := 3;
        team_b_points := 0;
    ELSIF match_record.score_b > match_record.score_a THEN
        team_a_result := '''loss''';
        team_b_result := '''win''';
        team_a_points := 0;
        team_b_points := 3;
    ELSE -- Draw or scores are null (treat null scores as a draw for points)
        team_a_result := '''draw''';
        team_b_result := '''draw''';
        team_a_points := 1;
        team_b_points := 1;
    END IF;

    -- Get other stats from the match record (scores often represent captures)
    team_a_captures := COALESCE(match_record.score_a, 0);
    team_b_captures := COALESCE(match_record.score_b, 0);
    team_a_kills := COALESCE(match_record.team_a_kills, 0);
    team_b_kills := COALESCE(match_record.team_b_kills, 0);
    team_a_returns := COALESCE(match_record.team_a_returns, 0);
    team_b_returns := COALESCE(match_record.team_b_returns, 0);


    -- 3. Update Team A stats using INSERT ON CONFLICT
    INSERT INTO public.team_stats (team_id, matches_played, matches_won, matches_drawn, matches_lost, points, captures, flag_returns, kills, updated_at)
    VALUES (
        match_record.team_a_id, 1, 
        CASE WHEN team_a_result = '''win''' THEN 1 ELSE 0 END,
        CASE WHEN team_a_result = '''draw''' THEN 1 ELSE 0 END,
        CASE WHEN team_a_result = '''loss''' THEN 1 ELSE 0 END,
        team_a_points, team_a_captures, team_a_returns, team_a_kills, now()
    )
    ON CONFLICT (team_id) DO UPDATE SET
        matches_played = team_stats.matches_played + 1,
        matches_won = team_stats.matches_won + CASE WHEN team_a_result = '''win''' THEN 1 ELSE 0 END,
        matches_drawn = team_stats.matches_drawn + CASE WHEN team_a_result = '''draw''' THEN 1 ELSE 0 END,
        matches_lost = team_stats.matches_lost + CASE WHEN team_a_result = '''loss''' THEN 1 ELSE 0 END,
        points = team_stats.points + team_a_points,
        captures = team_stats.captures + team_a_captures, 
        flag_returns = team_stats.flag_returns + team_a_returns,
        kills = team_stats.kills + team_a_kills,
        updated_at = now();

    -- 4. Update Team B stats using INSERT ON CONFLICT
    INSERT INTO public.team_stats (team_id, matches_played, matches_won, matches_drawn, matches_lost, points, captures, flag_returns, kills, updated_at)
    VALUES (
        match_record.team_b_id, 1,
        CASE WHEN team_b_result = '''win''' THEN 1 ELSE 0 END,
        CASE WHEN team_b_result = '''draw''' THEN 1 ELSE 0 END,
        CASE WHEN team_b_result = '''loss''' THEN 1 ELSE 0 END,
        team_b_points, team_b_captures, team_b_returns, team_b_kills, now()
    )
    ON CONFLICT (team_id) DO UPDATE SET
        matches_played = team_stats.matches_played + 1,
        matches_won = team_stats.matches_won + CASE WHEN team_b_result = '''win''' THEN 1 ELSE 0 END,
        matches_drawn = team_stats.matches_drawn + CASE WHEN team_b_result = '''draw''' THEN 1 ELSE 0 END,
        matches_lost = team_stats.matches_lost + CASE WHEN team_b_result = '''loss''' THEN 1 ELSE 0 END,
        points = team_stats.points + team_b_points,
        captures = team_stats.captures + team_b_captures, 
        flag_returns = team_stats.flag_returns + team_b_returns,
        kills = team_stats.kills + team_b_kills,
        updated_at = now();

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.update_team_stats_for_match(INT) IS '''Updates aggregated team statistics in team_stats after a match score/completion status is updated in the matches table.'''; 