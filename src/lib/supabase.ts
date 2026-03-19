import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types
export interface Agent {
  id: string;
  user_id: string;
  name: string;
  gateway_url: string;
  test_prompt: string;
  expected_answer: string;
  check_interval: number; // minutes
  threshold: number; // 0-100
  created_at: string;
}

export interface Check {
  id: string;
  agent_id: string;
  score: number;
  response: string;
  judge_response: string;
  created_at: string;
}

export interface Alert {
  id: string;
  agent_id: string;
  score: number;
  triggered_at: string;
  resolved_at: string | null;
}
