# Database Setup and Migration Guide

## Overview
This guide explains how to set up the database, apply migrations, and seed initial data for the shoplifting detection dashboard.

## Quick Start

### 1. Apply Database Migration

Run the SQL migration to fix `updatedAt` columns:

```bash
mysql -u root -p dashboard < prisma/migrations/20250115000000_fix_updated_at_columns/migration.sql
```

Or manually execute in MySQL:

```sql
ALTER TABLE `user` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
ALTER TABLE `role` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
ALTER TABLE `alerts` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
ALTER TABLE `anomaly_logs` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
ALTER TABLE `videorecording` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
```

### 2. Install Dependencies

```bash
npm install
```

This will install `tsx` needed for running the seed script.

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Seed the Database

This creates:
- **Super Admin role** with all permissions
- **Admin role** with all permissions  
- **User role** with read permissions
- **Superuser account**: admin@dashboard.com / Admin1234

```bash
npm run db:seed
```

## For Fresh Setup on New PC

1. Clone the repository
2. Copy `.env.example` to `.env` and configure database connection
3. Install dependencies: `npm install`
4. Apply migration: Run the SQL migration file
5. Generate Prisma client: `npm run prisma:generate`
6. Seed database: `npm run db:seed`
7. Start dev server: `npm run dev`

## Superuser Credentials

After seeding, login with:
- **Email:** admin@dashboard.com
- **Password:** Admin1234

⚠️ **IMPORTANT:** Change the password after first login in production!

## Available Scripts

- `npm run db:seed` - Seed the database with initial data
- `npm run db:reset` - Reset database and reseed (⚠️ deletes all data)
- `npm run prisma:generate` - Generate Prisma client
- `npm run migrate:dev` - Create new migration
- `npm run migrate:prod` - Apply migrations in production

## What Was Fixed

### Database Schema
- Added `DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)` to all `updatedAt` columns
- Prisma now automatically manages `updatedAt` timestamps

### API Routes
- ✅ Cleaned up `/api/users` - removed commented code, proper error handling
- ✅ Cleaned up `/api/roles` - removed commented code, validation added
- ✅ Fixed `/api/user/register` - works with proper schema
- ✅ Fixed `/api/user/update` - removed invalid fields
- ✅ All routes no longer manually set `updatedAt` (handled by Prisma)

### Code Quality
- Removed all commented code
- Added proper error handling
- Added validation for required fields
- Consistent error responses
- Professional code structure

## Troubleshooting

### Migration Already Applied
If you see "Column already has default value", the migration was already applied. You can skip step 1.

### Prisma Client Generation Fails
- Make sure database is running
- Check `.env` file has correct `DATABASE_URL`
- Stop dev server before generating (files may be locked)

### Seed Fails
- Make sure migrations are applied first
- Check database connection
- Seed uses `upsert`, so safe to run multiple times

### updatedAt Still Missing Error
- Make sure migration was applied
- Regenerate Prisma client: `npm run prisma:generate`
- Restart dev server

## Database Structure

### Roles
- **superadmin**: All permissions
- **admin**: All permissions
- **user**: Read permissions only

### Permissions
All available permissions:
- `Read_Roles`, `Add_Roles`, `Edit_Roles`, `Delete_Roles`
- `Read_Users`, `Add_Users`, `Edit_Users`, `Delete_Users`
- `Read_ManagedDevice`, `Add_ManagedDevice`, `Edit_ManagedDevice`, `Delete_ManagedDevice`

## Next Steps

1. Apply the migration
2. Run seed script
3. Login with superuser credentials
4. Change superuser password
5. Create additional users and roles as needed

For more details, see `prisma/MIGRATION_INSTRUCTIONS.md`

