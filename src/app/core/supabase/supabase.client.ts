import { createClient } from '@supabase/supabase-js';
import type { Database } from '../models/database.types';
import { environment } from '../../../environments/environment';

export const supabase = createClient<Database>(environment.supabase.url, environment.supabase.key);
