# Auto-Refresh Configuration Guide

This document shows where automatic refresh intervals are configured in the dashboard components.

## 📍 Auto-Refresh Intervals Location

### 1. **CameraGrid Component**
**File:** `src/components/Dashboard/CameraGrid.tsx`
**Line:** ~21-25
**Current Interval:** 30000ms (30 seconds)
```typescript
const interval = setInterval(() => {
  fetchCameras();
}, 30000); // Change this number to modify interval
```

### 2. **SystemHealth Component**
**File:** `src/components/Dashboard/SystemHealth.tsx`
**Line:** ~34-36
**Current Interval:** 30000ms (30 seconds)
```typescript
const interval = setInterval(() => {
  fetchSystemHealth();
}, 30000); // Change this number to modify interval
```

### 3. **CameraStats Component**
**File:** `src/components/Dashboard/CameraStats.tsx`
**Line:** ~18-20
**Current Interval:** 30000ms (30 seconds)
```typescript
const interval = setInterval(() => {
  fetchCameraStats();
}, 30000); // Change this number to modify interval
```

### 4. **AlertsChart Component**
**File:** `src/components/Dashboard/AlertsChart.tsx`
**Line:** ~57-59
**Current Interval:** 300000ms (5 minutes)
```typescript
const interval = setInterval(() => {
  fetchCamerasAndAlerts();
}, 300000); // Change this number to modify interval
```

## 🔄 How to Change Auto-Refresh Intervals

1. **Open the component file** listed above
2. **Find the `setInterval` line** (usually in a `useEffect` hook)
3. **Change the number** (value is in milliseconds):
   - 1000 = 1 second
   - 5000 = 5 seconds
   - 30000 = 30 seconds
   - 60000 = 1 minute
   - 300000 = 5 minutes
   - 600000 = 10 minutes

## 📝 Example: Change CameraGrid to refresh every 10 seconds

```typescript
// In src/components/Dashboard/CameraGrid.tsx
const interval = setInterval(() => {
  fetchCameras();
}, 10000); // Changed from 30000 to 10000 (10 seconds)
```

## 🎯 Global Refresh Button

**File:** `src/components/Dashboard/Dashboard.tsx`
**Line:** ~10-25

The global "Refresh All" button at the top of the dashboard triggers a refresh for all components simultaneously using a custom event `dashboardRefresh`.

All components listen to this event and refresh their data when triggered.

## ⚙️ Current Configuration Summary

| Component | Interval | File Location |
|-----------|----------|---------------|
| CameraGrid | 30 seconds | `src/components/Dashboard/CameraGrid.tsx` |
| SystemHealth | 30 seconds | `src/components/Dashboard/SystemHealth.tsx` |
| CameraStats | 30 seconds | `src/components/Dashboard/CameraStats.tsx` |
| AlertsChart | 5 minutes | `src/components/Dashboard/AlertsChart.tsx` |

## 🔍 How It Works

1. Each component has its own `useEffect` hook that sets up an interval
2. The interval calls the component's fetch function at the specified interval
3. Components also listen for the `dashboardRefresh` event for manual refresh
4. When the component unmounts, the interval is cleared to prevent memory leaks

## 💡 Tips

- **Shorter intervals** = More frequent updates but higher server load
- **Longer intervals** = Less server load but data may be slightly stale
- **Recommended:** 30 seconds for real-time monitoring, 5 minutes for analytics
- All intervals are independent - you can set different values for each component

