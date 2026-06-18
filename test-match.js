import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lkaiqaqazpyfuvdtvtqz.supabase.co',
  'REDACTED_SUPABASE_KEY'
);

async function runTest() {
  const payload = {
    user_id: 'test-firebase-uid-12345',
    resume_file_name: 'test.pdf',
    resume_text: 'Test resume text',
    extracted_skills: ['JavaScript', 'React'],
    upload_date: new Date().toISOString(),
    last_updated: new Date().toISOString()
  };

  console.log('Attempting to upsert...');
  const { data, error } = await supabase
    .from('match_resumes')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Success:', data);
  }
}

runTest();
