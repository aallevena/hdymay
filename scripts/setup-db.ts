// Run this script to set up the database
// Usage: npx tsx scripts/setup-db.ts

import { createDayEntriesTable } from '../lib/db';

async function setup() {
  try {
    console.log('Setting up database...');
    await createDayEntriesTable();
    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setup();
