const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dzhtpnskezkrtfinntbi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHRwbnNrZXprcnRmaW5udGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0NTI1MzcsImV4cCI6MjAyNTA2MjUzN30.M7nExGMa4PxLN7m7zVNBBHKL5k70yBqGgFdNJTGQu-Y'
);

async function checkDB() {
  try {
    console.log('Checking user_profiles...');
    const { data: users } = await supabase.from('user_profiles').select('email').limit(10);
    console.log('Sample emails:', users?.map(u => u.email));

    console.log('\nChecking pet_profiles...');
    const { data: pets } = await supabase.from('pet_profiles').select('pet_name, city').limit(10);
    console.log('Sample pets:', pets?.map(p => `${p.pet_name} (${p.city})`));

    console.log('\nSearching for ojasvy43...');
    const { data: ojasvy } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('email', '%ojasvy43%');
    if (ojasvy?.length > 0) {
      console.log('Found:', ojasvy[0].email);
    } else {
      console.log('Not found');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkDB();
