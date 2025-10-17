"use client"
import { useEffect, useState } from "react";

const useGetRoles = (setLoading?: any, filter?: any) => {
    let url = `/api/roles`;
    const [roles, setRoles] = useState<any>([]);

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
                setRoles(data.roles);
                setLoading && setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading && setLoading(false)
            });
    }, [filter]);
    return roles;
};

export default useGetRoles;
