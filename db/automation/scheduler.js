import { main } from './syncPoetry.js';

async function scheduledSync() {
  console.log(`\n⏰ Running scheduled sync at ${new Date().toISOString()}`);
  try {
    await main();
    console.log(`✅ Scheduled sync completed at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`❌ Scheduled sync failed at ${new Date().toISOString()}:`, error);
  }
}

// Run every day at midnight
const ONE_DAY = 24 * 60 * 60 * 1000;

// Run immediately on start
scheduledSync();

// Set up interval
setInterval(scheduledSync, ONE_DAY);

console.log('🔄 Scheduler started. Will sync every 24 hours.');