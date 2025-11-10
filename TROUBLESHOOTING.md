# Troubleshooting - 404 Errors on API Routes

## Problem
Getting 404 errors for `/api/system-status` and `/api/gpu-info`

## Solution Steps

### Step 1: Stop the Dev Server
The Prisma client needs to be regenerated, but it's locked while the server is running.

1. **Stop your Next.js dev server** (Ctrl+C in the terminal where it's running)

### Step 2: Regenerate Prisma Client
```bash
npx prisma generate
```

### Step 3: Verify Database Tables Exist
```bash
# Check if migration was applied
npx prisma migrate status

# If tables don't exist, run migration
npm run migrate:dev
```

### Step 4: Restart Dev Server
```bash
npm run dev
```

### Step 5: Sync Data from Python API
Once the server is running, you need to sync data:

**Option A: Use the Sync Button**
- Go to your dashboard
- Click the "Sync Data" button in the System Health section

**Option B: Call API Directly**
```bash
# In browser or Postman
GET http://localhost:3000/api/sync-camera-status
```

### Step 6: Verify Data is Stored
Check if data exists in database:
```bash
npx prisma studio
```
This opens a GUI to view your database tables.

---

## Quick Fix Script

Run these commands in order:

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Generate Prisma client
npx prisma generate

# 3. Check migration status
npx prisma migrate status

# 4. If needed, run migration
npm run migrate:dev

# 5. Start dev server
npm run dev

# 6. In another terminal or browser, sync data
curl http://localhost:3000/api/sync-camera-status
```

---

## Common Issues

### Issue 1: "Cannot read properties of undefined (reading 'findFirst')"
**Solution:** Prisma client not regenerated. Run `npx prisma generate`

### Issue 2: "Table doesn't exist"
**Solution:** Migration not run. Run `npm run migrate:dev`

### Issue 3: "404 Not Found" on API routes
**Solution:** 
- Restart dev server after generating Prisma client
- Check that files exist in `src/app/api/system-status/route.ts` and `src/app/api/gpu-info/route.ts`

### Issue 4: "No data showing"
**Solution:** 
- Data must be synced first using `/api/sync-camera-status`
- Check database has data using `npx prisma studio`

---

## Verification Checklist

- [ ] Dev server is stopped
- [ ] `npx prisma generate` completed successfully
- [ ] `npm run migrate:dev` completed successfully
- [ ] Dev server restarted
- [ ] `/api/sync-camera-status` called successfully
- [ ] Database has data in `SystemStatus` and `GPUInfo` tables
- [ ] `/api/system-status` returns data (not 404)
- [ ] `/api/gpu-info` returns data (not 404)

