"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  User,
  CreditCard,
  FileText,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Avatar } from "@/app/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { PageLoader } from "@/app/components/ui/loading";
import { EmptyState } from "@/app/components/ui/empty-state";
import { odooRead } from "@/app/lib/odoo/client";
import type { Employee } from "@/app/types/odoo";
import EmployeeForm from "../employee-form";

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("work");
  const [formOpen, setFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const { id } = await params;
        const records = await odooRead<Employee>("hr.employee", [parseInt(id)], [
          "id", "name", "work_email", "work_phone", "mobile_phone",
          "department_id", "job_id", "job_title", "parent_id", "coach_id",
          "company_id", "work_location_id", "work_location_name", "work_location_type",
          "address_id", "image_1920", "avatar_128", "hr_presence_state", "hr_icon_display",
          "newly_hired", "active", "category_ids", "birthday", "contract_date_start",
          "contract_date_end", "wage", "employee_type", "contract_type_id",
          "structure_type_id", "resource_calendar_id", "user_id",
          "private_email", "private_phone", "legal_name", "country_id",
          "identification_id", "passport_id", "marital", "children",
          "emergency_contact", "emergency_phone", "certificate", "study_field",
          "study_school", "barcode", "pin", "tz", "color", "distance_home_work",
          "distance_home_work_unit", "place_of_birth", "country_of_birth", "sex",
          "private_street", "private_street2", "private_city", "private_state_id",
          "private_zip", "private_country_id", "visa_no", "visa_expire",
          "permit_no", "work_permit_expiration_date",
        ]);
        if (!cancelled) {
          setEmployee(records[0] || null);
        }
      } catch (error) {
        console.error("Failed to fetch employee:", error);
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

  if (!employee) {
    return (
      <EmptyState
        icon={<User className="h-6 w-6" />}
        title="Employee not found"
        description="The employee you're looking for doesn't exist or has been removed."
        action={
          <Link href="/hr/employees">
            <Button variant="secondary">Back to Employees</Button>
          </Link>
        }
      />
    );
  }

  const tabs = [
    { id: "work", label: "Work Information", icon: Briefcase },
    { id: "personal", label: "Personal", icon: User },
    { id: "payroll", label: "Payroll", icon: CreditCard },
    { id: "settings", label: "Settings", icon: FileText },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/hr/employees"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Employees
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              src={
                employee.image_1920
                  ? `data:image/png;base64,${employee.image_1920}`
                  : employee.avatar_128
                    ? `data:image/png;base64,${employee.avatar_128}`
                    : undefined
              }
              fallback={employee.name}
              icon={<User className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />}
              size="xl"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {employee.name}
                </h1>
                {employee.newly_hired && (
                  <Badge variant="success">Newly Hired</Badge>
                )}
                {!employee.active && (
                  <Badge variant="danger">Archived</Badge>
                )}
              </div>
              {employee.job_title && (
                <p className="text-zinc-600 dark:text-zinc-400">
                  {employee.job_title}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                {employee.work_email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {employee.work_email}
                  </span>
                )}
                {employee.work_phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {employee.work_phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setFormOpen(true)}>
            Edit
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "work" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.company_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Company</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.company_id[1]}
                  </span>
                </div>
              )}
              {employee.department_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Department</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.department_id[1]}
                  </span>
                </div>
              )}
              {employee.job_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Job Position</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.job_id[1]}
                  </span>
                </div>
              )}
              {employee.parent_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Manager</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.parent_id[1]}
                  </span>
                </div>
              )}
              {employee.coach_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Coach</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.coach_id[1]}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.work_location_name && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Work Location</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.work_location_name}
                  </span>
                </div>
              )}
              {employee.work_location_type && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Location Type</span>
                  <Badge variant="default">{employee.work_location_type}</Badge>
                </div>
              )}
              {employee.address_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Address</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.address_id[1]}
                  </span>
                </div>
              )}
              {employee.distance_home_work && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Distance from Home</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.distance_home_work} {employee.distance_home_work_unit}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.work_email && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Work Email</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.work_email}
                  </span>
                </div>
              )}
              {employee.work_phone && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Work Phone</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.work_phone}
                  </span>
                </div>
              )}
              {employee.mobile_phone && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Mobile</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.mobile_phone}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Presence</span>
                <Badge
                  variant={
                    employee.hr_presence_state === "present"
                      ? "success"
                      : employee.hr_presence_state === "absent"
                        ? "danger"
                        : "default"
                  }
                >
                  {employee.hr_presence_state || "Unknown"}
                </Badge>
              </div>
              {employee.employee_type && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Employee Type</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.employee_type}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "personal" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.legal_name && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Legal Name</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.legal_name}
                  </span>
                </div>
              )}
              {employee.birthday && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Birthday</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.birthday}
                  </span>
                </div>
              )}
              {employee.place_of_birth && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Place of Birth</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.place_of_birth}
                  </span>
                </div>
              )}
              {employee.country_of_birth && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Country of Birth</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.country_of_birth[1]}
                  </span>
                </div>
              )}
              {employee.sex && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Gender</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white capitalize">
                    {employee.sex}
                  </span>
                </div>
              )}
              {employee.marital && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Marital Status</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white capitalize">
                    {employee.marital}
                  </span>
                </div>
              )}
              {employee.children !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Children</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.children}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Citizenship</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.country_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Nationality</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.country_id[1]}
                  </span>
                </div>
              )}
              {employee.identification_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Identification No</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.identification_id}
                  </span>
                </div>
              )}
              {employee.passport_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Passport</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.passport_id}
                  </span>
                </div>
              )}
              {employee.visa_no && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Visa</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.visa_no}
                  </span>
                </div>
              )}
              {employee.permit_no && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Work Permit</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.permit_no}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.emergency_contact && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Contact</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.emergency_contact}
                  </span>
                </div>
              )}
              {employee.emergency_phone && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Phone</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.emergency_phone}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.certificate && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Certificate</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white capitalize">
                    {employee.certificate}
                  </span>
                </div>
              )}
              {employee.study_field && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Field of Study</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.study_field}
                  </span>
                </div>
              )}
              {employee.study_school && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">School</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.study_school}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "payroll" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contract</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.contract_date_start && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Start Date</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.contract_date_start}
                  </span>
                </div>
              )}
              {employee.contract_date_end && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">End Date</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.contract_date_end}
                  </span>
                </div>
              )}
              {employee.wage !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Wage</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.wage}
                  </span>
                </div>
              )}
              {employee.contract_type_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Contract Type</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.contract_type_id[1]}
                  </span>
                </div>
              )}
              {employee.structure_type_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Pay Category</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.structure_type_id[1]}
                  </span>
                </div>
              )}
              {employee.resource_calendar_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Working Schedule</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.resource_calendar_id[1]}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Application Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.user_id && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Linked User</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.user_id[1]}
                  </span>
                </div>
              )}
              {employee.tz && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Timezone</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.tz}
                  </span>
                </div>
              )}
              {employee.barcode && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Badge ID</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.barcode}
                  </span>
                </div>
              )}
              {employee.pin && (
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">PIN Code</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {employee.pin}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <EmployeeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        employee={employee}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}
