-- Grant necessary permissions to the service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Grant specific permissions for trigger operations
-- ALTER TABLE player_match_stats OWNER TO service_role;
-- ALTER TABLE matches OWNER TO service_role;
-- ALTER TABLE player_stats OWNER TO service_role;
-- ALTER TABLE team_stats OWNER TO service_role; 