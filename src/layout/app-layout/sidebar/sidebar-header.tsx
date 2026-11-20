"use client";

import { SidebarHeader } from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { TrashBinIcon } from "@/icons";
import { cn } from "@/utils";

interface AppSidebarHeaderProps {
  showContent: boolean;
}

export default function AppSidebarHeader({
  showContent,
}: AppSidebarHeaderProps) {
  return (
    <SidebarHeader className="px-5 py-6">
      <Link
        href="/admin"
        className={cn(
          "group flex items-center gap-3",
          !showContent ? "justify-center" : "justify-start",
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-400 dark:group-hover:bg-brand-900/60">
          <TrashBinIcon className="size-5" />
        </div>
        {showContent && (
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-gray-900 dark:text-white">
              Gempolin
            </span>
            <span className="text-xs font-medium leading-tight text-gray-500 dark:text-gray-400">
              Kelurahan Gempolsari
            </span>
          </div>
        )}
      </Link>
    </SidebarHeader>
  );
}
