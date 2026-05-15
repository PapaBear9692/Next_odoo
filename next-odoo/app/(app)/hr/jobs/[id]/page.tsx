"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, Users, Building2, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { PageLoader } from "@/app/components/ui/loading";
import { EmptyState } from "@/app/components/ui/empty-state";
import { Avatar } from "@/app/components/ui/avatar";
import { odooRead, odooSearchRead } from "@/app/lib/odoo/client";
import type { Job, Employee } from "@/app/types/odoo";
import JobForm from "../job-form";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const { id } = await params;
        const jobRecords = await odooRead<Job>("hr.job", [parseInt(id)], [
          "id", "name", "active", "sequence", "expected_employees",
          "no_of_employee", "no_of_recruitment", "description", "requirements",
          "user_id", "department_id", "company_id", "contract_type_id",
        ]);
        const j = jobRecords[0] || null;
        if (!cancelled) setJob(j);

        if (j) {
          const empRes = await odooSearchRead<Employee>("hr.employee", {
            domain: [["job_id", "=", j.id], ["active", "=", true]],
            fields: ["id", "name", "job_title", "work_email", "work_phone", "avatar_128"],
            limit: 50,
            order: "name ASC",
          });
          if (!cancelled) setEmployees(empRes.records);
        }
      } catch (error) {
        console.error("Failed to fetch job:", error);
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

  if (!job) {
    return (
      <EmptyState
        icon={<Briefcase className="h-6 w-6" />}
        title="Job position not found"
        description="The job position you're looking for doesn't exist or has been removed."
        action={
          <Link href="/hr/jobs">
            <Button variant="secondary">Back to Jobs</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/hr/jobs"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {job.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              {job.department_id && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {job.department_id[1]}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {job.no_of_employee ?? 0} employees
              </span>
              {job.no_of_recruitment !== undefined && (
                <Badge variant="primary">Target: {job.no_of_recruitment}</Badge>
              )}
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
              <CardTitle className="text-base">Employees</CardTitle>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">No employees in this position.</p>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {employees.map((emp) => (
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
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Status</span>
                <Badge variant={job.active ? "success" : "danger"}>
                  {job.active ? "Active" : "Archived"}
                </Badge>
              </div>
              {job.company_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Company</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {job.company_id[1]}
                  </span>
                </div>
              )}
              {job.contract_type_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Contract Type</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {job.contract_type_id[1]}
                  </span>
                </div>
              )}
              {job.user_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Recruiter</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {job.user_id[1]}
                  </span>
                </div>
              )}
              {job.description && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 block mb-1">Description</span>
                  <div
                    className="text-sm text-zinc-700 dark:text-zinc-300 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
              )}
              {job.requirements && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 block mb-1">Requirements</span>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <JobForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        job={job}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}
