const SUPABASE_URL =
    "https://ztrgdltugiiityatvxpe.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_XPNsaBSY44-obehxipQ9mw_xSn0wVBN";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
