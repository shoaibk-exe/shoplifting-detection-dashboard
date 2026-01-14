# Database Setup and Migration Guide

## Overview
This guide explains how to set up the database, apply migrations, and seed initial data for the shoplifting detection dashboard.

## Quick Start

### 1. Apply Database Migrations

**Recommended Method (Using Prisma):**

This will apply all pending migrations automatically:

```bash
npm run migrate:prod
```

**Alternative Method (Manual SQL):**

If you prefer to run SQL manually, use the complete file path with `.sql` extension:

```bash
mysql -u root -p dashboard < prisma/migrations/20250115000000_fix_updated_at_columns/migration.sql
```

**Note:** Make sure you're in the project root directory when running this command.

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

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shoplifting-detection-dashboard
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env` (if exists)
   - Set `DATABASE_URL` in `.env` file:
     ```
     DATABASE_URL="mysql://root:your_password@localhost:3306/dashboard"
     ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Apply all migrations** (Recommended for Fresh Database)
   
   **If database is empty (no tables):**
   ```bash
   npx prisma migrate dev
   ```
   This will create all tables and apply all migrations automatically.
   
   **If database already has tables:**
   ```bash
   npm run migrate:prod
   ```
   
   **Or manually apply migrations:**
   ```bash
   # Apply initial migration
   mysql -u root -p dashboard < prisma/migrations/20251110120045_init/migration.sql
   
   # Apply fix migration
   mysql -u root -p dashboard < prisma/migrations/20250115000000_fix_updated_at_columns/migration.sql
   ```

5. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

6. **Seed the database**
   ```bash
   npm run db:seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

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

### Failed Migration Error (P3009)

If you see: `Error: P3009 - migrate found failed migrations in the target database`

This happens when a migration was started but failed, leaving the database in an inconsistent state.

**Solution 1: Reset Migration State (Recommended for Fresh Setup)**

Since you have no tables, the easiest solution is to reset the migration state:

```bash
# Connect to MySQL
mysql -u root -p dashboard

# Clear the failed migration state
DELETE FROM _prisma_migrations WHERE migration_name = '20250115000000_fix_updated_at_columns';

# Exit MySQL
exit;
```

Then apply all migrations from scratch:

```bash
# This will create all tables and apply all migrations
npx prisma migrate dev
```

**Solution 2: Use Prisma Migrate Dev (Easiest for Fresh Database)**

If you have no tables, use `migrate dev` which will:
- Create all tables from scratch
- Apply all migrations in order
- Handle the migration state automatically

```bash
npx prisma migrate dev
```

**Solution 3: Manual Reset (If Solutions 1 & 2 Don't Work)**

1. Clear all migration records:
```sql
mysql -u root -p dashboard
DELETE FROM _prisma_migrations;
exit;
```

2. Apply the initial migration manually:
```bash
mysql -u root -p dashboard < prisma/migrations/20251110120045_init/migration.sql
```

3. Then apply the fix migration:
```bash
mysql -u root -p dashboard < prisma/migrations/20250115000000_fix_updated_at_columns/migration.sql
```

4. Mark migrations as applied:
```bash
npx prisma migrate resolve --applied 20251110120045_init
npx prisma migrate resolve --applied 20250115000000_fix_updated_at_columns
```

### Migration Already Applied
If you see "Column already has default value", the migration was already applied. You can skip step 1.

### Prisma Client Generation Fails
- Make sure database is running
- Check `.env` file has correct `DATABASE_URL`
- Stop dev server before generating (files may be locked)

### Seed Fails - "Table does not exist"
- **Make sure migrations are applied first** - Run `npx prisma migrate dev` to create all tables
- Check database connection
- Verify tables exist: `mysql -u root -p dashboard -e "SHOW TABLES;"`
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

