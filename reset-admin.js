const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dzhtpnskezkrtfinntbi.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHRwbnNrZXprcnRmaW5udGJpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAxOTI2NSwiZXhwIjoyMDg5NTk1MjY1fQ.mQjRUdzO6Y6OhbrykkdWFXzwgw0Z8lpunWmPTI7bByA';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetAdminPassword() {
  try {
    console.log('Checking for existing admin user...');
    
    // First, let's see if admin@purepet.test exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }
    
    const existingAdmin = existingUsers.users.find(u => u.email === 'admin@purepet.test');
    
    if (existingAdmin) {
      console.log('Found existing admin user, updating password...');
      
      // Update the existing user's password
      const { data, error } = await supabase.auth.admin.updateUserById(
        existingAdmin.id,
        { password: 'admin123' }
      );
      
      if (error) {
        console.error('Error updating password:', error);
      } else {
        console.log('✅ Admin password updated successfully!');
        console.log('Email: admin@purepet.test');
        console.log('Password: admin123');
      }
    } else {
      console.log('Admin user not found, creating new one...');
      
      // Create new admin user
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin@purepet.test',
        password: 'admin123',
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          is_admin: true
        }
      });
      
      if (error) {
        console.error('Error creating admin user:', error);
      } else {
        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@purepet.test');
        console.log('Password: admin123');
        console.log('User ID:', data.user.id);
        
        // Add to admin_users table
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert({
            user_id: data.user.id,
            role: 'super_admin',
            is_active: true,
            created_at: new Date().toISOString()
          });
          
        if (adminError) {
          console.error('Error adding to admin_users table:', adminError);
        } else {
          console.log('✅ Added to admin_users table');
        }
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

resetAdminPassword();
