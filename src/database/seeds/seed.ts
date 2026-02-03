import 'reflect-metadata';
import { seedRoles } from './role.seed';
import { dataSource } from '../data-source';

async function seed() {
  await dataSource.initialize();
  console.log('✅ Database connected');

  await seedRoles();

  console.log('🎉 Seed completed');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed', err);
  process.exit(1);
});
