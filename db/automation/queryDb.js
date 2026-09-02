import { db, client } from './fetchPoetry.js';
import { poets } from '../schema/poets.js';
import { poems } from '../schema/poems.js';
import { categories } from '../schema/categories.js';
import { eq, sql } from 'drizzle-orm';

async function queryDatabase() {
  console.log('📊 Querying your database...\n');
  
  // 1. Get all poets
  console.log('👤 All Poets:');
  const allPoets = await db.select().from(poets);
  console.log(`Total: ${allPoets.length}`);
  allPoets.slice(0, 10).forEach(p => {
    console.log(`  - ${p.name} (ID: ${p.id})`);
  });
  if (allPoets.length > 10) console.log(`  ... and ${allPoets.length - 10} more`);
  console.log('---\n');
  
  // 2. Get all poems with poet names
  console.log('📝 Poems with Poets:');
  const poemsWithPoets = await db.select({
    id: poems.id,
    title: poems.title,
    poetName: poets.name,
    language: poems.language,
    status: poems.status,
    createdAt: poems.createdAt
  })
  .from(poems)
  .leftJoin(poets, eq(poems.poetId, poets.id));
  
  console.log(`Total: ${poemsWithPoets.length}`);
  poemsWithPoets.forEach(p => {
    console.log(`  - "${p.title}" by ${p.poetName || 'Unknown'} (${p.language})`);
  });
  console.log('---\n');
  
  // 3. Get categories
  console.log('🏷️ Categories:');
  const allCategories = await db.select().from(categories);
  allCategories.forEach(c => {
    console.log(`  - ${c.name}: ${c.description || 'No description'}`);
  });
  console.log('---\n');
  
  // 4. Get poem count by poet
  console.log('📊 Poem Count by Poet:');
  const counts = await db.select({
    poetName: poets.name,
    count: sql`COUNT(${poems.id})`.as('count')
  })
  .from(poets)
  .leftJoin(poems, eq(poets.id, poems.poetId))
  .groupBy(poets.id, poets.name)
  .orderBy(sql`count DESC`);
  
  counts.forEach(c => {
    console.log(`  - ${c.poetName}: ${c.count} poems`);
  });
}

queryDatabase().catch(console.error);