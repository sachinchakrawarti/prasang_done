// db/drizzle.config.js
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './schema/index.js',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './database/prasang.db',
  },
  verbose: true,
  strict: true,
});