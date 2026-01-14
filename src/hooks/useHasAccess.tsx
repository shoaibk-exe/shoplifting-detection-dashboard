"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

const useHasAccess = (permission: string | string[]) => {
    const { data: session, status } = useSession() as any;
    
    return useMemo(() => {
        // If session is loading, return false to prevent flash
        if (status === "loading") {
            return false;
        }
        
        if (!session) {
            return false;
        }

        const permissionArray = typeof permission === "string" ? [permission] : permission;
        const allowedPermissions = session?.user?.role?.permissions;
        
        if (!allowedPermissions || !Array.isArray(allowedPermissions)) {
            return false;
        }

        // Check if any of the required permissions are in the allowed permissions
        return permissionArray.some((perm) => allowedPermissions.includes(perm));
    }, [session, permission, status]);
};

export default useHasAccess;