"use client";

import { useSession } from "next-auth/react";

const useHasAccess = (permission: string | string[]) => {
    if (typeof permission === "string") {
        permission = [permission];
    }
    const { data: session } = useSession() as any;
    if (!session) {
        return false;
    }
    const allowedPermissions = session?.user?.role?.permissions;
    const allow = permission.filter((permission) => {
        if (allowedPermissions?.includes(permission)) {
            return true;
        }
        return false;
    });
    if (allow.length > 0) {
        return true;
    }
    return false;
};
export default useHasAccess;