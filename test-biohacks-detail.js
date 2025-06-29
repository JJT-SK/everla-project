const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://zgiszibrpcfnixelehrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaXN6aWJycGNmbml4ZWxlaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODUwODUsImV4cCI6MjA2NDk2MTA4NX0.F2evbjpDNEfZxOvFSlFWnMRH2R-pa8XKC-Wx21UkbVo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBiohacksDetail() {
  console.log('🔍 Detailed Biohacks Analysis...\n');

  try {
    // Get all biohacks
    const { data: biohacks, error } = await supabase
      .from('biohacks')
      .select('*');

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    console.log(`📊 Found ${biohacks?.length || 0} biohacks\n`);

    if (biohacks && biohacks.length > 0) {
      console.log('📋 All biohacks:');
      biohacks.forEach((hack, index) => {
        console.log(`\n${index + 1}. ${hack.name}`);
        console.log(`   ID: ${hack.id}`);
        console.log(`   Category: ${hack.category || 'N/A'}`);
        console.log(`   Description: ${hack.description || 'N/A'}`);
        console.log(`   Efficacy Score: ${hack.efficacy_score || 'N/A'}`);
        console.log(`   Difficulty Score: ${hack.difficulty_score || 'N/A'}`);
        console.log(`   Time Investment Score: ${hack.time_investment_score || 'N/A'}`);
        console.log(`   Cost Score: ${hack.cost_score || 'N/A'}`);
        console.log(`   Image URL: ${hack.image_url || 'N/A'}`);
        console.log(`   All fields:`, Object.keys(hack));
      });

      // Check for missing required fields
      const requiredFields = ['id', 'name', 'description', 'category', 'efficacy_score', 'difficulty_score', 'time_investment_score', 'cost_score', 'image_url'];
      
      console.log('\n🔍 Field Analysis:');
      requiredFields.forEach(field => {
        const hasField = biohacks.every(hack => hack[field] !== undefined && hack[field] !== null);
        console.log(`   ${field}: ${hasField ? '✅' : '❌'} (${biohacks.filter(hack => hack[field] !== undefined && hack[field] !== null).length}/${biohacks.length} records)`);
      });

      // Check categories
      const categories = [...new Set(biohacks.map(hack => hack.category).filter(Boolean))];
      console.log(`\n📂 Categories found: ${categories.join(', ')}`);

    } else {
      console.log('❌ No biohacks found in the table');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBiohacksDetail(); 