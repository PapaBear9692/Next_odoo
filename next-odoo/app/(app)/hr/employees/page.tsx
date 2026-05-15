"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Avatar } from "@/app/components/ui/avatar";
import { PageLoader } from "@/app/components/ui/loading";
import { EmptyState } from "@/app/components/ui/empty-state";
import { Card } from "@/app/components/ui/card";
import { odooSearchRead } from "@/app/lib/odoo/client";
import type { Employee } from "@/app/types/odoo";

const PAGE_SIZE = 20;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const domain: unknown[][] = [];

        if (searchQuery) {
          domain.push(["name", "ilike", searchQuery]);
        }

        if (filter === "newly_hired") {
          domain.push(["newly_hired", "=", true]);
        } else if (filter === "in_contract") {
          domain.push(
            ["contract_date_start", "!=", false],
            ["contract_date_start", "<=", "today"],
            ["|", ["contract_date_end", "=", false], ["contract_date_end", ">=", "today"]]
          );
        }

        const result = await odooSearchRead<Employee>("hr.employee", {
          domain,
          fields: [
            "id",
            "name",
            "work_email",
            "work_phone",
            "mobile_phone",
            "department_id",
            "job_id",
            "job_title",
            "parent_id",
            "company_id",
            "work_location_id",
            "work_location_name",
            "avatar_128",
            "hr_presence_state",
            "newly_hired",
            "active",
            "category_ids",
            "birthday",
            "contract_date_start",
            "contract_date_end",
            "employee_type",
          ],
          offset: (currentPage - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
          order: "name ASC",
        });

        if (!cancelled) {
          setEmployees(result.records);
          setTotalCount(result.length);
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [searchQuery, currentPage, filter]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const filters = [
    { id: "all", label: "All" },
    { id: "newly_hired", label: "Newly Hired" },
    { id: "in_contract", label: "In Contract" },
  ];

  if (isLoading && employees.length === 0) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Employees
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {totalCount} employees
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary">
            <Plus className="mr-1.5 h-4 w-4" />
            New Employee
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search employees..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFilter(f.id);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filter === f.id
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Employee Grid */}
      {employees.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No employees found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {employees.map((employee, i) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <Link href={`/hr/employees/${employee.id}`}>
                  <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800">
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={
                              employee.avatar_128
                                ? `data:image/png;base64,${employee.avatar_128}`
                                : undefined
                            }
                            fallback={employee.name}
                            size="lg"
                          />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                              {employee.name}
                            </h3>
                            {employee.job_title && (
                              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                                {employee.job_title}
                              </p>
                            )}
                          </div>
                        </div>
                        {employee.newly_hired && (
                          <Badge variant="success">
                            New
                          </Badge>
                        )}
                      </div>

                      <div className="mt-4 space-y-2">
                        {employee.work_email && (
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{employee.work_email}</span>
                          </div>
                        )}
                        {employee.work_phone && (
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{employee.work_phone}</span>
                          </div>
                        )}
                        {employee.department_id && (
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {employee.department_id[1]}
                            </span>
                          </div>
                        )}
                        {employee.work_location_name && (
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {employee.work_location_name}
                            </span>
                          </div>
                        )}
                      </div>

                      {employee.contract_date_start && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                          <Briefcase className="h-3 w-3" />
                          {employee.contract_date_start}
                          {employee.contract_date_end && (
                            <span> - {employee.contract_date_end}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
