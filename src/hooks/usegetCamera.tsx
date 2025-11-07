"use client"
import { useEffect, useState } from "react";

const useGetCameras = (setLoading?: any, filter?: any) => {
    let url = `/api/cameras`;
    const [cameras, setCameras] = useState<any>([]);

    useEffect(() => {
        setLoading && setLoading(true);
        fetch(url, {
            cache: 'no-store',
            next: { revalidate: 0 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (response) => {
                const data = await response.json();
                // API returns { cameras: [...], success: true, count: ... }
                setCameras(data.cameras || []);
                console.log("Fetched cameras:", data.cameras?.length || 0);
                setLoading && setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching cameras:", err);
                setCameras([]);
                setLoading && setLoading(false);
            });
    }, [filter, url]);

    return cameras;
};

export default useGetCameras;
