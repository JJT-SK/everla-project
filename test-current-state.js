const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://zgiszibrpcfnixelehrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaXN6aWJycGNmbml4ZWxlaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODUwODUsImV4cCI6MjA2NDk2MTA4NX0.F2evbjpDNEfZxOvFSlFWnMRH2R-pa8XKC-Wx21UkbVo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentState() {
  console.log('=== CHECKING CURRENT TABLE STATE ===\n');
  
  try {
    // Check users table
    console.log('1. Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.error('❌ Error querying users table:', usersError);
    } else {
      console.log(`✅ Users table has ${users.length} rows:`);
      users.forEach(user => {
        console.log(`   - ID: ${user.id}, Email: ${user.email}, Username: ${user.username}`);
      });
    }
    
    console.log('\n2. Checking user_profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Error querying user_profiles table:', profilesError);
    } else {
      console.log(`✅ User_profiles table has ${profiles.length} rows:`);
      profiles.forEach(profile => {
        console.log(`   - User ID: ${profile.user_id}, Gender: ${profile.gender}, Country: ${profile.country}`);
      });
    }
    
    console.log('\n3. Checking Supabase Auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error querying auth users:', authError);
      console.log('Note: This requires service_role key, using anon key instead...');
      
      // Try to get current user instead
      const { data: currentUser, error: currentUserError } = await supabase.auth.getUser();
      if (currentUserError) {
        console.log('No authenticated user found');
      } else {
        console.log('Current authenticated user:', currentUser.user.email);
      }
    } else {
      console.log(`✅ Auth has ${authUsers.users.length} users:`);
      authUsers.users.forEach(user => {
        console.log(`   - ID: ${user.id}, Email: ${user.email}, Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkCurrentState(); 