import GridShape from "@/components/common/grid-shape";
import ThemeToggler from "@/components/common/theme-toggler";
import { ThemeProvider } from "@/context/theme-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-40 dark:opacity-20">
          <GridShape />
        </div>

        <div className="relative z-10 w-full max-w-[420px]">
          {children}
        </div>

        <div className="fixed inset-e-6 bottom-6 z-50 sm:inset-e-8 sm:bottom-8">
          <ThemeToggler />
        </div>
      </div>
    </ThemeProvider>
  );
}
