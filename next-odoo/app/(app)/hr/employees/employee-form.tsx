"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select } from "@/app/components/ui/select";
import {
  odooCreate,
  odooWrite,
  odooSearchRead,
} from "@/app/lib/odoo/client";
import type { Employee } from "@/app/types/odoo";

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: Employee | null;
}

interface Option {
  id: number;
  name: string;
}

const employeeTypeOptions = [
  { value: "", label: "Select type" },
  { value: "employee", label: "Employee" },
  { value: "student", label: "Student" },
  { value: "trainee", label: "Trainee" },
  { value: "contractor", label: "Contractor" },
  { value: "freelance", label: "Freelance" },
];

const maritalOptions = [
  { value: "", label: "Select status" },
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "cohabitant", label: "Legal Cohabitant" },
  { value: "widower", label: "Widower" },
  { value: "divorced", label: "Divorced" },
];

const certificateOptions = [
  { value: "", label: "Select certificate" },
  { value: "graduate", label: "Graduate" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "doctor", label: "Doctor" },
  { value: "other", label: "Other" },
];

export default function EmployeeForm({
  open,
  onClose,
  onSuccess,
  employee,
}: EmployeeFormProps) {
  const isEditing = !!employee;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [departments, setDepartments] = useState<Option[]>([]);
  const [jobs, setJobs] = useState<Option[]>([]);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [managers, setManagers] = useState<Option[]>([]);

  const [formData, setFormData] = useState<Record<string, unknown>>({
    name: "",
    work_email: "",
    work_phone: "",
    mobile_phone: "",
    department_id: "",
    job_id: "",
    parent_id: "",
    company_id: "",
    job_title: "",
    employee_type: "",
    active: true,
    identification_id: "",
    passport_id: "",
    birthday: "",
    marital: "",
    children: 0,
    emergency_contact: "",
    emergency_phone: "",
    certificate: "",
    study_field: "",
    study_school: "",
    barcode: "",
    pin: "",
  });

  const loadOptions = useCallback(async () => {
    try {
      const [deptRes, jobRes, compRes, mgrRes] = await Promise.all([
        odooSearchRead<{ id: number; name: string }>("hr.department", {
          fields: ["id", "name"],
          limit: 200,
        }),
        odooSearchRead<{ id: number; name: string }>("hr.job", {
          fields: ["id", "name"],
          limit: 200,
        }),
        odooSearchRead<{ id: number; name: string }>("res.company", {
          fields: ["id", "name"],
          limit: 50,
        }),
        odooSearchRead<{ id: number; name: string }>("hr.employee", {
          fields: ["id", "name"],
          limit: 500,
        }),
      ]);
      setDepartments(deptRes.records);
      setJobs(jobRes.records);
      setCompanies(compRes.records);
      setManagers(mgrRes.records);
    } catch {
      // silently fail options load
    }
  }, []);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadOptions();
      if (employee) {
        setFormData({
          name: employee.name || "",
          work_email: employee.work_email || "",
          work_phone: employee.work_phone || "",
          mobile_phone: employee.mobile_phone || "",
          department_id: employee.department_id ? String(employee.department_id[0]) : "",
          job_id: employee.job_id ? String(employee.job_id[0]) : "",
          parent_id: employee.parent_id ? String(employee.parent_id[0]) : "",
          company_id: employee.company_id ? String(employee.company_id[0]) : "",
          job_title: employee.job_title || "",
          employee_type: employee.employee_type || "",
          active: employee.active ?? true,
          identification_id: employee.identification_id || "",
          passport_id: employee.passport_id || "",
          birthday: employee.birthday || "",
          marital: employee.marital || "",
          children: employee.children ?? 0,
          emergency_contact: employee.emergency_contact || "",
          emergency_phone: employee.emergency_phone || "",
          certificate: employee.certificate || "",
          study_field: employee.study_field || "",
          study_school: employee.study_school || "",
          barcode: employee.barcode || "",
          pin: employee.pin || "",
        });
      } else {
        setFormData({
          name: "",
          work_email: "",
          work_phone: "",
          mobile_phone: "",
          department_id: "",
          job_id: "",
          parent_id: "",
          company_id: "",
          job_title: "",
          employee_type: "",
          active: true,
          identification_id: "",
          passport_id: "",
          birthday: "",
          marital: "",
          children: 0,
          emergency_contact: "",
          emergency_phone: "",
          certificate: "",
          study_field: "",
          study_school: "",
          barcode: "",
          pin: "",
        });
      }
      setError(null);
    }
  }, [open, employee, loadOptions]);

  function handleChange(
    key: string,
    value: string | number | boolean
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const values: Record<string, unknown> = {};

      const stringFields = [
        "name",
        "work_email",
        "work_phone",
        "mobile_phone",
        "job_title",
        "employee_type",
        "identification_id",
        "passport_id",
        "birthday",
        "marital",
        "emergency_contact",
        "emergency_phone",
        "certificate",
        "study_field",
        "study_school",
        "barcode",
        "pin",
      ];
      for (const f of stringFields) {
        const v = formData[f];
        if (v !== undefined && v !== "" && v !== null) {
          values[f] = v;
        }
      }

      const intFields = ["children"];
      for (const f of intFields) {
        const v = formData[f];
        if (v !== undefined && v !== "" && v !== null) {
          values[f] = Number(v);
        }
      }

      const m2oFields = ["department_id", "job_id", "parent_id", "company_id"];
      for (const f of m2oFields) {
        const v = formData[f];
        if (v !== undefined && v !== "" && v !== null) {
          values[f] = Number(v);
        }
      }

      values.active = formData.active;

      if (isEditing && employee) {
        await odooWrite("hr.employee", [employee.id], values);
      } else {
        await odooCreate("hr.employee", values);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save employee";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const deptOptions = [
    { value: "", label: "Select department" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];
  const jobOptions = [
    { value: "", label: "Select job" },
    ...jobs.map((d) => ({ value: d.id, label: d.name })),
  ];
  const companyOptions = [
    { value: "", label: "Select company" },
    ...companies.map((d) => ({ value: d.id, label: d.name })),
  ];
  const managerOptions = [
    { value: "", label: "Select manager" },
    ...managers
      .filter((m) => !employee || m.id !== employee.id)
      .map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <Dialog open={open} onClose={onClose} className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Employee" : "New Employee"}</DialogTitle>
        <DialogClose onClose={onClose} />
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogBody>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Name"
                value={String(formData.name || "")}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
              <Input
                label="Job Title"
                value={String(formData.job_title || "")}
                onChange={(e) => handleChange("job_title", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Department"
                value={String(formData.department_id || "")}
                onChange={(e) => handleChange("department_id", e.target.value)}
                options={deptOptions}
              />
              <Select
                label="Job Position"
                value={String(formData.job_id || "")}
                onChange={(e) => handleChange("job_id", e.target.value)}
                options={jobOptions}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Manager"
                value={String(formData.parent_id || "")}
                onChange={(e) => handleChange("parent_id", e.target.value)}
                options={managerOptions}
              />
              <Select
                label="Company"
                value={String(formData.company_id || "")}
                onChange={(e) => handleChange("company_id", e.target.value)}
                options={companyOptions}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Work Email"
                type="email"
                value={String(formData.work_email || "")}
                onChange={(e) => handleChange("work_email", e.target.value)}
              />
              <Input
                label="Work Phone"
                value={String(formData.work_phone || "")}
                onChange={(e) => handleChange("work_phone", e.target.value)}
              />
              <Input
                label="Mobile Phone"
                value={String(formData.mobile_phone || "")}
                onChange={(e) => handleChange("mobile_phone", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Employee Type"
                value={String(formData.employee_type || "")}
                onChange={(e) => handleChange("employee_type", e.target.value)}
                options={employeeTypeOptions}
              />
              <Input
                label="Birthday"
                type="date"
                value={String(formData.birthday || "")}
                onChange={(e) => handleChange("birthday", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Marital Status"
                value={String(formData.marital || "")}
                onChange={(e) => handleChange("marital", e.target.value)}
                options={maritalOptions}
              />
              <Input
                label="Children"
                type="number"
                min={0}
                value={String(formData.children ?? "")}
                onChange={(e) =>
                  handleChange("children", e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Identification No"
                value={String(formData.identification_id || "")}
                onChange={(e) => handleChange("identification_id", e.target.value)}
              />
              <Input
                label="Passport No"
                value={String(formData.passport_id || "")}
                onChange={(e) => handleChange("passport_id", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Emergency Contact"
                value={String(formData.emergency_contact || "")}
                onChange={(e) => handleChange("emergency_contact", e.target.value)}
              />
              <Input
                label="Emergency Phone"
                value={String(formData.emergency_phone || "")}
                onChange={(e) => handleChange("emergency_phone", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Certificate"
                value={String(formData.certificate || "")}
                onChange={(e) => handleChange("certificate", e.target.value)}
                options={certificateOptions}
              />
              <Input
                label="Field of Study"
                value={String(formData.study_field || "")}
                onChange={(e) => handleChange("study_field", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="School"
                value={String(formData.study_school || "")}
                onChange={(e) => handleChange("study_school", e.target.value)}
              />
              <Input
                label="Badge ID"
                value={String(formData.barcode || "")}
                onChange={(e) => handleChange("barcode", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="PIN"
                value={String(formData.pin || "")}
                onChange={(e) => handleChange("pin", e.target.value)}
              />
              <div className="flex items-center gap-2 pt-6">
                <input
                  id="active"
                  type="checkbox"
                  checked={!!formData.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-sm text-zinc-700 dark:text-zinc-300">
                  Active
                </label>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {isEditing ? "Save Changes" : "Create Employee"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
