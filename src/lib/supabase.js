import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qxdxqvksohebxyqldzjb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4ZHhxdmtzb2hlYnh5cWxkempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MjAxNzYsImV4cCI6MjA2NjQ5NjE3Nn0.rnR6kS9XHCwwYHrS0BnHesE2q-Z0yckhvg24BIOXTDQ'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})