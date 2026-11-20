import {
  GroupIcon,
  LayoutGridIcon,
  PieChartIcon,
  TimeIcon,
  TrashBinIcon,
} from "@/icons";
import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    icon: <LayoutGridIcon className="size-6" />,
    key: "adminDashboard",
    path: "/admin",
  },
  {
    icon: <TrashBinIcon className="size-6" />,
    key: "gempolin",
    path: "/admin/gempolin",
  },
  {
    icon: <PieChartIcon className="size-6" />,
    key: "demografi",
    path: "/admin/demografi",
  },
  {
    icon: <TimeIcon className="size-6" />,
    key: "sinkronisasi",
    path: "/admin/sinkronisasi",
  },
];

export const superAdminNavItems: NavItem[] = [
  {
    icon: <GroupIcon className="size-6" />,
    key: "kelolaAdmin",
    path: "/super-admin",
  },
];

export const othersItems: NavItem[] = [];

export const supportItems: NavItem[] = [];
