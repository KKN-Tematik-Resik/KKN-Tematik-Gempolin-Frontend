import { useTranslations } from "next-intl";

export default function SidebarWidget() {
  const t = useTranslations("sidebar.widget");

  return (
    <div className="mx-auto w-full rounded-2xl bg-gray-50 px-4 py-4 text-center dark:bg-white/3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        {t("title")}
      </h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {t("description")}
      </p>
    </div>
  );
}
