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
import { Textarea } from "@/app/components/ui/textarea";
import {
  odooCreate,
  odooWrite,
  odooSearchRead,
} from "@/app/lib/odoo/client";
import type { Job } from "@/app/types/odoo";

interface JobFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job?: Job | null;
}

interface Option {
  id: number;
  name: string;
}

export default function JobForm({
  open,
  onClose,
  onSuccess,
  job,
}: JobFormProps) {
  const isEditing = !!job;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [departments, setDepartments] = useState<Option[]>([]);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [users, setUsers] = useState<Option[]>([]);
  const [contractTypes, setContractTypes] = useState<Option[]>([]);

  const [formData, setFormData] = useState<Record<string, unknown>>({
    name: "",
    department_id: "",
    company_id: "",
    contract_type_id: "",
    user_id: "",
    no_of_recruitment: 1,
    description: "",
    requirements: "",
    sequence: 10,
    active: true,
  });

  const loadOptions = useCallback(async () => {
    try {
      const [deptRes, compRes, userRes, ctRes] = await Promise.all([
        odooSearchRead<{ id: number; name: string }>("hr.department", {
          fields: ["id", "name"],
          limit: 200,
        }),
        odooSearchRead<{ id: number; name: string }>("res.company", {
          fields: ["id", "name"],
          limit: 50,
        }),
        odooSearchRead<{ id: number; name: string }>("res.users", {
          fields: ["id", "name"],
          limit: 200,
        }),
        odooSearchRead<{ id: number; name: string }>("hr.contract.type", {
          fields: ["id", "name"],
          limit: 50,
        }),
      ]);
      setDepartments(deptRes.records);
      setCompanies(compRes.records);
      setUsers(userRes.records);
      setContractTypes(ctRes.records);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadOptions();
      if (job) {
        setFormData({
          name: job.name || "",
          department_id: job.department_id ? String(job.department_id[0]) : "",
          company_id: job.company_id ? String(job.company_id[0]) : "",
          contract_type_id: job.contract_type_id ? String(job.contract_type_id[0]) : "",
          user_id: job.user_id ? String(job.user_id[0]) : "",
          no_of_recruitment: job.no_of_recruitment ?? 1,
          description: job.description || "",
          requirements: job.requirements || "",
          sequence: job.sequence ?? 10,
          active: job.active ?? true,
        });
      } else {
        setFormData({
          name: "",
          department_id: "",
          company_id: "",
          contract_type_id: "",
          user_id: "",
          no_of_recruitment: 1,
          description: "",
          requirements: "",
          sequence: 10,
          active: true,
        });
      }
      setError(null);
    }
  }, [open, job, loadOptions]);

  function handleChange(key: string, value: string | number | boolean) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const values: Record<string, unknown> = {};

      const stringFields = ["name", "description", "requirements"];
      for (const f of stringFields) {
        const v = formData[f];
        if (v !== undefined && v !== "" && v !== null) {
          values[f] = v;
        }
      }

      const intFields = ["no_of_recruitment", "sequence"];
      for (const f of intFields) {
        const v = formData[f];
        if (v !== undefined && v !== "" && v !== null) {
          values[f] = Number(v);
        }
      }

      const m2oFields = ["department_id", "company_id", "contract_type_id", "user_id"];
      for (const f of m2oFields) {
        const v = formData[f];
        if (v !== undefined && v !== "" && v !== null) {
          values[f] = Number(v);
        }
      }

      values.active = formData.active;

      if (isEditing && job) {
        await odooWrite("hr.job", [job.id], values);
      } else {
        await odooCreate("hr.job", values);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save job position";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const deptOptions = [
    { value: "", label: "Select department" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];
  const companyOptions = [
    { value: "", label: "Select company" },
    ...companies.map((d) => ({ value: d.id, label: d.name })),
  ];
  const userOptions = [
    { value: "", label: "Select recruiter" },
    ...users.map((d) => ({ value: d.id, label: d.name })),
  ];
  const ctOptions = [
    { value: "", label: "Select contract type" },
    ...contractTypes.map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <Dialog open={open} onClose={onClose} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Job Position" : "New Job Position"}</DialogTitle>
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
                label="Job Position"
                value={String(formData.name || "")}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
              <Input
                label="Sequence"
                type="number"
                value={String(formData.sequence ?? "")}
                onChange={(e) =>
                  handleChange("sequence", e.target.value === "" ? "" : Number(e.target.value))
                }
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
                label="Company"
                value={String(formData.company_id || "")}
                onChange={(e) => handleChange("company_id", e.target.value)}
                options={companyOptions}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Contract Type"
                value={String(formData.contract_type_id || "")}
                onChange={(e) => handleChange("contract_type_id", e.target.value)}
                options={ctOptions}
              />
              <Select
                label="Recruiter"
                value={String(formData.user_id || "")}
                onChange={(e) => handleChange("user_id", e.target.value)}
                options={userOptions}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Target Recruitment"
                type="number"
                min={0}
                value={String(formData.no_of_recruitment ?? "")}
                onChange={(e) =>
                  handleChange("no_of_recruitment", e.target.value === "" ? "" : Number(e.target.value))
                }
              />
              <div className="flex items-center gap-2 pt-6">
                <input
                  id="job-active"
                  type="checkbox"
                  checked={!!formData.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="job-active" className="text-sm text-zinc-700 dark:text-zinc-300">
                  Active
                </label>
              </div>
            </div>

            <Textarea
              label="Job Description"
              value={String(formData.description || "")}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />

            <Textarea
              label="Requirements"
              value={String(formData.requirements || "")}
              onChange={(e) => handleChange("requirements", e.target.value)}
              rows={3}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {isEditing ? "Save Changes" : "Create Position"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
