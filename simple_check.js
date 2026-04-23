const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dzhtpnskezkrtfinntbi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHRwbnNrZXprcnRmaW5udGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0NTI1MzcsImV4cCI6MjAyNTA2MjUzN30.M7nExGMa4PxLN7m7zVNBBHKL5k70yBqGgFdNJTGQu-Y'
);

async function check() {
  const { data, error } = await supabase.from('pet_profiles').select('count', { count: 'exact' });
  console.log('Error:', error?.message || 'None');
  console.log('Pet profiles count:', data);

  const { data: pets2 } = await supabase.from('pet_profiles').select('*').limit(1);
  console.log('Sample pet:', pets2?.[0]);
}

check();
