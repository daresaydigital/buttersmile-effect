import { createClient } from '@supabase/supabase-js';

const API_URL = process.env.REACT_APP_SUPABASE_API_URL || '';
const API_KEY = process.env.REACT_APP_SUPABASE_API_KEY || '';

const supabase = createClient(API_URL, API_KEY);

export default supabase;
