import { client } from './fetchPoetry.js';

async function checkExisting() {
  console.log('📊 Checking existing data...\n');
  
  // Check poets with their poem counts
  const poets = await client.execute(`
    SELECT p.id, p.name, COUNT(po.id) as poem_count 
    FROM poets p
    LEFT JOIN poems po ON po.poet_id = p.id
    GROUP BY p.id, p.name
    ORDER BY poem_count DESC
  `);
  
  console.log('👤 Poets and their poem counts:');
  for (const poet of poets.rows) {
    console.log(`  ${poet.name}: ${poet.poem_count} poems`);
  }
  
  // Check the 2 poems that exist
  const poems = await client.execute(`
    SELECT p.title, p.poet_id, po.name as poet_name 
    FROM poems p
    JOIN poets po ON po.id = p.poet_id
  `);
  
  console.log('\n📝 Existing poems:');
  for (const poem of poems.rows) {
    console.log(`  "${poem.title}" by ${poem.poet_name}`);
  }
}

checkExisting().catch(console.error);