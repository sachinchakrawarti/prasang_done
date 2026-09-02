import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../schema/index.js';
import { poets } from '../schema/poets.js';
import { poems } from '../schema/poems.js';
import { categories } from '../schema/categories.js';
import { eq, and, sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const client = createClient({
  url: 'file:./db/database/prasang.db',
});
const db = drizzle(client, { schema });

async function importCSV(filePath) {
  console.log(`📂 Reading CSV: ${filePath}`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`📊 Found ${records.length} records`);
  let added = 0;
  let skipped = 0;

  // Get or create category
  const defaultCategory = await db.select()
    .from(categories)
    .where(eq(categories.name, 'General'))
    .limit(1);
  
  let categoryId = defaultCategory[0]?.id || null;
  
  if (!categoryId) {
    const newCat = await db.insert(categories).values({
      name: 'General',
      description: 'General poetry collection',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    categoryId = newCat[0].id;
  }

  for (const record of records) {
    const poetName = record.author || record.poet || 'Unknown';
    
    // Get or create poet
    let poet = await db.select()
      .from(poets)
      .where(sql`LOWER(${poets.name}) = LOWER(${poetName})`)
      .limit(1);
    
    let poetId;
    if (poet.length > 0) {
      poetId = poet[0].id;
    } else {
      const newPoet = await db.insert(poets).values({
        name: poetName,
        slug: poetName.toLowerCase().replace(/\s+/g, '-'),
        bio: record.bio || `Imported from CSV`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      poetId = newPoet[0].id;
    }

    // Check if poem exists
    const existing = await db.select()
      .from(poems)
      .where(
        and(
          eq(poems.title, record.title),
          eq(poems.poetId, poetId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    // Insert poem
    await db.insert(poems).values({
      title: record.title,
      content: record.content || record.poem || '',
      poetId: poetId,
      categoryId: record.categoryId || categoryId,
      publishedAt: record.publishedAt ? new Date(record.publishedAt) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    added++;
  }

  console.log(`✅ Imported ${added} poems (${skipped} skipped)`);
  return { added, skipped };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('❌ Please provide CSV file path: node importCSV.js data.csv');
    process.exit(1);
  }
  importCSV(filePath).catch(console.error);
}