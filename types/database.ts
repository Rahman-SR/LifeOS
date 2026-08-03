export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDefinition<Row, Insert, Update, Relationships extends Relationship[] = []> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

type Timestamps = {
  created_at: string;
  updated_at: string;
};

type UserOwned = {
  user_id: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDefinition<
        {
          id: string;
          display_name: string;
          avatar_url: string | null;
          onboarding_completed: boolean;
          timezone: string;
          week_starts_on: number;
          theme_preference: string;
        } & Timestamps,
        {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          onboarding_completed?: boolean;
          timezone?: string;
          week_starts_on?: number;
          theme_preference?: string;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          onboarding_completed?: boolean;
          timezone?: string;
          week_starts_on?: number;
          theme_preference?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      task_categories: TableDefinition<
        UserOwned & {
          id: string;
          name: string;
          color: string;
          icon: string | null;
          position: number;
          created_at: string;
        },
        UserOwned & {
          id?: string;
          name: string;
          color: string;
          icon?: string | null;
          position?: number;
          created_at?: string;
        },
        Partial<UserOwned & {
          id: string;
          name: string;
          color: string;
          icon: string | null;
          position: number;
          created_at: string;
        }>
      >;
      tasks: TableDefinition<
        UserOwned & Timestamps & {
          id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          due_date: string | null;
          due_time: string | null;
          reminder_at: string | null;
          priority: string;
          is_completed: boolean;
          completed_at: string | null;
          recurrence_rule: string | null;
          position: number;
          archived_at: string | null;
        },
        UserOwned & {
          id?: string;
          category_id?: string | null;
          title: string;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          reminder_at?: string | null;
          priority?: string;
          is_completed?: boolean;
          completed_at?: string | null;
          recurrence_rule?: string | null;
          position?: number;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        Partial<UserOwned & Timestamps & {
          id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          due_date: string | null;
          due_time: string | null;
          reminder_at: string | null;
          priority: string;
          is_completed: boolean;
          completed_at: string | null;
          recurrence_rule: string | null;
          position: number;
          archived_at: string | null;
        }>,
        [{
          foreignKeyName: 'tasks_user_category_fkey';
          columns: ['user_id', 'category_id'];
          isOneToOne: false;
          referencedRelation: 'task_categories';
          referencedColumns: ['user_id', 'id'];
        }]
      >;
      habits: TableDefinition<
        UserOwned & Timestamps & {
          id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string | null;
          frequency_type: string;
          target_count: number;
          days_of_week: number[];
          reminder_time: string | null;
          is_active: boolean;
          position: number;
        },
        UserOwned & {
          id?: string;
          name: string;
          description?: string | null;
          color: string;
          icon?: string | null;
          frequency_type?: string;
          target_count?: number;
          days_of_week?: number[];
          reminder_time?: string | null;
          is_active?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        },
        Partial<UserOwned & Timestamps & {
          id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string | null;
          frequency_type: string;
          target_count: number;
          days_of_week: number[];
          reminder_time: string | null;
          is_active: boolean;
          position: number;
        }>
      >;
      habit_logs: TableDefinition<
        UserOwned & Timestamps & {
          id: string;
          habit_id: string;
          log_date: string;
          completed_count: number;
          note: string | null;
        },
        UserOwned & {
          id?: string;
          habit_id: string;
          log_date: string;
          completed_count?: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        Partial<UserOwned & Timestamps & {
          id: string;
          habit_id: string;
          log_date: string;
          completed_count: number;
          note: string | null;
        }>,
        [{
          foreignKeyName: 'habit_logs_user_habit_fkey';
          columns: ['user_id', 'habit_id'];
          isOneToOne: false;
          referencedRelation: 'habits';
          referencedColumns: ['user_id', 'id'];
        }]
      >;
      notes: TableDefinition<
        UserOwned & Timestamps & {
          id: string;
          title: string;
          content: string;
          color: string | null;
          is_pinned: boolean;
          archived_at: string | null;
        },
        UserOwned & {
          id?: string;
          title?: string;
          content?: string;
          color?: string | null;
          is_pinned?: boolean;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        Partial<UserOwned & Timestamps & {
          id: string;
          title: string;
          content: string;
          color: string | null;
          is_pinned: boolean;
          archived_at: string | null;
        }>
      >;
      mood_logs: TableDefinition<
        UserOwned & Timestamps & {
          id: string;
          log_date: string;
          mood_score: number;
          note: string | null;
        },
        UserOwned & {
          id?: string;
          log_date: string;
          mood_score: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        Partial<UserOwned & Timestamps & {
          id: string;
          log_date: string;
          mood_score: number;
          note: string | null;
        }>
      >;
      journal_entries: TableDefinition<
        UserOwned & Timestamps & {
          id: string;
          entry_date: string;
          title: string | null;
          content: string;
          mood_score: number | null;
        },
        UserOwned & {
          id?: string;
          entry_date: string;
          title?: string | null;
          content?: string;
          mood_score?: number | null;
          created_at?: string;
          updated_at?: string;
        },
        Partial<UserOwned & Timestamps & {
          id: string;
          entry_date: string;
          title: string | null;
          content: string;
          mood_score: number | null;
        }>
      >;
      goals: TableDefinition<
        UserOwned & Timestamps & {
          id: string;
          title: string;
          description: string | null;
          target_date: string | null;
          status: string;
          progress: number;
          color: string | null;
        },
        UserOwned & {
          id?: string;
          title: string;
          description?: string | null;
          target_date?: string | null;
          status?: string;
          progress?: number;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        Partial<UserOwned & Timestamps & {
          id: string;
          title: string;
          description: string | null;
          target_date: string | null;
          status: string;
          progress: number;
          color: string | null;
        }>
      >;
      goal_milestones: TableDefinition<
        UserOwned & Timestamps & {
          id: string;
          goal_id: string;
          title: string;
          is_completed: boolean;
          completed_at: string | null;
          position: number;
        },
        UserOwned & {
          id?: string;
          goal_id: string;
          title: string;
          is_completed?: boolean;
          completed_at?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        },
        Partial<UserOwned & Timestamps & {
          id: string;
          goal_id: string;
          title: string;
          is_completed: boolean;
          completed_at: string | null;
          position: number;
        }>,
        [{
          foreignKeyName: 'goal_milestones_user_goal_fkey';
          columns: ['user_id', 'goal_id'];
          isOneToOne: false;
          referencedRelation: 'goals';
          referencedColumns: ['user_id', 'id'];
        }]
      >;
      notification_preferences: TableDefinition<
        Timestamps & {
          user_id: string;
          task_reminders_enabled: boolean;
          habit_reminders_enabled: boolean;
          daily_summary_enabled: boolean;
          daily_summary_time: string;
        },
        {
          user_id: string;
          task_reminders_enabled?: boolean;
          habit_reminders_enabled?: boolean;
          daily_summary_enabled?: boolean;
          daily_summary_time?: string;
          created_at?: string;
          updated_at?: string;
        },
        Partial<Timestamps & {
          user_id: string;
          task_reminders_enabled: boolean;
          habit_reminders_enabled: boolean;
          daily_summary_enabled: boolean;
          daily_summary_time: string;
        }>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Row'];

export type TablesInsert<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Insert'];

export type TablesUpdate<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Update'];
