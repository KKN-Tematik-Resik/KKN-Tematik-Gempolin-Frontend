import PageBreadcrumb from "@/components/common/page-breadcrumb";

export default function AdminWelcomeHeader() {
  return (
    <div className="space-y-2">
      <PageBreadcrumb pageTitle="Dashboard Internal Admin" />
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
          Halo, Admin Kelurahan Gempolsari 
        </h1>
      </div>
    </div>
  );
}
