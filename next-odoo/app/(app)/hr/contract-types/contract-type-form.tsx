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
import type { ContractType } from "@/app/types/odoo";

interface ContractTypeFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contractType?: ContractType | null;
}

interface Option {
  id: number;
  name: string;
}

export default function ContractTypeForm({
  open,
  onClose,
  onSuccess,
  contractType,
}: ContractTypeFormProps) {
  const isEditing = !!contractType;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [countries, setCountries] = useState<Option[]>([]);

  const [formData, setFormData] = useState<Record<string, unknown>>({
    name: "",
    code: "",
    sequence: 10,
    country_id: "",
  });

  useEffect(() => {
    if (open) {
      let cancelled = false;
      odooSearchRead<{ id: number; name: string }>("res.country", {
        fields: ["id", "name"],
        limit: 300,
      })
        .then((res) => {
          if (!cancelled) setCountries(res.records);
        })
        .catch(() => {
          // silently fail
        });

      if (contractType) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: contractType.name || "",
          code: contractType.code || "",
          sequence: contractType.sequence ?? 10,
          country_id: contractType.country_id ? String(contractType.country_id[0]) : "",
        });
      } else {
        setFormData({
          name: "",
          code: "",
          sequence: 10,
          country_id: "",
        });
      }
      setError(null);

      return () => {
        cancelled = true;
      };
    }
  }, [open, contractType]);

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
      if (formData.code) values.code = formData.code;
      if (formData.sequence !== undefined && formData.sequence !== "")
        values.sequence = Number(formData.sequence);

      const v = formData.country_id;
      if (v !== undefined && v !== "" && v !== null) {
        values.country_id = Number(v);
      }

      if (isEditing && contractType) {
        await odooWrite("hr.contract.type", [contractType.id], values);
      } else {
        await odooCreate("hr.contract.type", values);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save contract type";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const countryOptions = [
    { value: "", label: "Select country" },
    ...countries.map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <Dialog open={open} onClose={onClose} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Contract Type" : "New Contract Type"}</DialogTitle>
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
                label="Code"
                value={String(formData.code || "")}
                onChange={(e) => handleChange("code", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Sequence"
                type="number"
                value={String(formData.sequence ?? "")}
                onChange={(e) =>
                  handleChange("sequence", e.target.value === "" ? "" : Number(e.target.value))
                }
              />
              <Select
                label="Country"
                value={String(formData.country_id || "")}
                onChange={(e) => handleChange("country_id", e.target.value)}
                options={countryOptions}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {isEditing ? "Save Changes" : "Create Type"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
