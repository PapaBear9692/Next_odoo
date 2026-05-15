"use client";

import { useState, useEffect } from "react";
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
import type { WorkLocation } from "@/app/types/odoo";

interface WorkLocationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  location?: WorkLocation | null;
}

interface Option {
  id: number;
  name: string;
}

const locationTypeOptions = [
  { value: "", label: "Select type" },
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

export default function WorkLocationForm({
  open,
  onClose,
  onSuccess,
  location,
}: WorkLocationFormProps) {
  const isEditing = !!location;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companies, setCompanies] = useState<Option[]>([]);
  const [addresses, setAddresses] = useState<Option[]>([]);

  const [formData, setFormData] = useState<Record<string, unknown>>({
    name: "",
    company_id: "",
    location_type: "office",
    address_id: "",
    location_number: "",
    active: true,
  });

  useEffect(() => {
    if (open) {
      let cancelled = false;
      Promise.all([
        odooSearchRead<{ id: number; name: string }>("res.company", {
          fields: ["id", "name"],
          limit: 50,
        }),
        odooSearchRead<{ id: number; name: string }>("res.partner", {
          fields: ["id", "name"],
          limit: 500,
        }),
      ])
        .then(([compRes, addrRes]) => {
          if (cancelled) return;
          setCompanies(compRes.records);
          setAddresses(addrRes.records);
        })
        .catch(() => {
          // silently fail
        });

      if (location) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: location.name || "",
          company_id: location.company_id ? String(location.company_id[0]) : "",
          location_type: location.location_type || "office",
          address_id: location.address_id ? String(location.address_id[0]) : "",
          location_number: location.location_number || "",
          active: location.active ?? true,
        });
      } else {
        setFormData({
          name: "",
          company_id: "",
          location_type: "office",
          address_id: "",
          location_number: "",
          active: true,
        });
      }
      setError(null);

      return () => {
        cancelled = true;
      };
    }
  }, [open, location]);

  function handleChange(key: string, value: string | number | boolean) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const values: Record<string, unknown> = {};

      if (formData.name) values.name = formData.name;
      if (formData.location_type) values.location_type = formData.location_type;
      if (formData.location_number) values.location_number = formData.location_number;

      const m2oFields = ["company_id", "address_id"];
      for (const f of m2oFields) {
        const v = formData[f];
        if (v !== undefined && v !== "" && v !== null) {
          values[f] = Number(v);
        }
      }

      values.active = formData.active;

      if (isEditing && location) {
        await odooWrite("hr.work.location", [location.id], values);
      } else {
        await odooCreate("hr.work.location", values);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save work location";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const companyOptions = [
    { value: "", label: "Select company" },
    ...companies.map((d) => ({ value: d.id, label: d.name })),
  ];
  const addressOptions = [
    { value: "", label: "Select work address" },
    ...addresses.map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <Dialog open={open} onClose={onClose} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Work Location" : "New Work Location"}</DialogTitle>
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
                label="Location Number"
                value={String(formData.location_number || "")}
                onChange={(e) => handleChange("location_number", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Location Type"
                value={String(formData.location_type || "")}
                onChange={(e) => handleChange("location_type", e.target.value)}
                options={locationTypeOptions}
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
                label="Work Address"
                value={String(formData.address_id || "")}
                onChange={(e) => handleChange("address_id", e.target.value)}
                options={addressOptions}
              />
              <div className="flex items-center gap-2 pt-6">
                <input
                  id="loc-active"
                  type="checkbox"
                  checked={!!formData.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="loc-active" className="text-sm text-zinc-700 dark:text-zinc-300">
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
            {isEditing ? "Save Changes" : "Create Location"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
