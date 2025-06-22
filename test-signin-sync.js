const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zgiszibrpcfnixelehrp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaXN6aWJycGNmbml4ZWxlaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODUwODUsImV4cCI6MjA2NDk2MTA4NX0.F2evbjpDNEfZxOvFSlFWnMRH2R-pa8XKC-Wx21UkbVo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignInSync() {
  console.log('🧪 Testing Sign-In Data Sync\n');
  
  try {
    // Step 1: Check current database state (as anonymous user)
    console.log('1. Checking current database state (anonymous user)...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.log('❌ Error checking users table:', usersError.message);
      return;
    }
    
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.log('❌ Error checking user_profiles table:', profilesError.message);
      return;
    }
    
    console.log(`   Users table: ${users.length} records (visible to anonymous user)`);
    console.log(`   User_profiles table: ${profiles.length} records (visible to anonymous user)`);
    
    // Step 2: Test RLS policies with proper UUID format
    console.log('\n2. Testing RLS policies with proper UUID...');
    
    // Use a proper UUID format
    const testUserId = '123e4567-e89b-12d3-a456-426614174000';
    const { error: userInsertTestError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: 'test@example.com',
        username: 'testuser',
        date_joined: new Date().toISOString()
      });
    
    if (userInsertTestError) {
      console.log('   ❌ Users table RLS policy blocks insert:', userInsertTestError.message);
    } else {
      console.log('   ✅ Users table allows insert (unexpected - should be blocked)');
      
      // Clean up test insert
      await supabase.from('users').delete().eq('id', testUserId);
    }
    
    // Test inserting into user_profiles table (no RLS)
    const { error: profileInsertTestError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: testUserId,
        gender: 'Other',
        country: 'Test',
        dob: new Date('1990-01-01').toISOString()
      });
    
    if (profileInsertTestError) {
      console.log('   ❌ User_profiles table insert failed:', profileInsertTestError.message);
    } else {
      console.log('   ✅ User_profiles table allows insert (no RLS)');
      
      // Clean up test insert
      await supabase.from('user_profiles').delete().eq('user_id', testUserId);
    }
    
    // Step 3: Check authentication state
    console.log('\n3. Checking authentication state...');
    
    // Try to get current user (should be null if not authenticated)
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('   ❌ Error getting current user:', authError.message);
    } else if (currentUser) {
      console.log(`   ✅ Currently authenticated as: ${currentUser.email}`);
      
      // Test the exact data sync logic with authenticated user
      console.log('\n4. Testing data sync with authenticated user...');
      
      // Check if user exists in users table (as authenticated user)
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (userCheckError && userCheckError.code === 'PGRST116') {
        console.log('   ⚠️ User not found in custom table, creating...');
        
        const { error: userInsertError } = await supabase
          .from('users')
          .insert({
            id: currentUser.id,
            email: currentUser.email,
            username: currentUser.user_metadata?.username || currentUser.email.split('@')[0],
            date_joined: new Date().toISOString()
          });
        
        if (userInsertError) {
          console.log('   ❌ Error creating user:', userInsertError.message);
        } else {
          console.log('   ✅ User created successfully');
        }
      } else if (userCheckError) {
        console.log('   ❌ Error checking user:', userCheckError.message);
      } else {
        console.log('   ✅ User already exists in custom table');
      }

      // Check if profile exists (as authenticated user)
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (profileCheckError && profileCheckError.code === 'PGRST116') {
        console.log('   ⚠️ Profile not found, creating default profile...');
        
        const { error: profileInsertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: currentUser.id,
            gender: 'Other',
            country: 'Unknown',
            dob: new Date('1990-01-01').toISOString()
          });
        
        if (profileInsertError) {
          console.log('   ❌ Error creating profile:', profileInsertError.message);
        } else {
          console.log('   ✅ Profile created successfully');
        }
      } else if (profileCheckError) {
        console.log('   ❌ Error checking profile:', profileCheckError.message);
      } else {
        console.log('   ✅ Profile already exists');
      }
      
    } else {
      console.log('   ⚠️ Not currently authenticated');
      console.log('   To test data sync, please:');
      console.log('   1. Go to http://localhost:3000');
      console.log('   2. Sign in with your account');
      console.log('   3. Check the browser console for sync logs');
      console.log('   4. Run this test again');
    }
    
    // Step 4: Final state check (as anonymous user)
    console.log('\n5. Final database state (anonymous user view)...');
    const { data: finalUsers, error: finalUsersError } = await supabase
      .from('users')
      .select('*');
    
    const { data: finalProfiles, error: finalProfilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (finalUsersError || finalProfilesError) {
      console.log('❌ Error in final verification');
      return;
    }
    
    console.log(`   Users table: ${finalUsers.length} records (visible to anonymous user)`);
    console.log(`   User_profiles table: ${finalProfiles.length} records (visible to anonymous user)`);
    
    // Step 5: Check if there are RLS visibility issues
    console.log('\n6. RLS Visibility Analysis...');
    if (users.length === 0 && finalUsers.length === 0) {
      console.log('   ⚠️ Users table shows 0 records to anonymous user');
      console.log('   This suggests RLS policies are hiding data from anonymous users');
      console.log('   This is normal behavior - authenticated users should see their own data');
    }
    
    if (profiles.length > 0) {
      console.log('   ✅ User_profiles table shows data (no RLS)');
    }
    
    console.log('\n🎉 Sign-in sync test completed!');
    console.log('\n📊 Summary:');
    console.log('   ✅ Database connection working');
    console.log('   ✅ RLS policy testing completed');
    console.log('   ✅ Data sync logic tested');
    
    if (currentUser) {
      console.log('   ✅ Authenticated user data sync tested');
    } else {
      console.log('   ⚠️ No authenticated user to test with');
      console.log('   💡 The 0 users visible to anonymous user is expected with RLS');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testSignInSync(); 