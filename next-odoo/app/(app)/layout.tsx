import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/odoo/auth";
import { AuthProvider } from "@/app/hooks/use-auth";
import { Sidebar } from "@/app/components/layout/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AuthProvider>
      <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
