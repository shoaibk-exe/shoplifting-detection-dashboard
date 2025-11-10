'use client'

import { useCallback, useEffect, useState } from 'react';

export interface FlaskCamera {
  id: number;
  name: string;
  processed_url: string;
  status: string;
  rtsp_url?: string;
}

export function useFlaskCameras(pollMs: number = 15000) {
  const [cameras, setCameras] = useState<FlaskCamera[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOnce = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Hit Next.js proxy to avoid CORS
      const res = await fetch(`/api/flask/cameras`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Failed to fetch cameras (${res.status})`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setCameras(data as FlaskCamera[]);
      } else if (Array.isArray(data?.cameras)) {
        setCameras(data.cameras as FlaskCamera[]);
      } else {
        throw new Error('Unexpected response structure from Flask /cameras');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch cameras');
      setCameras([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOnce();
    if (pollMs > 0) {
      const id = setInterval(fetchOnce, pollMs);
      return () => clearInterval(id);
    }
  }, [fetchOnce, pollMs]);

  return { cameras, loading, error, refetch: fetchOnce };
}


