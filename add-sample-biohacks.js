const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://zgiszibrpcfnixelehrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaXN6aWJycGNmbml4ZWxlaHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODUwODUsImV4cCI6MjA2NDk2MTA4NX0.F2evbjpDNEfZxOvFSlFWnMRH2R-pa8XKC-Wx21UkbVo';

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleBiohacks = [
  {
    name: 'Cold Showers',
    description: 'Daily cold water exposure to improve circulation and boost metabolism.',
    category: 'Lifestyle',
    efficacy_score: 4,
    difficulty_score: 3,
    time_investment_score: 1,
    cost_score: 1,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    name: 'Intermittent Fasting',
    description: 'Time-restricted eating to optimize metabolism and cellular repair.',
    category: 'Nutrition',
    efficacy_score: 5,
    difficulty_score: 4,
    time_investment_score: 2,
    cost_score: 1,
    image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop'
  },
  {
    name: 'Blue Light Blocking',
    description: 'Wearing blue light blocking glasses to improve sleep quality.',
    category: 'Sleep',
    efficacy_score: 3,
    difficulty_score: 1,
    time_investment_score: 1,
    cost_score: 2,
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  },
  {
    name: 'Sauna Therapy',
    description: 'Regular sauna sessions for detoxification and cardiovascular health.',
    category: 'Lifestyle',
    efficacy_score: 4,
    difficulty_score: 2,
    time_investment_score: 3,
    cost_score: 3,
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop'
  },
  {
    name: 'Nootropics',
    description: 'Cognitive enhancers to improve focus, memory, and mental performance.',
    category: 'Supplements',
    efficacy_score: 4,
    difficulty_score: 2,
    time_investment_score: 1,
    cost_score: 4,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop'
  },
  {
    name: 'Red Light Therapy',
    description: 'Exposure to red and near-infrared light for cellular repair and recovery.',
    category: 'Technology',
    efficacy_score: 3,
    difficulty_score: 1,
    time_investment_score: 2,
    cost_score: 4,
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
  },
  {
    name: 'Meditation',
    description: 'Daily mindfulness practice for stress reduction and mental clarity.',
    category: 'Mindfulness',
    efficacy_score: 5,
    difficulty_score: 3,
    time_investment_score: 2,
    cost_score: 1,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    name: 'High-Intensity Training',
    description: 'Short, intense workouts for maximum metabolic impact.',
    category: 'Exercise',
    efficacy_score: 5,
    difficulty_score: 5,
    time_investment_score: 2,
    cost_score: 1,
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  },
  {
    name: 'Sleep Tracking',
    description: 'Monitor sleep patterns to optimize rest and recovery.',
    category: 'Technology',
    efficacy_score: 3,
    difficulty_score: 1,
    time_investment_score: 1,
    cost_score: 3,
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
  },
  {
    name: 'Probiotics',
    description: 'Beneficial bacteria supplements for gut health and immunity.',
    category: 'Supplements',
    efficacy_score: 4,
    difficulty_score: 1,
    time_investment_score: 1,
    cost_score: 3,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop'
  },
  {
    name: 'Breathwork',
    description: 'Controlled breathing techniques for stress management and energy.',
    category: 'Mindfulness',
    efficacy_score: 4,
    difficulty_score: 2,
    time_investment_score: 1,
    cost_score: 1,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    name: 'Vitamin D3',
    description: 'Essential vitamin for immune function and bone health.',
    category: 'Supplements',
    efficacy_score: 4,
    difficulty_score: 1,
    time_investment_score: 1,
    cost_score: 1,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop'
  }
];

async function addSampleBiohacks() {
  console.log('📝 Adding sample biohacks...\n');

  try {
    for (const biohack of sampleBiohacks) {
      const { data, error } = await supabase
        .from('biohacks')
        .insert(biohack);

      if (error) {
        console.log(`❌ Error adding ${biohack.name}:`, error.message);
      } else {
        console.log(`✅ Added: ${biohack.name}`);
      }
    }

    console.log('\n🎉 Sample biohacks added successfully!');
    
    // Verify the count
    const { data: count, error: countError } = await supabase
      .from('biohacks')
      .select('*', { count: 'exact' });

    if (!countError) {
      console.log(`📊 Total biohacks in database: ${count.length}`);
    }

  } catch (error) {
    console.error('❌ Failed to add sample biohacks:', error.message);
  }
}

// Run the script
addSampleBiohacks(); 