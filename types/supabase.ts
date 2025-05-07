export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: number
          name: string
          founded: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          founded: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          founded?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_stats: {
        Row: {
          id: number
          team_id: number
          matches_played: number
          matches_won: number
          matches_drawn: number
          matches_lost: number
          captures: number
          flag_returns: number
          kills: number
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          team_id: number
          matches_played: number
          matches_won: number
          matches_drawn: number
          matches_lost: number
          captures: number
          flag_returns: number
          kills: number
          points: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          team_id?: number
          matches_played?: number
          matches_won?: number
          matches_drawn?: number
          matches_lost?: number
          captures?: number
          flag_returns?: number
          kills?: number
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: number
          name: string
          team_id: number
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          team_id: number
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          team_id?: number
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      player_stats: {
        Row: {
          id: number
          player_id: number
          impact: number
          flag_captures: number
          flag_returns: number
          bc_kills: number
          dbs_kills: number
          dfa_kills: number
          overall_kills: number
          overall_deaths: number
          flaghold_time: number
          nemesis_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          player_id: number
          impact: number
          flag_captures: number
          flag_returns: number
          bc_kills: number
          dbs_kills: number
          dfa_kills: number
          overall_kills: number
          overall_deaths: number
          flaghold_time: number
          nemesis_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          player_id?: number
          impact?: number
          flag_captures?: number
          flag_returns?: number
          bc_kills?: number
          dbs_kills?: number
          dfa_kills?: number
          overall_kills?: number
          overall_deaths?: number
          flaghold_time?: number
          nemesis_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: number
          round: string
          team_a_id: number
          team_b_id: number
          score_a: number | null
          score_b: number | null
          date: string
          time: string | null
          team_a_returns: number | null
          team_b_returns: number | null
          team_a_kills: number | null
          team_b_kills: number | null
          team_a_flag_time: number | null
          team_b_flag_time: number | null
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          round: string
          team_a_id: number
          team_b_id: number
          score_a?: number | null
          score_b?: number | null
          date: string
          time?: string | null
          team_a_returns?: number | null
          team_b_returns?: number | null
          team_a_kills?: number | null
          team_b_kills?: number | null
          team_a_flag_time?: number | null
          team_b_flag_time?: number | null
          is_completed: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          round?: string
          team_a_id?: number
          team_b_id?: number
          score_a?: number | null
          score_b?: number | null
          date?: string
          time?: string | null
          team_a_returns?: number | null
          team_b_returns?: number | null
          team_a_kills?: number | null
          team_b_kills?: number | null
          team_a_flag_time?: number | null
          team_b_flag_time?: number | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
