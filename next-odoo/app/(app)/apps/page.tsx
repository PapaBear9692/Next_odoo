"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  BarChart3,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  Calendar,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";

const apps = [
  {
    id: "hr",
    name: "Human Resources",
    description: "Employees, departments, and payroll",
    icon: Users,
    color: "bg-emerald-500",
    path: "/hr/employees",
    available: true,
  },
  {
    id: "crm",
    name: "CRM",
    description: "Leads, opportunities, and customers",
    icon: Users,
    color: "bg-blue-500",
    path: "#",
    available: false,
  },
  {
    id: "sales",
    name: "Sales",
    description: "Quotations and orders",
    icon: ShoppingCart,
    color: "bg-sky-500",
    path: "#",
    available: false,
  },
  {
    id: "inventory",
    name: "Inventory",
    description: "Stock and warehouses",
    icon: Package,
    color: "bg-amber-500",
    path: "#",
    available: false,
  },
  {
    id: "accounting",
    name: "Accounting",
    description: "Invoices and bookkeeping",
    icon: FileText,
    color: "bg-violet-500",
    path: "#",
    available: false,
  },
  {
    id: "projects",
    name: "Projects",
    description: "Tasks and timesheets",
    icon: Briefcase,
    color: "bg-rose-500",
    path: "#",
    available: false,
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Events and meetings",
    icon: Calendar,
    color: "bg-orange-500",
    path: "#",
    available: false,
  },
  {
    id: "discuss",
    name: "Discuss",
    description: "Team messaging",
    icon: Mail,
    color: "bg-cyan-500",
    path: "#",
    available: false,
  },
  {
    id: "reporting",
    name: "Reporting",
    description: "Analytics and dashboards",
    icon: BarChart3,
    color: "bg-indigo-500",
    path: "#",
    available: false,
  },
  {
    id: "settings",
    name: "Settings",
    description: "Configuration and preferences",
    icon: Settings,
    color: "bg-zinc-500",
    path: "#",
    available: false,
  },
];

export default function AppsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Apps
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Select an app to get started
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {apps.map((app, i) => {
          const Component = app.available ? Link : "div";
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Component
                href={app.available ? app.path : "#"}
                className={`block ${!app.available ? "cursor-not-allowed opacity-60" : "group"}`}
              >
                <Card className="h-full transition-all hover:shadow-md">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${app.color} text-white shadow-sm`}
                    >
                      <app.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        {app.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                        {app.description}
                      </p>
                      {!app.available && (
                        <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          Coming soon
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Component>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
