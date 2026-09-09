// -------------------------------------
// PROJECT AQUIFER
// SUPABASE CONNECTION
// -------------------------------------


// Your Supabase project URL

const SUPABASE_URL =
    "https://rmnrxpqntdqgwrhjiwci.supabase.co";


// Replace ONLY the text below with
// your Supabase Publishable Key.

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_g6RoV66NvjdhyJa-TcsVgA_68H50cz8";


// Create the connection to Supabase

const aquiferSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


console.log(
    "Project Aquifer connected to Supabase."
);