const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dzhtpnskezkrtfinntbi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHRwbnNrZXprcnRmaW5udGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0NTI1MzcsImV4cCI6MjAyNTA2MjUzN30.M7nExGMa4PxLN7m7zVNBBHKL5k70yBqGgFdNJTGQu-Y'
);

async function listUsers() {
  try {
    const { data: users } = await supabase
      .from('user_profiles')
      .select('email, user_id')
      .ilike('email', '%ojasvy%');

    console.log('Users matching "ojasvy":');
    users?.forEach(u => console.log('  -', u.email));

    // Also check all test users
    console.log('\nAll test users:');
    const { data: allUsers } = await supabase
      .from('pet_profiles')
      .select('user_id, pet_name')
      .in('pet_name', ['Red', 'Red22', 'Red4', 'Rocky']);

    for (const pet of allUsers || []) {
      const { data: user } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('user_id', pet.user_id)
        .single();
      console.log(`  - ${user?.email} (${pet.pet_name})`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

listUsers();
