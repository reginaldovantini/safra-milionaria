import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://gehxrxgmgqgilweibiec.supabase.co";

const supabaseKey =
  "COLsb_publishable_wIjW7HcJKOe8IBdS8wdw-g_G9XgsaQ6";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );