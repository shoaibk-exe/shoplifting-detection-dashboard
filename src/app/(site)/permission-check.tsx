"use client";

import React, { memo } from "react";
import useHasAccess from "@/hooks/useHasAccess";

const PermissionCheck = memo(({
  permission,
  children,
}: {
  permission: string | string[];
  children: React.ReactNode;
}) => {
  const hasAccess = useHasAccess(permission);
  
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
});

PermissionCheck.displayName = "PermissionCheck";

export default PermissionCheck;
