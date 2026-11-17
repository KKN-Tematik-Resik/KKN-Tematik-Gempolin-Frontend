import {
  BoxIcon,
  LayoutGridIcon,
  PieChartIcon,
  TimeIcon,
  TrashBinIcon,
  UploadIcon,
  UserCircleIcon,
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
    icon: <BoxIcon className="size-6" />,
    key: "bankSampah",
    path: "/admin/bank-sampah",
  },
  {
    icon: <UploadIcon className="size-6" />,
    key: "pembaruanData",
    path: "/admin/pembaruan-data",
  },
  {
    icon: <TimeIcon className="size-6" />,
    key: "sinkronisasi",
    path: "/admin/sinkronisasi",
  },
  {
    icon: <UserCircleIcon className="size-6" />,
    key: "profilAdmin",
    path: "/admin/profil",
  },
];

export const othersItems: NavItem[] = [];

export const supportItems: NavItem[] = [];
