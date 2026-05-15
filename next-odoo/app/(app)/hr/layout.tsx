"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { Users, Building2, Briefcase } from "lucide-react";

const hrNavItems = [
  { name: "Employees", href: "/hr/employees", icon: Users },
  { name: "Departments", href: "/hr/departments", icon: Building2 },
  { name: "Jobs", href: "/hr/jobs", icon: Briefcase },
];

export default function HrLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1">
          {hrNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
}
