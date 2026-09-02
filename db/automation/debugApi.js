import { fetchPoemsByAuthor, fetchRandomPoems } from './fetchPoetry.js';

async function debugAPI() {
  console.log('🔍 Debugging API responses...\n');
  
  // Test 1: Check random poems
  console.log('📝 Test 1: Fetching 5 random poems');
  const randomPoems = await fetchRandomPoems(5);
  console.log(`✅ Received ${randomPoems.length} random poems`);
  if (randomPoems.length > 0) {
    console.log('📄 First random poem:', JSON.stringify(randomPoems[0], null, 2));
  }
  console.log('---\n');
  
  // Test 2: Check specific author
  const author = 'Emily Dickinson';
  console.log(`📝 Test 2: Fetching poems for ${author}`);
  const poems = await fetchPoemsByAuthor(author);
  console.log(`✅ Received ${poems.length} poems for ${author}`);
  if (poems.length > 0) {
    console.log('📄 First poem:', JSON.stringify(poems[0], null, 2));
  }
  console.log('---\n');
  
  // Test 3: Check another author
  const author2 = 'William Shakespeare';
  console.log(`📝 Test 3: Fetching poems for ${author2}`);
  const poems2 = await fetchPoemsByAuthor(author2);
  console.log(`✅ Received ${poems2.length} poems for ${author2}`);
  if (poems2.length > 0) {
    console.log('📄 First poem:', JSON.stringify(poems2[0], null, 2));
  }
  console.log('---\n');
  
  // Test 4: Check poem structure
  if (randomPoems.length > 0) {
    console.log('📝 Test 4: Checking poem structure');
    const poem = randomPoems[0];
    console.log('Keys:', Object.keys(poem));
    console.log('Title:', poem.title || 'No title');
    console.log('Author:', poem.author || 'No author');
    console.log('Lines count:', poem.lines ? poem.lines.length : 0);
    console.log('Lines sample:', poem.lines ? poem.lines.slice(0, 3) : 'No lines');
  }
}

debugAPI().catch(console.error);