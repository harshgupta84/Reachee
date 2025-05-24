import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  console.log('Setting up database...');
  
  try {    
    // Push the schema to the database
    console.log('Pushing Prisma schema to database...');
    await execAsync('npx prisma db push --accept-data-loss');
    console.log('Schema pushed successfully!');
    
    // Generate the Prisma client
    console.log('Generating Prisma client...');
    await execAsync('npx prisma generate');
    console.log('Prisma client generated successfully!');
    
    console.log('Database setup completed successfully!');
    console.log('Note: The analytics page will generate mock data dynamically based on actual influencer profiles.');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

main(); 