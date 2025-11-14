# Database Migration Instructions

## Overview
This document explains how to apply database migrations and seed the database with initial data.

## Prerequisites
1. MySQL database running
2. Database connection configured in `.env` file
3. Node.js and npm installed

## Steps to Apply Migrations

### 1. Apply the Migration to Fix updatedAt Columns

Run the SQL migration file directly on your database:

```bash
mysql -u root -p dashboard < prisma/migrations/20250115000000_fix_updated_at_columns/migration.sql
```

Or manually execute the SQL in your MySQL client:

```sql
-- AlterTable
ALTER TABLE `user` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `role` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `alerts` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `anomaly_logs` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `videorecording` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Seed the Database

This will create:
- Super Admin role with all permissions
- Admin role with all permissions
- User role with read permissions
- Superuser account (admin@dashboard.com / Admin1234)

```bash
npm run db:seed
```

## For Fresh Setup on New PC

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure `.env` file with database connection
4. Run migrations: Apply the SQL migration file to your database
5. Generate Prisma client: `npm run prisma:generate`
6. Seed database: `npm run db:seed`

## Superuser Credentials

After seeding, you can login with:
- **Email:** admin@dashboard.com
- **Password:** Admin1234

⚠️ **Important:** Change the password after first login in production!

## Troubleshooting

### Migration Already Applied
If the migration has already been applied, you can skip step 1.

### Prisma Client Generation Fails
Make sure:
- Database is running
- `.env` file has correct `DATABASE_URL`
- You have write permissions in `node_modules`

### Seed Fails
Make sure:
- Database migrations are applied
- Roles table exists
- No duplicate entries (seed uses upsert, so it's safe to run multiple times)

