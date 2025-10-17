"use client"
import { useEffect, useState } from "react";

const useGetCameras = (setLoading?: any, filter?: any) => {
    let url = `/api/cameras`;
    const [cameras, setCameras] = useState<any>([]);

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
                setCameras(data.camera);
                console.log("res",data)
                console.log("res",cameras)
                setLoading && setLoading(false)
            })
            .catch((err) => {
                setLoading && setLoading(false)
                console.error(err)
            });
    }, [filter]);

    return cameras;
};

export default useGetCameras;
