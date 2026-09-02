import { eq, and, sql } from 'drizzle-orm';
import { db, client } from './fetchPoetry.js';
import { poets } from '../schema/poets.js';
import { poems } from '../schema/poems.js';
import { categories } from '../schema/categories.js';
import { fetchPoemsByAuthor, fetchRandomPoems } from './fetchPoetry.js';

console.log('🚀 Starting poetry sync...');

const DEFAULT_CATEGORIES = {
  'Love': 'Poems about love and romance',
  'Nature': 'Poems about nature and the environment',
  'Life': 'Poems about life and existence',
  'Spiritual': 'Poems about spirituality and faith',
  'Philosophical': 'Poems about philosophy and wisdom',
  'Inspirational': 'Poems that inspire and motivate',
  'Sadness': 'Poems about sadness and grief',
  'Happiness': 'Poems about joy and happiness',
  'Friendship': 'Poems about friendship and companionship',
  'Family': 'Poems about family and relationships',
};

// Helper function to create slug
function createSlug(text) {
  if (!text) return 'untitled';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

// Ensure categories exist
async function ensureCategories() {
  console.log('🏷️ Ensuring categories exist...');
  try {
    for (const [name, description] of Object.entries(DEFAULT_CATEGORIES)) {
      const slug = createSlug(name);
      
      const existing = await db.select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1);
      
      if (existing.length === 0) {
        await db.insert(categories).values({
          name: name,
          slug: slug,
          description: description,
          parentId: null,
          sortOrder: 0,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created category: ${name}`);
      }
    }
    console.log('✅ Categories ready');
  } catch (error) {
    console.error('❌ Error in ensureCategories:', error.message);
    throw error;
  }
}

// Get or create poet
async function getOrCreatePoet(authorName) {
  if (!authorName || authorName.trim() === '') {
    return null;
  }

  const trimmedName = authorName.trim();
  const slug = createSlug(trimmedName);
  
  try {
    // Check if poet exists (case-insensitive)
    const existing = await db.select()
      .from(poets)
      .where(sql`LOWER(${poets.name}) = LOWER(${trimmedName})`)
      .limit(1);
    
    if (existing.length > 0) {
      return existing[0];
    }

    // Create new poet with camelCase property names
    console.log(`👤 Creating poet: ${trimmedName}`);
    const result = await db.insert(poets).values({
      name: trimmedName,
      slug: slug,
      bio: `Poet from the PoetryDB collection`,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return result[0];
  } catch (error) {
    console.error(`❌ Error creating poet ${authorName}:`, error.message);
    return null;
  }
}

// Sync poems from a specific author
async function syncAuthor(authorName) {
  console.log(`\n📖 Syncing poems for ${authorName}...`);
  
  try {
    const poetData = await getOrCreatePoet(authorName);
    if (!poetData) {
      console.log(`❌ Failed to create/retrieve poet: ${authorName}`);
      return { addedCount: 0, skippedCount: 0, errorCount: 0 };
    }

    console.log(`📥 Fetching poems from API for ${authorName}...`);
    const poemsData = await fetchPoemsByAuthor(authorName);
    console.log(`📊 Found ${poemsData.length} poems for ${authorName}`);
    
    if (poemsData.length === 0) {
      console.log(`⚠️ No poems found for ${authorName}`);
      return { addedCount: 0, skippedCount: 0, errorCount: 0 };
    }
    
    // Get the Love category ID
    const loveCategory = await db.select()
      .from(categories)
      .where(eq(categories.name, 'Love'))
      .limit(1);
    
    const categoryId = loveCategory.length > 0 ? loveCategory[0].id : null;
    
    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < poemsData.length; i++) {
      const poemData = poemsData[i];
      
      try {
        // Check if poem already exists - using camelCase property names
        const existing = await db.select()
          .from(poems)
          .where(
            and(
              eq(poems.title, poemData.title),
              eq(poems.poetId, poetData.id)  // camelCase: poetId
            )
          )
          .limit(1);

        if (existing.length > 0) {
          skippedCount++;
          continue;
        }

        // Generate slug from title
        const poemSlug = createSlug(poemData.title) || 'untitled-' + Date.now();
        
        // Insert poem with camelCase property names
        await db.insert(poems).values({
          title: poemData.title || 'Untitled',
          slug: poemSlug,
          content: poemData.lines ? poemData.lines.join('\n') : '',
          poetId: poetData.id,  // camelCase: poetId
          categoryId: categoryId || 1,  // camelCase: categoryId
          language: 'en',
          status: 'draft',
          contentVersion: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        addedCount++;
        
        if (addedCount % 5 === 0) {
          console.log(`📝 Added ${addedCount} poems for ${authorName}...`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error saving poem "${poemData.title}":`, error.message);
      }
    }

    console.log(`✅ Synced ${addedCount} poems for ${authorName} (${skippedCount} skipped, ${errorCount} errors)`);
    return { addedCount, skippedCount, errorCount };
  } catch (error) {
    console.error(`❌ Error syncing ${authorName}:`, error.message);
    return { addedCount: 0, skippedCount: 0, errorCount: 0, error: error.message };
  }
}

// Sync random poems
async function syncRandomPoems(count = 10) {
  console.log(`\n🎲 Syncing ${count} random poems...`);
  
  try {
    const randomPoems = await fetchRandomPoems(count);
    console.log(`📊 Found ${randomPoems.length} random poems`);
    
    const loveCategory = await db.select()
      .from(categories)
      .where(eq(categories.name, 'Love'))
      .limit(1);
    const categoryId = loveCategory.length > 0 ? loveCategory[0].id : 1;
    
    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const poemData of randomPoems) {
      try {
        const poet = await getOrCreatePoet(poemData.author);
        if (!poet) {
          errorCount++;
          continue;
        }

        // Check if poem exists
        const existing = await db.select()
          .from(poems)
          .where(
            and(
              eq(poems.title, poemData.title),
              eq(poems.poetId, poet.id)  // camelCase: poetId
            )
          )
          .limit(1);

        if (existing.length > 0) {
          skippedCount++;
          continue;
        }

        const poemSlug = createSlug(poemData.title) || 'untitled-' + Date.now();
        
        // Insert poem with camelCase property names
        await db.insert(poems).values({
          title: poemData.title || 'Untitled',
          slug: poemSlug,
          content: poemData.lines ? poemData.lines.join('\n') : '',
          poetId: poet.id,  // camelCase: poetId
          categoryId: categoryId,  // camelCase: categoryId
          language: 'en',
          status: 'draft',
          contentVersion: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        addedCount++;
      } catch (error) {
        errorCount++;
        console.error(`❌ Error saving poem:`, error.message);
      }
    }

    console.log(`✅ Added ${addedCount} random poems (${skippedCount} skipped, ${errorCount} errors)`);
    return { addedCount, skippedCount, errorCount };
  } catch (error) {
    console.error('❌ Error syncing random poems:', error.message);
    return { addedCount: 0, skippedCount: 0, errorCount: 0, error: error.message };
  }
}

// Sync popular authors
async function syncPopularAuthors() {
  const popularAuthors = [
    'William Shakespeare',
    'Emily Dickinson',
    'Robert Frost',
    'Maya Angelou',
    'Pablo Neruda',
    'Oscar Wilde',
    'Edgar Allan Poe',
    'Walt Whitman',
    'Langston Hughes',
    'Sylvia Plath',
    'John Keats',
    'Percy Bysshe Shelley',
    'William Wordsworth',
    'John Donne',
    'Dante Gabriel Rossetti',
    'Christina Rossetti',
    'Alfred Lord Tennyson',
    'Robert Browning',
    'Elizabeth Barrett Browning',
    'Matthew Arnold',
    'George Gordon, Lord Byron',
    'Isaac Watts'
  ];

  console.log(`\n🌟 Syncing ${popularAuthors.length} popular authors...`);
  let totalAdded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const author of popularAuthors) {
    const result = await syncAuthor(author);
    if (result) {
      totalAdded += result.addedCount || 0;
      totalSkipped += result.skippedCount || 0;
      totalErrors += result.errorCount || 0;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n📊 Total: ${totalAdded} new poems, ${totalSkipped} skipped, ${totalErrors} errors`);
  return { totalAdded, totalSkipped, totalErrors };
}

// Get database statistics
async function getStats() {
  console.log('\n📊 Database Statistics:');
  
  try {
    const poetCount = await db.select({ count: sql`COUNT(*)` }).from(poets);
    const poemCount = await db.select({ count: sql`COUNT(*)` }).from(poems);
    const categoryCount = await db.select({ count: sql`COUNT(*)` }).from(categories);
    
    console.log(`👤 Poets: ${poetCount[0].count}`);
    console.log(`📝 Poems: ${poemCount[0].count}`);
    console.log(`🏷️ Categories: ${categoryCount[0].count}`);
    
    return {
      poets: poetCount[0].count,
      poems: poemCount[0].count,
      categories: categoryCount[0].count
    };
  } catch (error) {
    console.error('❌ Error getting stats:', error.message);
    return null;
  }
}

// Clear all data
async function clearAllData() {
  console.log('\n⚠️ Clearing all data...');
  try {
    await db.delete(poems);
    await db.delete(poets);
    await db.delete(categories);
    console.log('✅ All data cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    return false;
  }
}

// MAIN EXECUTION
async function main() {
  try {
    console.log('📝 Checking database connection...');
    await ensureCategories();
    
    const args = process.argv.slice(2);
    console.log('📋 Arguments:', args);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
Usage: node syncPoetry.js [options]

Options:
  --random [count]    Sync random poems (default: 10)
  --author [name]     Sync poems by specific author
  --popular           Sync popular authors (default)
  --stats            Show database statistics
  --clear            Clear all data before syncing
  --help, -h         Show this help message

Examples:
  node syncPoetry.js --random 20
  node syncPoetry.js --author "William Shakespeare"
  node syncPoetry.js --popular
  node syncPoetry.js --stats
      `);
      return;
    }
    
    if (args.includes('--stats')) {
      await getStats();
      return;
    }
    
    if (args.includes('--clear')) {
      await clearAllData();
      console.log('🔄 Data cleared, proceeding with sync...');
    }
    
    let result;
    
    if (args.includes('--random')) {
      const index = args.indexOf('--random');
      const count = index + 1 < args.length ? parseInt(args[index + 1]) || 10 : 10;
      console.log(`🎲 Random mode: ${count} poems`);
      result = await syncRandomPoems(count);
    } else if (args.includes('--author')) {
      const index = args.indexOf('--author');
      const author = index + 1 < args.length ? args[index + 1] : null;
      if (!author) {
        console.log('❌ Please provide an author name');
        console.log('Example: node syncPoetry.js --author "William Shakespeare"');
        process.exit(1);
      }
      console.log(`👤 Author mode: ${author}`);
      result = await syncAuthor(author);
    } else {
      console.log('🌟 Popular authors mode (default)');
      result = await syncPopularAuthors();
    }
    
    console.log('\n✨ Sync complete!');
    console.log('📊 Final results:', result);
    
    await getStats();
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Just run it
main();

// Export functions
export { 
  syncAuthor, 
  syncPopularAuthors, 
  syncRandomPoems, 
  main,
  ensureCategories,
  getStats,
  clearAllData
};