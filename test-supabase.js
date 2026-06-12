import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lkaiqaqazpyfuvdtvtqz.supabase.co',
  'REDACTED_SUPABASE_KEY'
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
