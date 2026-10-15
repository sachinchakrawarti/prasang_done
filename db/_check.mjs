import { createClient } from '@libsql/client';
const db = createClient({ url: 'file:./database/prasang.db' });

const r = await db.execute(`
  SELECT target_language, status, model,
         LENGTH(translation) AS chars,
         SUBSTR(translation, 1, 50) AS preview
  FROM ai_translations
  WHERE poem_id = 93
  ORDER BY target_language
`);
console.table(r.rows);

const s = await db.execute(`
  SELECT status, COUNT(*) AS n FROM ai_translations GROUP BY status
`);
console.log('By status:');
console.table(s.rows);

const p = await db.execute(`
  SELECT model, COUNT(*) AS n FROM ai_translations GROUP BY model
`);
console.log('By provider:');
console.table(p.rows);