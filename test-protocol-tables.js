const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - using the actual project credentials
const supabaseUrl = 'https://zgiszibrpcfnixelehrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaXN6aWJycGNmbml4ZWxlaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODUwODUsImV4cCI6MjA2NDk2MTA4NX0.F2evbjpDNEfZxOvFSlFWnMRH2R-pa8XKC-Wx21UkbVo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProtocolTables() {
  console.log('🧪 Testing Protocol Tables...\n');

  try {
    // Test biohacks table
    console.log('1. Testing biohacks table...');
    const { data: biohacks, error: biohacksError } = await supabase
      .from('biohacks')
      .select('*')
      .limit(5);

    if (biohacksError) {
      console.log('❌ Error accessing biohacks table:', biohacksError.message);
    } else {
      console.log(`✅ biohacks table accessible. Found ${biohacks?.length || 0} records`);
      if (biohacks && biohacks.length > 0) {
        console.log('   Sample biohack:', {
          id: biohacks[0].id,
          name: biohacks[0].name,
          category: biohacks[0].category,
          efficacy_score: biohacks[0].efficacy_score
        });
      }
    }

    // Test hack_favourited table
    console.log('\n2. Testing hack_favourited table...');
    const { data: favourites, error: favouritesError } = await supabase
      .from('hack_favourited')
      .select('*')
      .limit(5);

    if (favouritesError) {
      console.log('❌ Error accessing hack_favourited table:', favouritesError.message);
    } else {
      console.log(`✅ hack_favourited table accessible. Found ${favourites?.length || 0} records`);
    }

    // Test protocols table
    console.log('\n3. Testing protocols table...');
    const { data: protocols, error: protocolsError } = await supabase
      .from('protocols')
      .select('*')
      .limit(5);

    if (protocolsError) {
      console.log('❌ Error accessing protocols table:', protocolsError.message);
    } else {
      console.log(`✅ protocols table accessible. Found ${protocols?.length || 0} records`);
    }

    // Test protocol_hacks table
    console.log('\n4. Testing protocol_hacks table...');
    const { data: protocolHacks, error: protocolHacksError } = await supabase
      .from('protocol_hacks')
      .select('*')
      .limit(5);

    if (protocolHacksError) {
      console.log('❌ Error accessing protocol_hacks table:', protocolHacksError.message);
    } else {
      console.log(`✅ protocol_hacks table accessible. Found ${protocolHacks?.length || 0} records`);
    }

    // Test table structure
    console.log('\n5. Testing table structure...');
    
    // Check biohacks columns
    if (biohacks && biohacks.length > 0) {
      const sampleHack = biohacks[0];
      const requiredFields = ['id', 'name', 'description', 'category', 'efficacy_score', 'difficulty_score', 'time_investment_score', 'cost_score', 'image_url'];
      const missingFields = requiredFields.filter(field => !(field in sampleHack));
      
      if (missingFields.length > 0) {
        console.log(`⚠️  Missing fields in biohacks table: ${missingFields.join(', ')}`);
      } else {
        console.log('✅ biohacks table has all required fields');
      }
    }

    console.log('\n🎉 Protocol tables test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testProtocolTables(); 