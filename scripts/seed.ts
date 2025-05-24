import { seedDatabase } from '../lib/seed-db';

async function main() {
  console.log('Starting database seed script...');
  
  await seedDatabase();
  
  console.log('Database seed completed successfully!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
}); 