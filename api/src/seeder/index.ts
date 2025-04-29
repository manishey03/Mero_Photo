import { createAdminUser } from './user'; // Import seeder functions from different files

async function runSeeders() {
  try {
    console.log('Starting seeders...');

    // FOR ADMIN:
    await createAdminUser();

    console.log('Seeders completed successfully');
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
}

//
runSeeders();
