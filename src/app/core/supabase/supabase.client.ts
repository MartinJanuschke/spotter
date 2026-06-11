import { createClient } from '@supabase/supabase-js';
import type { Database } from '../models/database.types';
import { environment } from '../../../environments/environment';

// The app only ever uses the publishable key (no user auth), so session
// persistence and token refresh are disabled — avoids Navigator-lock overhead.
export const supabase = createClient<Database>(environment.supabase.url, environment.supabase.key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
