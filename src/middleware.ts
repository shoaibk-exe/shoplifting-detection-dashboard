import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Access_Scope } from "./helper/constants";
const paths = [
  {
    path: "/roles/add",
    permission: [Access_Scope.Role.Add],
  },
  {
    path: "/roles/list",
    permission: [Access_Scope.Role.Read],
  },
  {
    path: "/users/add",
    permission: [Access_Scope.Users.Add],
  },
  {
    path: "/users/list",
    permission: [Access_Scope.Users.Read],
  },
  {
    path: "/manage-devices/add",
    permission: [Access_Scope.ManagedDevice.Add],
  },
  {
    path: "/manage-devices",
    permission: [Access_Scope.ManagedDevice.Read],
  },
];

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl?.pathname;
    
    // Early return if path doesn't need permission check
    const path = paths.find((p) => p.path === pathname);
    if (!path) {
      return NextResponse.next();
    }

    // Check permissions only for protected paths
    const token = req.nextauth.token;
    if (token?.role) {
      // Handle both array and object role formats
      let permissions: string[] = [];
      
      if (Array.isArray(token.role) && token.role.length > 0 && 'permissions' in token.role[0]) {
        permissions = token.role[0].permissions || [];
      } else if (typeof token.role === 'object' && 'permissions' in token.role) {
        permissions = token.role.permissions || [];
      }

      if (Array.isArray(permissions) && !permissions.includes(path.permission[0])) {
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }
    }
    
    return NextResponse.next();
  }, {
  secret: process.env.SECRET,
  callbacks: {
    authorized: (params) => {
      const { token } = params;
      return !!token;
    },
  },
},
);

export const config = {
  matcher: [
    "/",
    "/profile",
    "/device-registration",
    "/anomaly-detection/:path*",
    "/saved-video",
    "/shoplifting-alerts/:path*",
    // "/users/:path*",
    // "/roles/:path*",
    "/manage-devices/:path*",
    "/live-stream/:path*",
    "/manage-devices",
    "/plans",
    "/setting",
    "/dashboard/:path*",
    '/auth/signup',
  ],
};
