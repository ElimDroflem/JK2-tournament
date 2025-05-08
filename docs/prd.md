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
- **Tech stack:**
  - **Database & Auth:** Supabase
  - **API & Edge Logic:** Supabase Edge Functions (or Vercel Serverless)
  - **Hosting/CD:** Vercel

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

| Column             | Type                       | Nullable | Notes            |
| ------------------ | -------------------------- | -------- | ---------------- |
| `id`               | `integer`                  | No       | PK               |
| `round`            | `text`                     | No       |                  |
| `team_a_id`        | `integer`                  | No       | FK -> `teams.id` |
| `team_b_id`        | `integer`                  | No       | FK -> `teams.id` |
| `score_a`          | `integer`                  | Yes      |                  |
| `score_b`          | `integer`                  | Yes      |                  |
| `date`             | `text`                     | No       |                  |
| `time`             | `text`                     | Yes      |                  |
| `team_a_returns`   | `integer`                  | Yes      |                  |
| `team_b_returns`   | `integer`                  | Yes      |                  |
| `team_a_kills`     | `integer`                  | Yes      |                  |
| `team_b_kills`     | `integer`                  | Yes      |                  |
| `team_a_flag_time` | `integer`                  | Yes      |                  |
| `team_b_flag_time` | `integer`                  | Yes      |                  |
| `is_completed`     | `boolean`                  | No       |                  |
| `created_at`       | `timestamp with time zone` | Yes      |                  |
| `updated_at`       | `timestamp with time zone` | Yes      |                  |

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
| `impact`         | `integer`                  | No       |                    |
| `flag_captures`  | `integer`                  | No       |                    |
| `flag_returns`   | `integer`                  | No       |                    |
| `bc_kills`       | `integer`                  | No       |                    |
| `dbs_kills`      | `integer`                  | No       |                    |
| `dfa_kills`      | `integer`                  | No       |                    |
| `overall_kills`  | `integer`                  | No       |                    |
| `overall_deaths` | `integer`                  | No       |                    |
| `flaghold_time`  | `integer`                  | No       |                    |
| `created_at`     | `timestamp with time zone` | Yes      |                    |
| `updated_at`     | `timestamp with time zone` | Yes      |                    |

---

## 3. Authentication & Authorization

none required

---

## 4. API Endpoints

Supabase auto-generates RESTful endpoints; for custom logic use Edge Functions.

### 4.1 Teams

- **GET** `/rest/v1/teams`
- **GET** `/rest/v1/teams?id=eq.{team_id}`
- **POST** `/rest/v1/teams`
  ```json
  {
    "name": "Dark Sabers",
    "logo_url": "https://…/logo.png"
  }
  ```

### :contentReference[oaicite:0]{index=0}ATCH\*\* `/rest/v1/teams?id=eq.{team_id}`

      {
        "name": "Light Blades",
        "logo_ur:contentReference[oaicite:1]{index=1}       "avatar_url": "https://…/avatar.png"
      }

- **PATCH** `/rest/v1/players?id=eq.{player_id}`

      {
        "team_id": "uuid-of-new-team",
        "username": "JediKnight"
      }

- **DELETE** `/rest/v1/players?id=eq.{player_id}`

---

### 4.3 Matches

- **GET** `/rest/v1/matches`
- **GET** `/rest/v1/matches?id=eq.{match_id}`
- **POST** `/rest/v1/matches`

      {
        "team_a_id": "uuid-team-a",
        "team_b_id": "uuid-team-b",
        "scheduled_at": "2025-07-15T18:00:00Z",
        "status": "scheduled"
      }

- **PATCH** `/rest/v1/matches?id=eq.{match_id}`

      {
        "score_team_a": 5,
        "score_team_b": 3,
        "status": "completed"
      }

- **DELETE** `/rest/v1/matches?id=eq.{match_id}`

---

### 4.4 Leaderboard

- **GET** `/rest/v1/leaderboard`

---

## 5. Real-time & Notifications

- **Realtime Subscriptions**
  - `supabase.from('matches').on('UPDATE', payload => { ... })`
  - `supabase.from('leaderboard').on('UPDATE', payload => { ... })`
- **Notification Channels**
  - `matches:updates` → live score updates
  - `leaderboard:updates` → points changes
- **Optional Push**
  - Supabase Functions → OneSignal / FCM

---

## 6. Scheduled & Triggered Tasks

| Trigger                | Action                                   | Mechanism                   |
| ---------------------- | ---------------------------------------- | --------------------------- |
| `match_results` INSERT | Set `matches.status = 'completed'`       | DB trigger + Edge Function  |
| Daily 00:00 UTC        | Recalculate `leaderboard` (wins/points)  | Supabase Scheduled Function |
| `matches.scheduled_at` | Auto-close unreported matches after 24 h | Scheduled Function / Cron   |

---

## 7. Environment & Secrets

Configure in Vercel:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
  -:contentReference[oaicite:2]{index=2}nce
- **TLS/SSL** on all connections
- **Input Validation** via JSON schema
- **RLS Policies** on every table
- **Audit Logging** (Supabase + Edge Functions)
- **Rate Limiting** with Vercel Edge Middleware

---

## 9. Deployment & CI/CD

1. **Repo** (GitHub / GitLab)
2. **Branch Protection** on `main`
3. **PR Previews** with Vercel
4. **Migrations** in `/supabase/migrations`

   supabase db push

5. **Auto-deploy** on merge to `main`

---
