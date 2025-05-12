# Product Requirements Document

**Project:** JK2 Summer Tournament 2025 (CTF)  
**Backend:** Supabase + Vercel

---

## 1. Overview

A backend service to power the JK2 Summer Tournament 2025 site, a Capture-the-Flag competition for _Star Wars Jedi Knight II: Jedi Outcast_.

- **Primary functions:**
  - Team & player management
  - Match scheduling, scoring, results
  - Live leaderboard
  - Real-time updates & notifications
  - Tournament structure management
  - Admin panel for tournament control
- **Tech stack:**
  - **Database & Auth:** Supabase
  - **API & Edge Logic:** Supabase Edge Functions (or Vercel Serverless)
  - **Hosting/CD:** Vercel
  - **Frontend:** Next.js with TypeScript

---

## 2. Data Models

### 2.1 `teams`

| Column       | Type                       | Nullable | Notes  |
| ------------ | -------------------------- | -------- | ------ |
| `id`         | `integer`                  | No       | PK     |
| `name`       | `text`                     | No       | Unique |
| `founded`    | `text`                     | No       |        |
| `created_at` | `timestamp with time zone` | Yes      |        |
| `updated_at` | `timestamp with time zone` | Yes      |        |

---

### 2.2 `players`

| Column       | Type                       | Nullable | Notes            |
| ------------ | -------------------------- | -------- | ---------------- |
| `id`         | `integer`                  | No       | PK               |
| `name`       | `text`                     | No       |                  |
| `team_id`    | `integer`                  | No       | FK -> `teams.id` |
| `role`       | `text`                     | Yes      |                  |
| `created_at` | `timestamp with time zone` | Yes      |                  |
| `updated_at` | `timestamp with time zone` | Yes      |                  |

---

### 2.3 `matches`

| Column             | Type                       | Nullable | Notes                  |
| ------------------ | -------------------------- | -------- | ---------------------- |
| `id`               | `integer`                  | No       | PK                     |
| `round`            | `text`                     | No       |                        |
| `team_a_id`        | `integer`                  | No       | FK -> `teams.id`       |
| `team_b_id`        | `integer`                  | No       | FK -> `teams.id`       |
| `score_a`          | `integer`                  | Yes      |                        |
| `score_b`          | `integer`                  | Yes      |                        |
| `date`             | `text`                     | No       |                        |
| `time`             | `text`                     | Yes      |                        |
| `team_a_returns`   | `integer`                  | Yes      |                        |
| `team_b_returns`   | `integer`                  | Yes      |                        |
| `team_a_kills`     | `integer`                  | Yes      |                        |
| `team_b_kills`     | `integer`                  | Yes      |                        |
| `team_a_flag_time` | `integer`                  | Yes      |                        |
| `team_b_flag_time` | `integer`                  | Yes      |                        |
| `is_completed`     | `boolean`                  | No       |                        |
| `stage`            | `text`                     | No       | group/semi-final/final |
| `order`            | `integer`                  | Yes      | Match sequence number  |
| `created_at`       | `timestamp with time zone` | Yes      |                        |
| `updated_at`       | `timestamp with time zone` | Yes      |                        |

---

### 2.4 `team_stats`

| Column           | Type                       | Nullable | Notes            |
| ---------------- | -------------------------- | -------- | ---------------- |
| `id`             | `integer`                  | No       | PK               |
| `team_id`        | `integer`                  | No       | FK -> `teams.id` |
| `matches_played` | `integer`                  | No       |                  |
| `matches_won`    | `integer`                  | No       |                  |
| `matches_drawn`  | `integer`                  | No       |                  |
| `matches_lost`   | `integer`                  | No       |                  |
| `captures`       | `integer`                  | No       |                  |
| `flag_returns`   | `integer`                  | No       |                  |
| `kills`          | `integer`                  | No       |                  |
| `points`         | `integer`                  | No       |                  |
| `created_at`     | `timestamp with time zone` | Yes      |                  |
| `updated_at`     | `timestamp with time zone` | Yes      |                  |

---

### 2.5 `player_stats`

| Column           | Type                       | Nullable | Notes              |
| ---------------- | -------------------------- | -------- | ------------------ |
| `id`             | `integer`                  | No       | PK                 |
| `player_id`      | `integer`                  | No       | FK -> `players.id` |
| `impact`         | `integer`                  | No       | Default: 0         |
| `flag_captures`  | `integer`                  | No       | Default: 0         |
| `flag_returns`   | `integer`                  | No       | Default: 0         |
| `bc_kills`       | `integer`                  | No       | Default: 0         |
| `dbs_kills`      | `integer`                  | No       | Default: 0         |
| `dfa_kills`      | `integer`                  | No       | Default: 0         |
| `overall_kills`  | `integer`                  | No       | Default: 0         |
| `overall_deaths` | `integer`                  | No       | Default: 0         |
| `flaghold_time`  | `integer`                  | No       | Default: 0         |
| `created_at`     | `timestamp with time zone` | Yes      | Default: now()     |
| `updated_at`     | `timestamp with time zone` | Yes      | Default: now()     |

### 2.6 `player_match_stats`

| Column           | Type                       | Nullable | Notes              |
| ---------------- | -------------------------- | -------- | ------------------ |
| `id`             | `integer`                  | No       | PK                 |
| `match_id`       | `integer`                  | No       | FK -> `matches.id` |
| `player_id`      | `integer`                  | No       | FK -> `players.id` |
| `flag_captures`  | `integer`                  | No       | Default: 0         |
| `flag_returns`   | `integer`                  | No       | Default: 0         |
| `bc_kills`       | `integer`                  | No       | Default: 0         |
| `dbs_kills`      | `integer`                  | No       | Default: 0         |
| `dfa_kills`      | `integer`                  | No       | Default: 0         |
| `overall_kills`  | `integer`                  | No       | Default: 0         |
| `overall_deaths` | `integer`                  | No       | Default: 0         |
| `flaghold_time`  | `integer`                  | No       | Default: 0         |
| `impact`         | `integer`                  | Yes      |                    |
| `created_at`     | `timestamp with time zone` | Yes      | Default: now()     |
| `updated_at`     | `timestamp with time zone` | Yes      | Default: now()     |

### 2.7 Database Triggers

#### 2.7.1 `on_player_match_stats_change`

- **Table**: `player_match_stats`
- **Events**: INSERT, UPDATE, DELETE
- **Function**: `trigger_update_player_stats()`
- **Purpose**: Maintains player lifetime stats by recalculating when match stats change

#### 2.7.2 `set_player_match_stats_updated_at`

- **Table**: `player_match_stats`
- **Events**: UPDATE
- **Function**: `trigger_set_timestamp()`
- **Purpose**: Updates the `updated_at` timestamp on record modification

### 2.8 Database Functions

#### 2.8.1 `recalculate_player_lifetime_stats(p_player_id INTEGER)`

- **Purpose**: Recalculates and updates a player's lifetime statistics
- **Behavior**:
  - Aggregates all stats from player_match_stats
  - Uses UPSERT to update player_stats
  - Handles null values with COALESCE
  - Updates timestamp on modification

---

## 3. Tournament Structure

### 3.1 Team Creation Process

- Two-week player registration period
- Admin-created balanced teams
- Player preferences:
  - Up to 3 players to avoid teaming with
  - 1-2 preferred teammates
- Role rotation requirement between consecutive games
- Community feedback on team proposals
- Team identity requirements:
  - Team name
  - Clan tag
  - Custom team colors/logo

### 3.2 Tournament Format

- Group Stage:
  - Single round-robin format
  - Each team plays every other team twice
- Knockout Stage:
  - Top 4 teams advance
  - Semi-finals: 1st vs 3rd, 2nd vs 4th
  - Finals: Winners of semi-finals

### 3.3 Match Rules

- 10-minute optional warm-up before matches
- Pre-match position assignments required
- Backup role adjustment plans required
- Highlight reel creation encouraged
- Continuous feedback collection

---

## 4. Admin Panel Features

### 4.1 Tournament Structure Management

- Generate tournament fixtures
- One-time generation of group stage, semi-finals, and finals
- Automatic team randomization
- Match order tracking
- Stage progression management

### 4.2 Team Management

- Create/edit team details
- Manage team rosters
- Update team statistics
- Track team performance metrics

### 4.3 Player Management

- Create new players
- Assign/unassign players to teams
- Track player statistics
- Manage player roles

### 4.4 Data Management

- CSV data import/export
- Data correction tools
- Statistics reset functionality
- Match result management

---

## 5. API Endpoints

### 5.1 Teams

- **GET** `/rest/v1/teams`
- **GET** `/rest/v1/teams?id=eq.{team_id}`
- **POST** `/rest/v1/teams`
- **PATCH** `/rest/v1/teams?id=eq.{team_id}`

### 5.2 Players

- **GET** `/rest/v1/players`
- **GET** `/rest/v1/players?id=eq.{player_id}`
- **POST** `/rest/v1/players`
- **PATCH** `/rest/v1/players?id=eq.{player_id}`
- **DELETE** `/rest/v1/players?id=eq.{player_id}`

### 5.3 Matches

- **GET** `/rest/v1/matches`
- **GET** `/rest/v1/matches?id=eq.{match_id}`
- **POST** `/rest/v1/matches`
- **PATCH** `/rest/v1/matches?id=eq.{match_id}`
- **DELETE** `/rest/v1/matches?id=eq.{match_id}`

### 5.4 Tournament Management

- **POST** `/api/admin/generate-tournament`
- **GET** `/api/admin/check-matches-exist`
- **POST** `/api/admin/update-player-team`
- **POST** `/api/admin/create-player-and-assign`

---

## 6. Real-time & Notifications

- **Realtime Subscriptions**
  - `supabase.from('matches').on('UPDATE', payload => { ... })`
  - `supabase.from('leaderboard').on('UPDATE', payload => { ... })`
- **Notification Channels**
  - `matches:updates` → live score updates
  - `leaderboard:updates` → points changes
- **Optional Push**
  - Supabase Functions → OneSignal / FCM

---

## 7. Scheduled & Triggered Tasks

| Trigger                | Action                                   | Mechanism                   |
| ---------------------- | ---------------------------------------- | --------------------------- |
| `match_results` INSERT | Set `matches.status = 'completed'`       | DB trigger + Edge Function  |
| Daily 00:00 UTC        | Recalculate `leaderboard` (wins/points)  | Supabase Scheduled Function |
| `matches.scheduled_at` | Auto-close unreported matches after 24 h | Scheduled Function / Cron   |

---

## 8. Security & Access Control

- **API Password Protection**
  - Required for all admin operations
  - Secure password storage
  - Rate limiting on password attempts
- **Data Validation**
  - Input sanitization
  - Type checking
  - Business rule validation
- **Audit Logging**
  - Track all admin actions
  - Log data modifications
  - Monitor system access

---

## 9. Environment & Secrets

Configure in Vercel:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 10. Deployment & CI/CD

1. **Repo** (GitHub / GitLab)
2. **Branch Protection** on `main`
3. **PR Previews** with Vercel
4. **Migrations** in `/supabase/migrations`
5. **Auto-deploy** on merge to `main`

---

## 11. Future Enhancements

- Automated team balancing algorithm
- Advanced statistics and analytics
- Tournament bracket visualization
- Match replay system
- Community voting system
- Automated highlight reel generation

---
