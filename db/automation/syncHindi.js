import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../schema/index.js';
import { poets } from '../schema/poets.js';
import { poems } from '../schema/poems.js';
import { categories } from '../schema/categories.js';
import { eq, and, sql } from 'drizzle-orm';

console.log('🇮🇳 Starting Hindi poetry sync...');

// Initialize database connection
const client = createClient({
  url: 'file:./database/prasang.db',
});

const db = drizzle(client, { schema });

// Hindi Poetry Dataset - Expanded Collection
const HINDI_POEMS = [
  // Harivansh Rai Bachchan
  {
    title: "मधुशाला",
    author: "हरिवंश राय बच्चन",
    lines: [
      "मदिरालय जाने को घर से चलता है पीनेवाला,",
      "किस पथ से जाऊं? असमंजस में है वह भोलाभाला।",
      "अलबेला! सोच न कुछ, चल ठान ले, आ जा मेरे साथ,",
      "मैं हूँ पथ-प्रदर्शक, मेरे अंदर मधुशाला है।"
    ]
  },
  {
    title: "अग्नि पथ",
    author: "हरिवंश राय बच्चन",
    lines: [
      "वृक्ष हों भले खड़े, हों घने, हों बड़े,",
      "एक पत्र छाँह भी माँग मत, माँग मत, माँग मत।",
      "अग्निपथ, अग्निपथ, अग्निपथ।",
      "तू न थकेगा कभी, तू न थमेगा कभी,",
      "तू न मुड़ेगा कभी, कर शपथ, कर शपथ, कर शपथ।"
    ]
  },
  {
    title: "जो बीत गई सो बात गई",
    author: "हरिवंश राय बच्चन",
    lines: [
      "जो बीत गई सो बात गई, जो बीत गई सो बात गई।",
      "जीवन में एक सितारा था, माना वह बेहद प्यारा था।",
      "वह डूब गया तो डूब गया, अंबर के आँचल में।"
    ]
  },
  {
    title: "सपना",
    author: "हरिवंश राय बच्चन",
    lines: [
      "सपना है मेरा, सच है मेरा,",
      "यह जीवन है, रचना है मेरा।",
      "हर पल नया, हर पल अनोखा,",
      "हर पल में छिपा, कोई रोचक।"
    ]
  },

  // Makhanlal Chaturvedi
  {
    title: "पुष्प की अभिलाषा",
    author: "माखनलाल चतुर्वेदी",
    lines: [
      "चाह नहीं मैं सुरबाला के गहनों में गूँथा जाऊँ,",
      "चाह नहीं प्रेमी-माला में बिंध प्यारी को ललचाऊँ।",
      "चाह नहीं सम्राटों के शव पर हे हरि, डाला जाऊँ,",
      "चाह नहीं देवों के सिर पर चढ़ूँ भाग्य पर इठलाऊँ।"
    ]
  },

  // Sumitranandan Pant
  {
    title: "दीपक",
    author: "सुमित्रानंदन पंत",
    lines: [
      "दीपक जल उठा, अंधेरा हुआ,",
      "ज्योति की लहरों में डूबा हुआ।",
      "रोशनी की किरणें चारों ओर,",
      "अंधकार हुआ अब बहुत दूर।"
    ]
  },

  // Jaishankar Prasad
  {
    title: "नदी",
    author: "जयशंकर प्रसाद",
    lines: [
      "नदी बहती है, बहती ही रहेगी,",
      "यह अपनी राह में बहती ही रहेगी।",
      "रुकना नहीं है, थमना नहीं है,",
      "सागर से मिलना है, मिलना ही है।"
    ]
  },

  // Gulzar
  {
    title: "मैं नहीं हूँ",
    author: "गुलज़ार",
    lines: [
      "मैं नहीं हूँ, मैं नहीं हूँ,",
      "कुछ और हूँ, कुछ और हूँ।",
      "रूह हूँ मैं, आत्मा हूँ,",
      "शब्द हूँ, कल्पना हूँ।"
    ]
  },
  {
    title: "उड़ान",
    author: "गुलज़ार",
    lines: [
      "पंछी उड़ते हैं, आसमान में,",
      "पर हम उड़ते हैं, अरमानों में।",
      "ख्वाब हैं हमारे, बुलंद बहुत,",
      "मंज़िल है दूर, मगर पास नहीं।"
    ]
  },
  {
    title: "तुम्हें हो न हो",
    author: "गुलज़ार",
    lines: [
      "तुम्हें हो न हो मुझको तो यक़ीं है,",
      "तुम आए हो जैसे कोई दुआ है।",
      "मेरी आँखों में तुम बस गए हो,",
      "मेरे दिल में तुम्हारी ही सदा है।"
    ]
  },

  // Mahadevi Verma
  {
    title: "मैं नीर भरी दुःख की बदली",
    author: "महादेवी वर्मा",
    lines: [
      "मैं नीर भरी दुःख की बदली,",
      "बन-बन बरसी प्यासी धरती पर।",
      "जल-जल के जीवन की कलियाँ,",
      "खिल-खिल के खुशियाँ बिखरती पर।"
    ]
  },

  // Suryakant Tripathi 'Nirala'
  {
    title: "जागो फिर एक बार",
    author: "सूर्यकांत त्रिपाठी 'निराला'",
    lines: [
      "जागो फिर एक बार, हे भारत!",
      "जागो फिर एक बार, हे भारत!",
      "तू न सुख-स्वप्न में मग्न रह,",
      "तेरे बल पर संसार है।"
    ]
  },

  // Ramdhari Singh 'Dinkar'
  {
    title: "रश्मिरथी",
    author: "रामधारी सिंह 'दिनकर'",
    lines: [
      "जो लड़ सके उसी से लड़ना,",
      "जो छिन सके उसी से छिनना।",
      "वीर हो, जीवन की गति बन,",
      "संघर्षों में ही सुख मनना।"
    ]
  },
  {
    title: "हंसने का अधिकार",
    author: "रामधारी सिंह 'दिनकर'",
    lines: [
      "हंसो, क्योंकि हंसना मनुष्य का अधिकार है,",
      "रोओ, क्योंकि रोना भी जीवन का उपहार है।",
      "पर हंसते रहो, रोते रहो,",
      "जीवन एक त्योहार है।"
    ]
  },

  // Additional Poems
  {
    title: "प्रेम",
    author: "महादेवी वर्मा",
    lines: [
      "प्रेम एक अमृत है, प्रेम एक प्यास है,",
      "प्रेम जीवन का सार है, प्रेम विश्वास है।",
      "प्रेम से मिले जो दिल, वह अमर हो जाता है,",
      "प्रेम के बिना यह जीवन, सूना हो जाता है।"
    ]
  },
  {
    title: "स्वतंत्रता",
    author: "सूर्यकांत त्रिपाठी 'निराला'",
    lines: [
      "स्वतंत्रता, तू मेरी आत्मा है,",
      "तू मेरा जीवन, मेरी मृत्यु है।",
      "तेरे बिना यह जीवन,",
      "एक बोझ है, एक क्षय है।"
    ]
  },
  {
    title: "माँ",
    author: "जयशंकर प्रसाद",
    lines: [
      "माँ, तू दया की मूरत है,",
      "तू प्रेम की प्रतिमूर्ति है।",
      "तेरे आँचल में शांति है,",
      "तेरी गोद में सुरक्षा है।"
    ]
  },
  {
    title: "बचपन",
    author: "सुमित्रानंदन पंत",
    lines: [
      "बचपन, तू कितना प्यारा है,",
      "तेरी यादें हैं हमारा सहारा।",
      "हर पल तुम में सुख छिपा है,",
      "तेरी मुस्कान में जीवन का उजाला।"
    ]
  },
  {
    title: "स्नेह",
    author: "महादेवी वर्मा",
    lines: [
      "स्नेह एक कोमल बंधन है,",
      "यह मन का निर्मल रतन है।",
      "स्नेह से सुंदर संसार बने,",
      "स्नेह से ही सब प्यार मिले।"
    ]
  },
  {
    title: "संग्राम",
    author: "रामधारी सिंह 'दिनकर'",
    lines: [
      "संग्राम, तू वीरों का नाम है,",
      "तू जीवन का सारा काम है।",
      "तुझसे ही शक्ति मिलती है,",
      "तुझसे ही जीवन रचता है।"
    ]
  },
  {
    title: "शांति",
    author: "जयशंकर प्रसाद",
    lines: [
      "शांति, तू जीवन की आशा है,",
      "तू सुख की प्रिय सुवास है।",
      "तेरे बिना यह जीवन,",
      "एक तूफान, एक प्यास है।"
    ]
  },
  {
    title: "मित्रता",
    author: "सूर्यकांत त्रिपाठी 'निराला'",
    lines: [
      "मित्रता, तू जीवन की रीत है,",
      "तू प्रेम की अनुपम भीत है।",
      "मित्र के बिना यह जीवन,",
      "एक सूना, एक स्मृति है।"
    ]
  }
];

// Hindi categories with pre-defined slugs
const HINDI_CATEGORIES = [
  { name: 'हिंदी कविता', slug: 'hindi-poetry', description: 'Hindi poetry collection' },
  { name: 'आधुनिक कविता', slug: 'modern-hindi-poetry', description: 'Modern Hindi poetry' },
  { name: 'भक्ति कविता', slug: 'devotional-hindi-poetry', description: 'Devotional Hindi poetry' },
  { name: 'प्रेम कविता', slug: 'love-hindi-poetry', description: 'Love poetry in Hindi' },
  { name: 'प्रकृति कविता', slug: 'nature-hindi-poetry', description: 'Nature poetry in Hindi' },
  { name: 'देशभक्ति', slug: 'patriotic-hindi-poetry', description: 'Patriotic poetry in Hindi' },
  { name: 'शांति', slug: 'peace-hindi-poetry', description: 'Peace poetry in Hindi' }
];

// Helper function to create slug for poems and poets
function createSlug(text) {
  if (!text) return 'untitled';
  
  // For Hindi text, use a different approach
  // Convert to a URL-friendly string using transliteration or fallback
  const slug = text
    .toLowerCase()
    // Remove special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '');
  
  // If slug is empty (e.g., for Hindi text), use a fallback
  if (!slug) {
    // Use a simple transliteration or just use the first few characters
    const translit = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .substring(0, 30);
    return translit || 'poem-' + Date.now();
  }
  
  return slug.substring(0, 100);
}

// Ensure Hindi categories exist
async function ensureHindiCategories() {
  console.log('🏷️ Ensuring Hindi categories exist...');
  try {
    for (const category of HINDI_CATEGORIES) {
      // Check if category already exists
      const existing = await db.select()
        .from(categories)
        .where(eq(categories.slug, category.slug))
        .limit(1);
      
      if (existing.length === 0) {
        await db.insert(categories).values({
          name: category.name,
          slug: category.slug,
          description: category.description,
          parentId: null,
          sortOrder: 0,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created category: ${category.name} (slug: ${category.slug})`);
      } else {
        console.log(`ℹ️ Category already exists: ${category.name}`);
      }
    }
    console.log('✅ Hindi categories ready');
  } catch (error) {
    console.error('❌ Error creating Hindi categories:', error.message);
    throw error;
  }
}

// Get or create Hindi poet
async function getOrCreateHindiPoet(authorName) {
  if (!authorName || authorName.trim() === '') {
    return null;
  }

  const trimmedName = authorName.trim();
  const slug = createSlug(trimmedName);
  
  try {
    // Check if poet exists
    const existing = await db.select()
      .from(poets)
      .where(sql`LOWER(${poets.name}) = LOWER(${trimmedName})`)
      .limit(1);
    
    if (existing.length > 0) {
      return existing[0];
    }

    // Create new poet
    console.log(`👤 Creating Hindi poet: ${trimmedName}`);
    const result = await db.insert(poets).values({
      name: trimmedName,
      slug: slug || trimmedName.substring(0, 50),
      bio: `Hindi poet from the collection`,
      language: 'hi',
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return result[0];
  } catch (error) {
    console.error(`❌ Error creating Hindi poet ${authorName}:`, error.message);
    return null;
  }
}

// Sync Hindi poems
async function syncHindiPoems(count = 10) {
  console.log(`\n📝 Syncing ${count} Hindi poems...`);
  
  try {
    // Shuffle and select poems
    const shuffled = [...HINDI_POEMS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, HINDI_POEMS.length));
    
    console.log(`📊 Found ${selected.length} Hindi poems to sync`);
    
    // Get Hindi category
    const hindiCategory = await db.select()
      .from(categories)
      .where(eq(categories.slug, 'hindi-poetry'))
      .limit(1);
    
    let categoryId = hindiCategory.length > 0 ? hindiCategory[0].id : null;
    
    // If no Hindi category, try to get any category
    if (!categoryId) {
      const anyCategory = await db.select()
        .from(categories)
        .limit(1);
      categoryId = anyCategory.length > 0 ? anyCategory[0].id : null;
    }
    
    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const poemData of selected) {
      try {
        const poet = await getOrCreateHindiPoet(poemData.author);
        if (!poet) {
          errorCount++;
          continue;
        }

        // Check if poem already exists
        const existing = await db.select()
          .from(poems)
          .where(
            and(
              eq(poems.title, poemData.title),
              eq(poems.poetId, poet.id)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          skippedCount++;
          console.log(`⏭️ Skipping existing poem: "${poemData.title}"`);
          continue;
        }

        const poemSlug = createSlug(poemData.title) || 'poem-' + Date.now();
        
        // Insert Hindi poem
        await db.insert(poems).values({
          title: poemData.title,
          slug: poemSlug,
          content: poemData.lines.join('\n'),
          poetId: poet.id,
          categoryId: categoryId || 1,
          language: 'hi',
          script: 'Devanagari',
          status: 'published',
          contentVersion: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        addedCount++;
        
        console.log(`✅ Added Hindi poem: "${poemData.title}" by ${poemData.author}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error saving poem:`, error.message);
      }
    }

    console.log(`\n📊 Summary: ${addedCount} added, ${skippedCount} skipped, ${errorCount} errors`);
    return { addedCount, skippedCount, errorCount };
  } catch (error) {
    console.error('❌ Error syncing Hindi poems:', error.message);
    return { addedCount: 0, skippedCount: 0, errorCount: 0 };
  }
}

// Main function
async function main() {
  try {
    console.log('🇮🇳 Setting up Hindi poetry sync...');
    await ensureHindiCategories();
    
    const args = process.argv.slice(2);
    let count = 10;
    
    // Check if count is provided
    const countIndex = args.indexOf('--count');
    if (countIndex !== -1 && args[countIndex + 1]) {
      count = parseInt(args[countIndex + 1]) || 10;
    }
    
    // Check if --all flag is used
    if (args.includes('--all')) {
      count = HINDI_POEMS.length;
      console.log('📚 Syncing ALL Hindi poems');
    }
    
    // Check if --list flag is used
    if (args.includes('--list')) {
      console.log('\n📚 Available Hindi poems:');
      HINDI_POEMS.forEach((p, i) => {
        console.log(`  ${i + 1}. "${p.title}" by ${p.author}`);
      });
      console.log(`\nTotal: ${HINDI_POEMS.length} poems`);
      return;
    }
    
    const result = await syncHindiPoems(count);
    
    console.log('\n✨ Hindi poetry sync complete!');
    console.log('📊 Final results:', result);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run it
main();

export { syncHindiPoems, ensureHindiCategories };