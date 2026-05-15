"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Users, Mail, Phone, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { PageLoader } from "@/app/components/ui/loading";
import { EmptyState } from "@/app/components/ui/empty-state";
import { Avatar } from "@/app/components/ui/avatar";
import { odooRead, odooSearchRead } from "@/app/lib/odoo/client";
import type { Department, Employee } from "@/app/types/odoo";
import DepartmentForm from "../department-form";

interface DepartmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
  const [department, setDepartment] = useState<Department | null>(null);
  const [members, setMembers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const { id } = await params;
        const deptRecords = await odooRead<Department>("hr.department", [parseInt(id)], [
          "id", "name", "complete_name", "active", "company_id", "parent_id",
          "manager_id", "total_employee", "note", "color",
        ]);
        const dept = deptRecords[0] || null;
        if (!cancelled) setDepartment(dept);

        if (dept) {
          const memberRes = await odooSearchRead<Employee>("hr.employee", {
            domain: [["department_id", "=", dept.id], ["active", "=", true]],
            fields: ["id", "name", "job_title", "work_email", "work_phone", "avatar_128"],
            limit: 50,
            order: "name ASC",
          });
          if (!cancelled) setMembers(memberRes.records);
        }
      } catch (error) {
        console.error("Failed to fetch department:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [params, refreshKey]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!department) {
    return (
      <EmptyState
        icon={<Building2 className="h-6 w-6" />}
        title="Department not found"
        description="The department you're looking for doesn't exist or has been removed."
        action={
          <Link href="/hr/departments">
            <Button variant="secondary">Back to Departments</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/hr/departments"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Departments
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {department.name}
            </h1>
            {department.complete_name && department.complete_name !== department.name && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {department.complete_name}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              {department.manager_id && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  Manager: {department.manager_id[1]}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {department.total_employee ?? 0} employees
              </span>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setFormOpen(true)}>
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Members</CardTitle>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">No members in this department.</p>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {members.map((emp) => (
                    <Link
                      key={emp.id}
                      href={`/hr/employees/${emp.id}`}
                      className="flex items-center gap-3 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                      <Avatar
                        src={emp.avatar_128 ? `data:image/png;base64,${emp.avatar_128}` : undefined}
                        fallback={emp.name}
                        icon={<User className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                          {emp.name}
                        </p>
                        {emp.job_title && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                            {emp.job_title}
                          </p>
                        )}
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                        {emp.work_email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {emp.work_email}
                          </span>
                        )}
                        {emp.work_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {emp.work_phone}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {department.company_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Company</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {department.company_id[1]}
                  </span>
                </div>
              )}
              {department.parent_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Parent</span>
                  <Link href={`/hr/departments/${department.parent_id[0]}`} className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                    {department.parent_id[1]}
                  </Link>
                </div>
              )}
              {department.manager_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Manager</span>
                  <Link href={`/hr/employees/${department.manager_id[0]}`} className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                    {department.manager_id[1]}
                  </Link>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Status</span>
                <Badge variant={department.active ? "success" : "danger"}>
                  {department.active ? "Active" : "Archived"}
                </Badge>
              </div>
              {department.note && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 block mb-1">Note</span>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {department.note}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DepartmentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        department={department}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}
