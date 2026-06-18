import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  'https://lkaiqaqazpyfuvdtvtqz.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    
    if (error) {
      console.log('Connection successful, Auth response:', error.message);
    } else {
      console.log('Login somehow succeeded!');
    }
  } catch (err) {
    console.error('Failed to connect:', err);
  }
}

testConnection();
