import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sql } from 'drizzle-orm';
import * as schema from '../schema/index.js';
import fs from 'fs';
import path from 'path';

console.log('🔧 Testing database connection...');
console.log('📂 Current directory:', process.cwd());

// Check if database exists
const dbPath = path.join(process.cwd(), 'database', 'prasang.db');
console.log(`📂 Database path: ${dbPath}`);

if (fs.existsSync(dbPath)) {
  console.log('✅ Database file exists');
  const stats = fs.statSync(dbPath);
  console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
} else {
  console.log('❌ Database file does not exist!');
  console.log('💡 Please run migrations first: npx drizzle-kit migrate');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('🔄 Creating database client...');
    const client = createClient({
      url: `file:${dbPath}`,
    });
    
    console.log('🔄 Testing connection...');
    const result = await client.execute("SELECT 1 as test, datetime('now') as time");
    
    console.log('✅ Database connection successful!');
    console.log('📊 Test result:', result.rows);
    
    console.log('\n🔄 Testing Drizzle ORM...');
    const db = drizzle(client, { schema });
    
    // Test query using the client directly (not db.execute)
    console.log('📊 Listing tables...');
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📊 Tables in database:', tables.rows);
    
    console.log('\n✅ All tests passed!');
    
    // Show table counts
    console.log('\n📊 Table Statistics:');
    for (const table of tables.rows) {
      const count = await client.execute(`SELECT COUNT(*) as count FROM ${table.name}`);
      console.log(`  📋 ${table.name}: ${count.rows[0].count} rows`);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('📋 Error details:', error);
  }
}

testConnection();