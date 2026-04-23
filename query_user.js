const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dzhtpnskezkrtfinntbi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHRwbnNrZXprcnRmaW5udGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0NTI1MzcsImV4cCI6MjAyNTA2MjUzN30.M7nExGMa4PxLN7m7zVNBBHKL5k70yBqGgFdNJTGQu-Y'
);

async function checkPrefs() {
  try {
    const { data: users } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'ojasvy34@gmail.com')
      .single();

    if (!users) {
      console.log('User not found');
      return;
    }

    const { data: pet } = await supabase
      .from('pet_profiles')
      .select('*')
      .eq('user_id', users.user_id)
      .single();

    const { data: prefs } = await supabase
      .from('matching_preferences')
      .select('*')
      .eq('pet_profile_id', pet.id)
      .single();

    console.log('\n📧 Email:', users.email);
    console.log('🐕 Pet:', pet.pet_name, '| Breed:', pet.breed, '| City:', pet.city);
    console.log('\n=== MATCHING PREFERENCES ===');
    console.log('Accept Any City:', prefs?.accept_any_city ?? 'NOT SET');
    console.log('Preferred Cities:', prefs?.preferred_cities?.length > 0 ? prefs.preferred_cities : 'NONE (same city only)');
    console.log('Preferred Breeds:', prefs?.preferred_breeds?.length > 0 ? prefs.preferred_breeds : 'NONE (any breed)');
    console.log('\nLooking for:');
    console.log('  - Playmates:', prefs?.looking_for_playmates);
    console.log('  - Mate:', prefs?.looking_for_mate);
    console.log('  - Walking Buddies:', prefs?.looking_for_walking_buddies);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkPrefs();
