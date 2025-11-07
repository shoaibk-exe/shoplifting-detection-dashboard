"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Icons } from "@/images/Icons";
import { routes } from "@/config/routes";
import { Access_Scope } from "@/helper/constants";
import PermissionCheck from "@/app/(site)/permission-check";
import lightLogo from "../../../public/images/background/logo.png"
import { signOut } from "next-auth/react";
import { AlertTriangle, BellRing } from "lucide-react";



interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "",
    menuItems: [
      {
        icon: (
          <Icons.dashboard />
        ),
        label: "Dashboard",
        route: "/",
      },
      {
        icon: (
          <Icons.profile />
        ),
        label: "My Account",
        route: "/profile",
      },
      {
        icon: (
          <Icons.videoCam />
        ),
        label: "Device Registration",
        route: "/device-registration",
      },
      {
        icon: (
          <Icons.bookmarks />
        ),
        label: "Anomaly Detection",
        route: "/anomaly-detection",
      },
      // {
      //   icon: (
      //     <Icons.scan />
      //   ),
      //   label: "Saved Video",
      //   route: "/saved-video",
      // },
      {
        icon: (
          <AlertTriangle />
        ),
        label: "ShopliftingAlerts",
        route: "/shoplifting-alerts",
      },
      {
        icon: (
          <Icons.users />
        ),
        label: "Users",
        route: "#",
        permission: Object.values(Access_Scope.Users),
        children: [
          { label: "Add", route: routes.users.AddUsers, permission: [Access_Scope.Users.Add] },
          { label: "List", route: routes.users.ListOfUsers, permission: [Access_Scope.Users.Read] },
        ],
      },

      {
        icon: (
          <Icons.manageDevice />
        ),
        label: "Manage Device",
        route: "/manage-devices",
        permission: Object.values(Access_Scope.ManagedDevice),
      },
      // {
      //   icon: (
      //     <Icons.manageDevice />
      //   ),
      //   label: "Manage Devices",
      //   route: "/manage-devices",
      // },
      {
        icon: (
          <Icons.Setting />
        ),
        label: "Setting",
        route: "/setting",
      },
      {
        icon: (
          <Icons.userRoles />
        ),
        label: "Roles",
        route: "#",
        permission: Object.values(Access_Scope.Role),
        children: [
          { label: "Add", route: routes.Roles.AddRoles, permission: [Access_Scope.Role.Add] },
          { label: "List", route: routes.Roles.ListOfRoles, permission: [Access_Scope.Role.Read] },
        ],
      },
      {
        icon: (
          <Icons.LogoutIcon />
        ),
        label: "Sign Out",
        route: "#",
        onClick: async () => {
          await signOut({ callbackUrl: '/auth/signin', redirect: true });
        }
      },
    ],
  },
];
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${sidebarOpen
          ? "translate-x-0 duration-300 ease-linear"
          : "-translate-x-full"
          }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={lightLogo}
              alt="Logo"
              priority
              className="dark:hidden"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              width={176}
              height={32}
              src={lightLogo}
              alt="Logo"
              priority
              className="hidden dark:block"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <Icons.menu />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>
                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => {
                    return (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    )
                  }

                  )}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
