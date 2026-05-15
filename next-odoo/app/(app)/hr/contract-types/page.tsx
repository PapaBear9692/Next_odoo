"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  FileText,
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
import type { ContractType } from "@/app/types/odoo";
import ContractTypeForm from "./contract-type-form";

const PAGE_SIZE = 20;

export default function ContractTypesPage() {
  const [types, setTypes] = useState<ContractType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContractType | null>(null);
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

        const result = await odooSearchRead<ContractType>("hr.contract.type", {
          domain,
          fields: ["id", "name", "code", "sequence", "country_id"],
          offset: (currentPage - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
          order: "sequence ASC, name ASC",
        });

        if (!cancelled) {
          setTypes(result.records);
          setTotalCount(result.length);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch contract types";
        if (!cancelled) setError(message);
        console.error("Failed to fetch contract types:", err);
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

  if (isLoading && types.length === 0 && !error) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Contract Types
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {totalCount} types
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setFormOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Type
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search contract types..."
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
            <p className="font-medium">Failed to load contract types</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {error ? null : types.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No contract types found"
          description="Try adjusting your search."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="group h-full p-5 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {t.name}
                        </h3>
                        {t.code && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Code: {t.code}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setEditingItem(t);
                        setFormOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                  {t.country_id && (
                    <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Country:{" "}
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {t.country_id[1]}
                        </span>
                      </p>
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
      <ContractTypeForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSuccess={() => {
          setCurrentPage(1);
          setRefreshKey((k) => k + 1);
        }}
        contractType={editingItem}
      />
    </div>
  );
}
