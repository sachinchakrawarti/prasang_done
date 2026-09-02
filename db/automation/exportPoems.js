import { db } from './fetchPoetry.js';
import { poets } from '../schema/poets.js';
import { poems } from '../schema/poems.js';
import { categories } from '../schema/categories.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function exportPoems() {
  console.log('📤 Exporting poems from database...\n');
  
  // Get all poems with poet and category info
  const allPoems = await db.select({
    id: poems.id,
    title: poems.title,
    slug: poems.slug,
    content: poems.content,
    poetId: poems.poetId,
    poetName: poets.name,
    categoryId: poems.categoryId,
    categoryName: categories.name,
    language: poems.language,
    status: poems.status,
    createdAt: poems.createdAt,
    updatedAt: poems.updatedAt
  })
  .from(poems)
  .leftJoin(poets, eq(poems.poetId, poets.id))
  .leftJoin(categories, eq(poems.categoryId, categories.id));
  
  console.log(`📊 Found ${allPoems.length} poems`);
  
  // Export to JSON
  const exportPath = path.join(process.cwd(), 'db/backups/poems_export.json');
  const dir = path.dirname(exportPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(exportPath, JSON.stringify(allPoems, null, 2));
  console.log(`✅ Exported to: ${exportPath}`);
  
  // Also export as CSV format
  const csvPath = path.join(process.cwd(), 'db/backups/poems_export.csv');
  let csv = 'ID,Title,Poet,Category,Language,Status\n';
  allPoems.forEach(p => {
    const title = p.title.replace(/,/g, ';');
    csv += `${p.id},"${title}","${p.poetName || ''}","${p.categoryName || ''}",${p.language},${p.status}\n`;
  });
  fs.writeFileSync(csvPath, csv);
  console.log(`✅ CSV exported to: ${csvPath}`);
  
  return allPoems;
}

exportPoems().catch(console.error);