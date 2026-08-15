import AdminNav from "@/components/AdminNav";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Admin", robots: { index: false } };

// The middleware already gates /admin/**. This layout wraps authed pages with the
// sidebar. The login page lives at /admin/login and renders its own bare shell.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Login page: no sidebar. (session is null there; middleware lets it through.)
  if (!session) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
