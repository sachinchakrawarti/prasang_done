// db/_cleanup.mjs
import { createClient } from '@libsql/client';
const db = createClient({ url: 'file:./database/prasang.db' });

const before = await db.execute("SELECT COUNT(*) AS n FROM ai_translations WHERE model = 'test-model'");
console.log('rows to delete:', before.rows[0].n);

await db.execute("DELETE FROM ai_translations WHERE model = 'test-model'");

const after = await db.execute("SELECT COUNT(*) AS n FROM ai_translations");
console.log('total rows now:', after.rows[0].n);