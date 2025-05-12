export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      matches: {
        Row: {
          id: number;
          team_a_id: number;
          team_b_id: number;
          score_a: number;
          score_b: number;
          team_a_returns: number;
          team_b_returns: number;
          team_a_kills: number;
          team_b_kills: number;
          team_a_flag_time: number;
          team_b_flag_time: number;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
          stage: string;
        };
        Insert: {
          id?: number;
          team_a_id: number;
          team_b_id: number;
          score_a?: number;
          score_b?: number;
          team_a_returns?: number;
          team_b_returns?: number;
          team_a_kills?: number;
          team_b_kills?: number;
          team_a_flag_time?: number;
          team_b_flag_time?: number;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
          stage?: string;
        };
        Update: {
          id?: number;
          team_a_id?: number;
          team_b_id?: number;
          score_a?: number;
          score_b?: number;
          team_a_returns?: number;
          team_b_returns?: number;
          team_a_kills?: number;
          team_b_kills?: number;
          team_a_flag_time?: number;
          team_b_flag_time?: number;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
          stage?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_team_a_id_fkey";
            columns: ["team_a_id"];
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_team_b_id_fkey";
            columns: ["team_b_id"];
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ];
      };
      player_match_stats: {
        Row: {
          id: number;
          match_id: number;
          player_id: number;
          flag_captures: number;
          flag_returns: number;
          bc_kills: number;
          dbs_kills: number;
          dfa_kills: number;
          overall_kills: number;
          overall_deaths: number;
          flaghold_time: number;
          impact: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          match_id: number;
          player_id: number;
          flag_captures?: number;
          flag_returns?: number;
          bc_kills?: number;
          dbs_kills?: number;
          dfa_kills?: number;
          overall_kills?: number;
          overall_deaths?: number;
          flaghold_time?: number;
          impact?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          match_id?: number;
          player_id?: number;
          flag_captures?: number;
          flag_returns?: number;
          bc_kills?: number;
          dbs_kills?: number;
          dfa_kills?: number;
          overall_kills?: number;
          overall_deaths?: number;
          flaghold_time?: number;
          impact?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "player_match_stats_match_id_fkey";
            columns: ["match_id"];
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "player_match_stats_player_id_fkey";
            columns: ["player_id"];
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
      player_stats: {
        Row: {
          player_id: number;
          flag_captures: number;
          flag_returns: number;
          bc_kills: number;
          dbs_kills: number;
          dfa_kills: number;
          overall_kills: number;
          overall_deaths: number;
          flaghold_time: number;
          impact: number;
          updated_at: string;
        };
        Insert: {
          player_id: number;
          flag_captures?: number;
          flag_returns?: number;
          bc_kills?: number;
          dbs_kills?: number;
          dfa_kills?: number;
          overall_kills?: number;
          overall_deaths?: number;
          flaghold_time?: number;
          impact?: number;
          updated_at?: string;
        };
        Update: {
          player_id?: number;
          flag_captures?: number;
          flag_returns?: number;
          bc_kills?: number;
          dbs_kills?: number;
          dfa_kills?: number;
          overall_kills?: number;
          overall_deaths?: number;
          flaghold_time?: number;
          impact?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey";
            columns: ["player_id"];
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
      players: {
        Row: {
          id: number;
          name: string;
          team_id: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          team_id: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          team_id?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey";
            columns: ["team_id"];
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ];
      };
      team_stats: {
        Row: {
          team_id: number;
          matches_played: number;
          matches_won: number;
          matches_drawn: number;
          matches_lost: number;
          points: number;
          updated_at: string;
        };
        Insert: {
          team_id: number;
          matches_played?: number;
          matches_won?: number;
          matches_drawn?: number;
          matches_lost?: number;
          points?: number;
          updated_at?: string;
        };
        Update: {
          team_id?: number;
          matches_played?: number;
          matches_won?: number;
          matches_drawn?: number;
          matches_lost?: number;
          points?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_stats_team_id_fkey";
            columns: ["team_id"];
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ];
      };
      teams: {
        Row: {
          id: number;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      recalculate_player_lifetime_stats: {
        Args: {
          p_player_id: number;
        };
        Returns: void;
      };
      update_team_stats_for_match: {
        Args: {
          p_match_id: number;
        };
        Returns: void;
      };
      disable_triggers: {
        Args: Record<PropertyKey, never>;
        Returns: void;
      };
      enable_triggers: {
        Args: Record<PropertyKey, never>;
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
