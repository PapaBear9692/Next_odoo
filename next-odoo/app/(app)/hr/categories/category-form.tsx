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
import {
  odooCreate,
  odooWrite,
} from "@/app/lib/odoo/client";
import type { EmployeeCategory } from "@/app/types/odoo";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: EmployeeCategory | null;
}

export default function CategoryForm({
  open,
  onClose,
  onSuccess,
  category,
}: CategoryFormProps) {
  const isEditing = !!category;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Record<string, unknown>>({
    name: "",
    color: 1,
  });

  useEffect(() => {
    if (open) {
      if (category) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: category.name || "",
          color: category.color ?? 1,
        });
      } else {
        setFormData({
          name: "",
          color: 1,
        });
      }
      setError(null);
    }
  }, [open, category]);

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
      if (formData.color !== undefined && formData.color !== "")
        values.color = Number(formData.color);

      if (isEditing && category) {
        await odooWrite("hr.employee.category", [category.id], values);
      } else {
        await odooCreate("hr.employee.category", values);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save tag";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Tag" : "New Tag"}</DialogTitle>
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
                label="Color Index"
                type="number"
                min={0}
                max={30}
                value={String(formData.color ?? "")}
                onChange={(e) =>
                  handleChange("color", e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {isEditing ? "Save Changes" : "Create Tag"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
