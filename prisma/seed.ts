import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Get all permissions from constants
  const allPermissions = [
    // Roles permissions
    'Read_Roles',
    'Add_Roles',
    'Edit_Roles',
    'Delete_Roles',
    // Users permissions
    'Read_Users',
    'Add_Users',
    'Edit_Users',
    'Delete_Users',
    // ManagedDevice permissions
    'Read_ManagedDevice',
    'Add_ManagedDevice',
    'Edit_ManagedDevice',
    'Delete_ManagedDevice',
  ];

  // Create Super Admin role with all permissions
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {
      permissions: allPermissions,
      role: 'SUPERADMIN',
    },
    create: {
      name: 'superadmin',
      description: 'Super Admin with all permissions',
      permissions: allPermissions,
      role: 'SUPERADMIN',
    },
  });

  console.log('✅ Super Admin role created:', superAdminRole);

  // Create Admin role with all permissions (alternative to superadmin)
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {
      permissions: allPermissions,
      role: 'ADMIN',
    },
    create: {
      name: 'admin',
      description: 'Administrator with all permissions',
      permissions: allPermissions,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin role created:', adminRole);

  // Create default user role with read permissions only
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {
      permissions: ['Read_Users'],
      role: 'USER',
    },
    create: {
      name: 'user',
      description: 'Standard user with read permissions',
      permissions: ['Read_Users'],
      role: 'USER',
    },
  });

  console.log('✅ User role created:', userRole);

  // Create superuser with superadmin role
  const hashedPassword = await bcrypt.hash('Admin1234', 10);

  const superUser = await prisma.user.upsert({
    where: { email: 'admin@dashboard.com' },
    update: {
      name: 'Super Admin',
      password: hashedPassword,
      phoneNumber: '+1234567890',
      status: 'Active',
      roleId: superAdminRole.id,
    },
    create: {
      email: 'admin@dashboard.com',
      name: 'Super Admin',
      password: hashedPassword,
      phoneNumber: '+1234567890',
      status: 'Active',
      roleId: superAdminRole.id,
    },
  });

  console.log('✅ Superuser created:', {
    email: superUser.email,
    name: superUser.name,
    role: 'Super Admin',
  });

  console.log('🎉 Seed completed successfully!');
  console.log('📧 Superuser credentials:');
  console.log('   Email: admin@dashboard.com');
  console.log('   Password: Admin1234');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

