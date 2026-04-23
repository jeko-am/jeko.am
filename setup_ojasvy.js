const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dzhtpnskezkrtfinntbi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHRwbnNrZXprcnRmaW5udGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0NTI1MzcsImV4cCI6MjAyNTA2MjUzN30.M7nExGMa4PxLN7m7zVNBBHKL5k70yBqGgFdNJTGQu-Y'
);

async function setupUser() {
  try {
    // Try both email variants
    let userEmail = 'ojasvy43@gmail.com';
    let { data: user } = await supabase.rpc('get_user_by_email', { email: userEmail });
    
    if (!user) {
      userEmail = 'ojasvy34@gmail.com';
      ({ data: user } = await supabase.rpc('get_user_by_email', { email: userEmail }));
    }

    if (!user) {
      console.log('User not found, searching differently...');
      // Get all users and find one with ojasvy email
      const { data: allUsers } = await supabase
        .from('user_profiles')
        .select('user_id, email')
        .order('created_at', { ascending: false })
        .limit(20);
      
      console.log('Recent users:', allUsers?.map(u => u.email));
      return;
    }

    console.log('Found user:', userEmail);
    const userId = user.user_id || user.id;

    // Get their pet profile
    const { data: pet, error: petError } = await supabase
      .from('pet_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (petError) {
      console.error('No pet found:', petError.message);
      return;
    }

    console.log(`Pet: ${pet.pet_name} | City: ${pet.city} | Breed: ${pet.breed}`);

    // Update or create matching preferences
    const { data: existing } = await supabase
      .from('matching_preferences')
      .select('id')
      .eq('pet_profile_id', pet.id)
      .single();

    const prefData = {
      user_id: userId,
      pet_profile_id: pet.id,
      accept_any_city: false,
      preferred_cities: [pet.city],
      preferred_breeds: [pet.breed],
      looking_for_playmates: true,
      looking_for_mate: true,
      looking_for_walking_buddies: true,
      preferred_genders: [],
      preferred_age_min: 0,
      preferred_age_max: 20,
      preferred_weight_min: 0,
      preferred_weight_max: 100,
      exclude_already_seen: true,
      exclude_already_liked: false,
      exclude_already_disliked: true,
    };

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('matching_preferences')
        .update(prefData)
        .eq('id', existing.id)
        .select();
      result = { data, error };
    } else {
      const { data, error } = await supabase
        .from('matching_preferences')
        .insert(prefData)
        .select();
      result = { data, error };
    }

    if (result.error) {
      console.error('Error updating preferences:', result.error.message);
      return;
    }

    console.log('\n✅ Preferences set:');
    console.log('  accept_any_city: false');
    console.log('  preferred_cities: [' + pet.city + ']');
    console.log('  preferred_breeds: [' + pet.breed + ']');
    console.log('  looking_for_mate: true');
    console.log('  looking_for_playmates: true');
    console.log('  looking_for_walking_buddies: true');
    console.log('\n📍 Filtering logic: Will ONLY show dogs from ' + pet.city + ' with breed ' + pet.breed);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

setupUser();
