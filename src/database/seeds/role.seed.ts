import 'reflect-metadata';
import { Role } from '../entities/role.entity';
import { dataSource } from '../data-source';

const ROLES = [
  {
    name: 'Admin',
    description: 'System administrator with full permissions',
  },
  {
    name: 'Developer',
    description: 'Developer who can create and fix bugs',
  },
  {
    name: 'Tester',
    description: 'Tester who verifies and reports bugs',
  },
];

export async function seedRoles() {
  const roleRepo = dataSource.getRepository(Role);

  for (const roleData of ROLES) {
    const exists = await roleRepo.findOne({
      where: { name: roleData.name },
    });

    if (!exists) {
      const role = roleRepo.create({
        name: roleData.name,
        description: roleData.description,
      });

      await roleRepo.save(role);
      console.log(`✅ Role "${roleData.name}" created`);
    } else {
      console.log(`ℹ️ Role "${roleData.name}" already exists`);
    }
  }
}
