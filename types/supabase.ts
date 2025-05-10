export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      matches: {
        Row: {
          created_at: string | null;
          date: string;
          id: number;
          is_completed: boolean;
          round: string;
          score_a: number | null;
          score_b: number | null;
          team_a_flag_time: number | null;
          team_a_id: number;
          team_a_kills: number | null;
          team_a_returns: number | null;
          team_b_flag_time: number | null;
          team_b_id: number;
          team_b_kills: number | null;
          team_b_returns: number | null;
          time: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: number;
          is_completed?: boolean;
          round: string;
          score_a?: number | null;
          score_b?: number | null;
          team_a_flag_time?: number | null;
          team_a_id: number;
          team_a_kills?: number | null;
          team_a_returns?: number | null;
          team_b_flag_time?: number | null;
          team_b_id: number;
          team_b_kills?: number | null;
          team_b_returns?: number | null;
          time?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: number;
          is_completed?: boolean;
          round?: string;
          score_a?: number | null;
          score_b?: number | null;
          team_a_flag_time?: number | null;
          team_a_id?: number;
          team_a_kills?: number | null;
          team_a_returns?: number | null;
          team_b_flag_time?: number | null;
          team_b_id?: number;
          team_b_kills?: number | null;
          team_b_returns?: number | null;
          time?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "matches_team_a_id_fkey";
            columns: ["team_a_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_team_b_id_fkey";
            columns: ["team_b_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ];
      };
      player_stats: {
        Row: {
          bc_kills: number;
          created_at: string | null;
          dbs_kills: number;
          dfa_kills: number;
          flag_captures: number;
          flag_returns: number;
          flaghold_time: number;
          id: number;
          impact: number;
          overall_deaths: number;
          overall_kills: number;
          player_id: number;
          updated_at: string | null;
        };
        Insert: {
          bc_kills?: number;
          created_at?: string | null;
          dbs_kills?: number;
          dfa_kills?: number;
          flag_captures?: number;
          flag_returns?: number;
          flaghold_time?: number;
          id?: number;
          impact?: number;
          overall_deaths?: number;
          overall_kills?: number;
          player_id: number;
          updated_at?: string | null;
        };
        Update: {
          bc_kills?: number;
          created_at?: string | null;
          dbs_kills?: number;
          dfa_kills?: number;
          flag_captures?: number;
          flag_returns?: number;
          flaghold_time?: number;
          id?: number;
          impact?: number;
          overall_deaths?: number;
          overall_kills?: number;
          player_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
      players: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          role: string | null;
          team_id: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          role?: string | null;
          team_id: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          role?: string | null;
          team_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ];
      };
      team_stats: {
        Row: {
          captures: number;
          created_at: string | null;
          flag_returns: number;
          id: number;
          kills: number;
          matches_drawn: number;
          matches_lost: number;
          matches_played: number;
          matches_won: number;
          points: number;
          team_id: number;
          updated_at: string | null;
        };
        Insert: {
          captures?: number;
          created_at?: string | null;
          flag_returns?: number;
          id?: number;
          kills?: number;
          matches_drawn?: number;
          matches_lost?: number;
          matches_played?: number;
          matches_won?: number;
          points?: number;
          team_id: number;
          updated_at?: string | null;
        };
        Update: {
          captures?: number;
          created_at?: string | null;
          flag_returns?: number;
          id?: number;
          kills?: number;
          matches_drawn?: number;
          matches_lost?: number;
          matches_played?: number;
          matches_won?: number;
          points?: number;
          team_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "team_stats_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ];
      };
      teams: {
        Row: {
          created_at: string | null;
          founded: string;
          id: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          founded: string;
          id?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          founded?: string;
          id?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      update_team_stats_for_match: {
        Args: {
          p_match_id: number;
        };
        Returns: undefined; // Corresponds to VOID in SQL
      };
      // Add execute_sql definition here if you create and use that function
      // execute_sql: {
      //   Args: {
      //     sql_query: string
      //   }
      //   Returns: void // Or appropriate return type
      // }
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

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
