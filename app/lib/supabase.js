import { createClient } from '@supabase/supabase-js';

// Read-only client: the publishable key can only select, enforced by RLS.
export const createReadClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? createClient(url, key) : null;
};
