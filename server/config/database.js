import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

// --------------------------------------------------
// PATH
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server/config
//      ↓ ../../
// prasang_done/
//      ↓ db/database/
// prasang.db

const databasePath = path.resolve(
  __dirname,
  "../../db/database/prasang.db"
);

// --------------------------------------------------
// SQLITE
// --------------------------------------------------

const sqlite = new Database(databasePath);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

// --------------------------------------------------
// DRIZZLE
// --------------------------------------------------

export const db = drizzle(sqlite);

// Export SQLite instance if needed
export { sqlite };

// --------------------------------------------------
// CONNECTION INFO
// --------------------------------------------------

console.log("✅ SQLite database connected");
console.log(`📁 Database: ${databasePath}`);