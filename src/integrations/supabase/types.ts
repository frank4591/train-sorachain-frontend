export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      configuration_files: {
        Row: {
          cli_command: string | null
          created_at: string
          file_content: string
          file_name: string
          id: string
          task_id: string | null
          updated_at: string
        }
        Insert: {
          cli_command?: string | null
          created_at?: string
          file_content: string
          file_name: string
          id?: string
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          cli_command?: string | null
          created_at?: string
          file_content?: string
          file_name?: string
          id?: string
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configuration_files_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_history: {
        Row: {
          amount: number
          id: string
          reason: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          amount: number
          id?: string
          reason: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          id?: string
          reason?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delegation_nodes: {
        Row: {
          created_at: string
          delegator_apy: number
          description: string | null
          id: string
          name: string
          owner_id: string | null
          quarterly_delegation_growth: number
          reward_sharing_ratio: number
          total_stake: number
          updated_at: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          delegator_apy: number
          description?: string | null
          id?: string
          name: string
          owner_id?: string | null
          quarterly_delegation_growth?: number
          reward_sharing_ratio: number
          total_stake?: number
          updated_at?: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          delegator_apy?: number
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          quarterly_delegation_growth?: number
          reward_sharing_ratio?: number
          total_stake?: number
          updated_at?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delegation_nodes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delegations: {
        Row: {
          amount: number
          id: string
          node_id: string | null
          staked_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          id?: string
          node_id?: string | null
          staked_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          id?: string
          node_id?: string | null
          staked_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delegations_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "delegation_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delegations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_key: string | null
          country: string | null
          created_at: string
          credits: number
          date_of_birth: string | null
          email: string
          id: string
          name: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          auth_key?: string | null
          country?: string | null
          created_at?: string
          credits?: number
          date_of_birth?: string | null
          email: string
          id: string
          name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          auth_key?: string | null
          country?: string | null
          created_at?: string
          credits?: number
          date_of_birth?: string | null
          email?: string
          id?: string
          name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      staked_tasks: {
        Row: {
          credits_staked: number
          id: string
          node_type: Database["public"]["Enums"]["node_type"] | null
          role: Database["public"]["Enums"]["user_role"]
          staked_at: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          credits_staked: number
          id?: string
          node_type?: Database["public"]["Enums"]["node_type"] | null
          role: Database["public"]["Enums"]["user_role"]
          staked_at?: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          credits_staked?: number
          id?: string
          node_type?: Database["public"]["Enums"]["node_type"] | null
          role?: Database["public"]["Enums"]["user_role"]
          staked_at?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staked_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staked_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_available_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          task_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          task_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_available_roles_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string | null
          config_file: string | null
          created_at: string
          created_by: string | null
          credit_reward: number
          daily_rewards_percentage: number | null
          description: string
          end_date: string
          id: string
          participation_node_cap: number | null
          required_credits: number
          staking_ratio: string | null
          start_date: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          config_file?: string | null
          created_at?: string
          created_by?: string | null
          credit_reward: number
          daily_rewards_percentage?: number | null
          description: string
          end_date: string
          id?: string
          participation_node_cap?: number | null
          required_credits: number
          staking_ratio?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          config_file?: string | null
          created_at?: string
          created_by?: string | null
          credit_reward?: number
          daily_rewards_percentage?: number | null
          description?: string
          end_date?: string
          id?: string
          participation_node_cap?: number | null
          required_credits?: number
          staking_ratio?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      node_type: "trainer" | "aggregator" | "validator"
      submission_status: "pending" | "approved" | "rejected"
      task_status: "available" | "in_progress" | "completed" | "failed"
      user_role: "client" | "delegator" | "validator" | "aggregator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
