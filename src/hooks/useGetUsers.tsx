"use client"
import { useEffect, useState } from "react";

const useGetUsers = (setLoading?: any, filter?: any) => {
    let url = `/api/users`;
    const [users, setUsers] = useState<any>([]);

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
                setUsers(data.users);
                setLoading && setLoading(false)
            })
            .catch((err) => {
                setLoading && setLoading(false)
                console.error(err)
            });
    }, [filter]);

    return users;
};

export default useGetUsers;
