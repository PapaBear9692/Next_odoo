"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Tag,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { PageLoader } from "@/app/components/ui/loading";
import { EmptyState } from "@/app/components/ui/empty-state";
import { odooSearchRead } from "@/app/lib/odoo/client";
import type { EmployeeCategory } from "@/app/types/odoo";
import CategoryForm from "./category-form";

const PAGE_SIZE = 20;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<EmployeeCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmployeeCategory | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const domain: unknown[][] = [];
        if (searchQuery) {
          domain.push(["name", "ilike", searchQuery]);
        }

        const result = await odooSearchRead<EmployeeCategory>("hr.employee.category", {
          domain,
          fields: ["id", "name", "color", "employee_ids"],
          offset: (currentPage - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
          order: "name ASC",
        });

        if (!cancelled) {
          setCategories(result.records);
          setTotalCount(result.length);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch categories";
        if (!cancelled) setError(message);
        console.error("Failed to fetch categories:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [searchQuery, currentPage, refreshKey]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (isLoading && categories.length === 0 && !error) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Employee Tags
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {totalCount} tags
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setFormOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Tag
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search tags..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </Card>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Failed to load tags</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {error ? null : categories.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-6 w-6" />}
          title="No tags found"
          description="Try adjusting your search."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="group h-full p-5 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{
                          backgroundColor: cat.color
                            ? `hsl(${(cat.color * 30) % 360}, 70%, 50%)`
                            : "#6366f1",
                        }}
                      >
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {cat.name}
                        </h3>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setEditingItem(cat);
                        setFormOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>

                  {cat.employee_ids && cat.employee_ids.length > 0 && (
                    <div className="mt-4 flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                      <Users className="h-4 w-4" />
                      <span>{cat.employee_ids.length} employees</span>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      <CategoryForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSuccess={() => {
          setCurrentPage(1);
          setRefreshKey((k) => k + 1);
        }}
        category={editingItem}
      />
    </div>
  );
}
