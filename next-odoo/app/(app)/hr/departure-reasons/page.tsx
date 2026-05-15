"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  LogOut,
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
import type { DepartureReason } from "@/app/types/odoo";
import DepartureReasonForm from "./departure-reason-form";

const PAGE_SIZE = 20;

export default function DepartureReasonsPage() {
  const [reasons, setReasons] = useState<DepartureReason[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DepartureReason | null>(null);
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

        const result = await odooSearchRead<DepartureReason>("hr.departure.reason", {
          domain,
          fields: ["id", "name", "sequence", "country_id"],
          offset: (currentPage - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
          order: "sequence ASC, name ASC",
        });

        if (!cancelled) {
          setReasons(result.records);
          setTotalCount(result.length);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch departure reasons";
        if (!cancelled) setError(message);
        console.error("Failed to fetch departure reasons:", err);
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

  if (isLoading && reasons.length === 0 && !error) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Departure Reasons
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {totalCount} reasons
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setFormOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Reason
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search reasons..."
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
            <p className="font-medium">Failed to load departure reasons</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {error ? null : reasons.length === 0 ? (
        <EmptyState
          icon={<LogOut className="h-6 w-6" />}
          title="No departure reasons found"
          description="Try adjusting your search."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="group h-full p-5 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                        <LogOut className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {r.name}
                        </h3>
                        {r.country_id && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {r.country_id[1]}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setEditingItem(r);
                        setFormOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
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
      <DepartureReasonForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSuccess={() => {
          setCurrentPage(1);
          setRefreshKey((k) => k + 1);
        }}
        reason={editingItem}
      />
    </div>
  );
}
