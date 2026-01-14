# Camera Config Integration - System Architecture

## 📋 Overview

This document explains how the camera configuration data flows from the Python API (`http://localhost:5555/api/debug/camera_config`) to your Next.js dashboard.

---

## 🔑 API Key Status

**IMPORTANT:** Currently, **NO API KEY is being used** for the Python backend API endpoint.

- The sync route fetches from `http://localhost:5555/api/debug/camera_config` **without authentication**
- If your Python API requires an API key, you need to add it to the sync route

### Where API Keys ARE Used:
- **Database API Keys** (`ApiKey` model): Used for Next.js API authentication (stored in database)
- **Algolia API Key**: Used for search functionality (`NEXT_PUBLIC_ALGOLIA_API_KEY`)
- **OpenAI API Key**: Used for content generation (`OPENAI_API_KEY`)
- **Mailchimp API Key**: Used for newsletter (`MAILCHIMP_API_KEY`)

### Where API Keys ARE NOT Used:
- ❌ Python Backend API (`localhost:5555`) - **No authentication currently**

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Python Backend API                                         │
│  http://localhost:5555/api/debug/camera_config              │
│  (No API Key Required Currently)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP GET Request
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js API Route                                          │
│  /api/sync-camera-status                                    │
│  File: src/app/api/sync-camera-status/route.ts              │
│  - Fetches data from Python API                             │
│  - Stores in MySQL Database                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Prisma ORM
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  MySQL Database                                              │
│  Tables:                                                    │
│  - SystemStatus (summary data)                              │
│  - GPUInfo (GPU metrics)                                    │
│  - Camera (camera details)                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Prisma Queries
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js API Routes (Read)                                  │
│  - /api/system-status                                       │
│  - /api/gpu-info                                            │
│  - /api/cameras                                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP GET Requests
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  React Components (Frontend)                                │
│  - SystemHealth.tsx                                         │
│  - CameraStats.tsx                                          │
│  - CameraGrid.tsx                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure - Camera Config Integration

### 1. **API Routes (Backend - Server Side)**

#### A. Sync Route (Fetches from Python API)
**File:** `src/app/api/sync-camera-status/route.ts`
- **Purpose:** Fetches data from Python API and stores in database
- **Endpoint:** `GET /api/sync-camera-status`
- **Python API URL:** `http://localhost:5555/api/debug/camera_config`
- **What it does:**
  - Fetches camera config from Python backend
  - Updates/Creates cameras in `Camera` table
  - Stores `SystemStatus` in database
  - Stores `GPUInfo` in database
- **No API Key:** Currently makes unauthenticated requests

#### B. System Status API (Reads from Database)
**File:** `src/app/api/system-status/route.ts`
- **Purpose:** Returns latest system status from database
- **Endpoint:** `GET /api/system-status`
- **Data Source:** `SystemStatus` table in MySQL
- **Returns:** Latest system health summary

#### C. GPU Info API (Reads from Database)
**File:** `src/app/api/gpu-info/route.ts`
- **Purpose:** Returns latest GPU information from database
- **Endpoint:** `GET /api/gpu-info`
- **Data Source:** `GPUInfo` table in MySQL
- **Returns:** Latest GPU metrics

#### D. Cameras API (Reads from Database)
**File:** `src/app/api/cameras/route.ts`
- **Purpose:** Returns all cameras from database
- **Endpoint:** `GET /api/cameras`
- **Data Source:** `Camera` table in MySQL
- **Returns:** List of all cameras

#### E. Alerts API (Reads from Database)
**File:** `src/app/api/alerts/route.ts`
- **Purpose:** Returns alerts from database
- **Endpoint:** `GET /api/alerts`
- **Data Source:** `Alert` table in MySQL
- **Note:** Alerts are stored in database, NOT fetched from Python API

---

### 2. **React Components (Frontend - Client Side)**

#### A. System Health Component
**File:** `src/components/Dashboard/SystemHealth.tsx`
- **Purpose:** Displays system health and GPU info
- **Fetches from:**
  - `/api/system-status` - System health data
  - `/api/gpu-info` - GPU metrics
- **Features:**
  - Auto-refreshes every 30 seconds
  - Shows overall health status (CRITICAL/DEGRADED/HEALTHY)
  - Displays GPU utilization and memory status
  - Includes sync button

#### B. Sync Button Component
**File:** `src/components/Dashboard/SyncButton.tsx`
- **Purpose:** Manual trigger to sync data from Python API
- **Action:** Calls `/api/sync-camera-status`
- **Triggers:** `systemDataSynced` event to refresh components

#### C. Camera Stats Component
**File:** `src/components/Dashboard/CameraStats.tsx`
- **Purpose:** Displays camera statistics
- **Fetches from:**
  - `/api/system-status` - For live/offline counts
  - `/api/cameras` - For camera locations
- **Features:**
  - Shows total cameras, online/offline counts
  - Displays system uptime percentage
  - Lists camera locations

#### D. Camera Grid Component
**File:** `src/components/Dashboard/CameraGrid.tsx`
- **Purpose:** Displays live camera feeds grid
- **Fetches from:**
  - `/api/cameras` - Camera list
- **Features:**
  - Shows camera streams
  - Auto-refreshes every 30 seconds
  - Tracks stream status

#### E. Dashboard Component
**File:** `src/components/Dashboard/Dashboard.tsx`
- **Purpose:** Main dashboard layout
- **Includes:**
  - SystemHealth component
  - CameraGrid component
  - CameraStats component
  - AlertsChart component

---

### 3. **Database Models**

**File:** `prisma/schema.prisma`

#### SystemStatus Model
```prisma
model SystemStatus {
  id                Int      @id @default(autoincrement())
  totalCameras      Int
  liveCamerasCount  Int
  degradedCount    Int
  offlineCount     Int
  overallHealth     String
  statusSummary     String
  timestamp         DateTime @default(now())
}
```

#### GPUInfo Model
```prisma
model GPUInfo {
  id                Int      @id @default(autoincrement())
  utilizationPercent Float
  memoryStatus      String
  allocatedGB       Float
  reservedGB        Float
  available         Boolean
  createdAt         DateTime @default(now())
}
```

---

## 🔧 How to Add API Key Authentication

If your Python API requires an API key, modify the sync route:

**File:** `src/app/api/sync-camera-status/route.ts`

```typescript
const PYTHON_BACKEND_URL = 'http://localhost:5555/api/debug/camera_config'
const PYTHON_API_KEY = process.env.PYTHON_API_KEY || '' // Add to .env

export async function GET() {
    try {
        const res = await fetch(PYTHON_BACKEND_URL, {
            headers: {
                'Authorization': `Bearer ${PYTHON_API_KEY}`,
                // OR
                // 'X-API-Key': PYTHON_API_KEY,
            }
        })
        // ... rest of code
    }
}
```

Then add to your `.env` file:
```
PYTHON_API_KEY=your_api_key_here
```

---

## 📊 Data Mapping

### Python API Response → Database

| Python API Field | Database Table | Database Field |
|----------------|----------------|----------------|
| `summary.total_cameras` | SystemStatus | totalCameras |
| `summary.live_cameras_count` | SystemStatus | liveCamerasCount |
| `summary.degraded_cameras_count` | SystemStatus | degradedCount |
| `summary.offline_cameras_count` | SystemStatus | offlineCount |
| `summary.overall_health` | SystemStatus | overallHealth |
| `summary.status_summary` | SystemStatus | statusSummary |
| `gpu_info.utilization_percent` | GPUInfo | utilizationPercent |
| `gpu_info.memory_status` | GPUInfo | memoryStatus |
| `gpu_info.allocated_gb` | GPUInfo | allocatedGB |
| `gpu_info.reserved_gb` | GPUInfo | reservedGB |
| `gpu_info.available` | GPUInfo | available |
| `cameras[].camera_name` | Camera | cameraModel, cameraLocation |
| `cameras[].status` | Camera | cameraStatus |
| `cameras[].rtsp_url` | Camera | cameraIp |

---

## 🚀 Usage Flow

1. **Initial Sync:**
   - User clicks "Sync Data" button in SystemHealth component
   - OR call `GET /api/sync-camera-status` directly
   - Data is fetched from Python API and stored in database

2. **Display Data:**
   - Components automatically fetch from Next.js API routes
   - Data is read from MySQL database (not directly from Python API)
   - Auto-refresh every 30 seconds

3. **Manual Refresh:**
   - Click "Sync Data" button to fetch latest from Python API
   - All components automatically refresh via event system

---

## ⚠️ Important Notes

1. **No Direct Python API Calls from Frontend:**
   - Frontend components NEVER call Python API directly
   - All data comes through Next.js API routes
   - This provides better security and caching

2. **Database is Source of Truth:**
   - Dashboard displays data from MySQL database
   - Python API is only called during sync operations
   - Sync must be triggered manually or via cron job

3. **Alerts are Database-Only:**
   - Alerts are stored in database via `POST /api/alerts`
   - NOT fetched from Python API
   - If you need alerts from Python API, create a new sync route

---

## 🔍 Quick Reference - All Files

### Backend (API Routes)
- `src/app/api/sync-camera-status/route.ts` - Syncs from Python API
- `src/app/api/system-status/route.ts` - Returns system status
- `src/app/api/gpu-info/route.ts` - Returns GPU info
- `src/app/api/cameras/route.ts` - Returns cameras
- `src/app/api/alerts/route.ts` - Returns alerts (DB only)

### Frontend (Components)
- `src/components/Dashboard/SystemHealth.tsx` - System health display
- `src/components/Dashboard/SyncButton.tsx` - Sync trigger button
- `src/components/Dashboard/CameraStats.tsx` - Camera statistics
- `src/components/Dashboard/CameraGrid.tsx` - Camera grid display
- `src/components/Dashboard/Dashboard.tsx` - Main dashboard layout

### Database
- `prisma/schema.prisma` - Database schema
- `prisma/migrations/` - Migration files

### Configuration
- `.env` - Environment variables (create if needed for API keys)

---

## 🎯 Summary

**Current State:**
- ✅ Python API integration working
- ✅ Data syncing to database
- ✅ Dashboard displaying data
- ❌ **NO API KEY authentication for Python API**

**To Add API Key:**
1. Add `PYTHON_API_KEY` to `.env`
2. Modify `src/app/api/sync-camera-status/route.ts`
3. Add Authorization header to fetch request

