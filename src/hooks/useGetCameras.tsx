"use client"
import { useEffect, useState } from "react";

const useGetCamera = (setLoading?: any, filter?: any) => {
    let url = `/api/cameras`;
    const [camera, setCamera] = useState<any>([]);

    useEffect(() => {
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
                setCamera(data.camera);
                setLoading && setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading && setLoading(false)
            });
    }, [filter]);
    return camera;
};

export default useGetCamera;
