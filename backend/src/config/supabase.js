const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials not found in environment variables. Set them before testing.");
}

const supabase = createClient(supabaseUrl || 'http://localhost', supabaseKey || 'dummy');

module.exports = supabase;
