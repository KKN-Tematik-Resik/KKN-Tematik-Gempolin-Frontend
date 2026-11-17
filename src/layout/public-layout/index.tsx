import PublicHeader from "./header";

interface Props {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <PublicHeader />
      <main className="mx-auto w-full max-w-7xl grow p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-gray-500 sm:px-6 lg:px-8 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Kelurahan Gempolsari. Gempolin — Sistem Informasi
          Pengelolaan Sampah.
        </div>
      </footer>
    </div>
  );
}
