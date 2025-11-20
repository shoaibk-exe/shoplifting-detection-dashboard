"use client";
import React, { useState } from 'react';

const SyncButton: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      
    
      setLastSync(new Date());
     
      window.dispatchEvent(new CustomEvent('systemDataSynced'));
    } catch (err: any) {
      setError(err.message || 'Error refreshing data');
      console.error('Refresh error:', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {lastSync && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last refreshed: {lastSync.toLocaleTimeString()}
        </div>
      )}
      <button
        onClick={handleSync}
        disabled={syncing}
        className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors flex items-center gap-2 ${
          syncing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {syncing ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Refreshing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </>
        )}
      </button>
    </div>
  );
};

export default SyncButton;

