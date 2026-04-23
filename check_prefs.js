const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://dzhtpnskezkrtfinntbi.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHRwbnNrZXprcnRmaW5udGJpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAxOTI2NSwiZXhwIjoyMDg5NTk1MjY1fQ.5TzTVxKWI6EZ0K0fmDt6xQqPEGfC2yRZP8FcEz4XJrE";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkAndSetPreferences() {
  try {
    console.log("Looking up user ojasvy43@gmail.com...");
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
      console.error("Error fetching users:", userError);
      return;
    }

    const user = users.users.find(u => u.email === "ojasvy43@gmail.com");
    if (!user) {
      console.log("User ojasvy43@gmail.com not found");
      return;
    }

    console.log(`Found user: ${user.email} (${user.id})`);

    // Get pet profile
    console.log("\nFetching pet profile...");
    const { data: petProfiles, error: petError } = await supabase
      .from("pet_profiles")
      .select("id, user_id, breed, city_normalized")
      .eq("user_id", user.id);

    if (petError) {
      console.error("Error fetching pet profile:", petError);
      return;
    }

    if (!petProfiles || petProfiles.length === 0) {
      console.log("No pet profile found for this user");
      return;
    }

    const petProfile = petProfiles[0];
    console.log(`Pet Profile ID: ${petProfile.id}`);
    console.log(`Breed: ${petProfile.breed}`);
    console.log(`City: ${petProfile.city_normalized}`);

    // Check existing preferences
    console.log("\nChecking matching preferences...");
    const { data: preferences, error: prefError } = await supabase
      .from("matching_preferences")
      .select("*")
      .eq("pet_profile_id", petProfile.id);

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
      return;
    }

    if (preferences && preferences.length > 0) {
      const pref = preferences[0];
      console.log("Current preferences:");
      console.log(`  accept_any_city: ${pref.accept_any_city}`);
      console.log(`  accept_any_breed: ${pref.accept_any_breed}`);
      console.log(`  preferred_breeds: ${JSON.stringify(pref.preferred_breeds)}`);

      console.log("\nUpdating preferences for same breed and same city...");
      const { data: updated, error: updateError } = await supabase
        .from("matching_preferences")
        .update({
          accept_any_city: false,
          accept_any_breed: false,
          preferred_breeds: [petProfile.breed],
          updated_at: new Date().toISOString(),
        })
        .eq("pet_profile_id", petProfile.id)
        .select();

      if (updateError) {
        console.error("Error updating preferences:", updateError);
        return;
      }

      console.log("✅ Preferences updated successfully!");
      console.log("New preferences:", updated[0]);
    } else {
      console.log("No existing preferences. Creating new ones...");
      const { data: created, error: createError } = await supabase
        .from("matching_preferences")
        .insert({
          pet_profile_id: petProfile.id,
          accept_any_city: false,
          accept_any_breed: false,
          preferred_breeds: [petProfile.breed],
        })
        .select();

      if (createError) {
        console.error("Error creating preferences:", createError);
        return;
      }

      console.log("✅ Preferences created successfully!");
      console.log("Created preferences:", created[0]);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

checkAndSetPreferences();
