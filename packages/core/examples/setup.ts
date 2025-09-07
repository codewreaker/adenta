import { setupSupabase } from '../src/setup/supabase.ts'

const d = await setupSupabase()

console.dir(d)