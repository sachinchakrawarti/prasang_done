import { db, client } from './fetchPoetry.js';
import { poets } from '../schema/poets.js';
import { poems } from '../schema/poems.js';
import { categories } from '../schema/categories.js';
import { fetchRandomPoems } from './fetchPoetry.js';
import { eq, and, sql } from 'drizzle-orm';

async function debugInsert() {
  console.log('🔍 Debugging poem insertion...\n');
  
  // Get a random poem
  console.log('📥 Fetching a random poem...');
  const randomPoems = await fetchRandomPoems(1);
  
  if (randomPoems.length === 0) {
    console.log('❌ No poems fetched');
    return;
  }
  
  const poemData = randomPoems[0];
  console.log('📄 Poem data:', JSON.stringify(poemData, null, 2));
  console.log('---\n');
  
  // Check if poet exists
  const authorName = poemData.author || 'Unknown';
  console.log(`👤 Checking poet: ${authorName}`);
  
  const existingPoet = await db.select()
    .from(poets)
    .where(sql`LOWER(${poets.name}) = LOWER(${authorName})`)
    .limit(1);
  
  let poetId;
  if (existingPoet.length > 0) {
    poetId = existingPoet[0].id;
    console.log(`✅ Poet found: ${existingPoet[0].name} (ID: ${poetId})`);
  } else {
    console.log(`❌ Poet not found: ${authorName}`);
    return;
  }
  
  // Check if poem exists
  console.log(`\n🔍 Checking if poem already exists: "${poemData.title}"`);
  const existingPoem = await db.select()
    .from(poems)
    .where(
      and(
        eq(poems.title, poemData.title),
        eq(poems.poetId, poetId)
      )
    )
    .limit(1);
  
  if (existingPoem.length > 0) {
    console.log(`⚠️ Poem already exists: ${poemData.title}`);
    return;
  }
  
  // Try inserting with explicit values
  console.log('\n📝 Attempting to insert poem...');
  
  // Get category
  const category = await db.select()
    .from(categories)
    .where(eq(categories.name, 'Love'))
    .limit(1);
  const categoryId = category.length > 0 ? category[0].id : 1;
  
  const poemSlug = poemData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100) || 'untitled';
  
  console.log(`📝 Slug: ${poemSlug}`);
  console.log(`📝 Category ID: ${categoryId}`);
  console.log(`📝 Poet ID: ${poetId}`);
  console.log(`📝 Title: ${poemData.title}`);
  console.log(`📝 Content length: ${poemData.lines ? poemData.lines.join('\n').length : 0}`);
  
  try {
    // Check the poems table structure
    console.log('\n📊 Checking poems table structure...');
    const tableInfo = await client.execute("PRAGMA table_info(poems)");
    console.log('Table columns:', tableInfo.rows.map(r => r.name).join(', '));
    
    // Check what columns are required (NOT NULL)
    const requiredColumns = tableInfo.rows.filter(r => r.notnull === 1 && r.name !== 'id');
    console.log('Required columns:', requiredColumns.map(r => r.name).join(', '));
    
    // Try inserting with minimal required fields
    const insertData = {
      title: poemData.title || 'Untitled',
      slug: poemSlug || 'untitled-' + Date.now(),
      content: poemData.lines ? poemData.lines.join('\n') : '',
      poetId: poetId,
      categoryId: categoryId || 1,
    };
    
    console.log('\n📝 Insert data:', insertData);
    
    const result = await db.insert(poems).values(insertData);
    console.log('✅ Insert successful!');
    
    // Verify the poem was added
    const verify = await db.select()
      .from(poems)
      .where(
        and(
          eq(poems.title, poemData.title),
          eq(poems.poetId, poetId)
        )
      )
      .limit(1);
    
    if (verify.length > 0) {
      console.log(`✅ Poem verified: "${verify[0].title}" (ID: ${verify[0].id})`);
    }
  } catch (error) {
    console.error('❌ Insert failed:', error.message);
    console.error('📋 Error details:', error);
  }
}

debugInsert().catch(console.error);