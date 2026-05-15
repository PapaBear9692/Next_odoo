"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  MapPin,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { PageLoader } from "@/app/components/ui/loading";
import { EmptyState } from "@/app/components/ui/empty-state";
import { odooSearchRead } from "@/app/lib/odoo/client";
import type { WorkLocation } from "@/app/types/odoo";
import WorkLocationForm from "./work-location-form";

const PAGE_SIZE = 20;

export default function WorkLocationsPage() {
  const [locations, setLocations] = useState<WorkLocation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkLocation | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const domain: unknown[][] = [["active", "=", true]];
        if (searchQuery) {
          domain.push(["name", "ilike", searchQuery]);
        }

        const result = await odooSearchRead<WorkLocation>("hr.work.location", {
          domain,
          fields: [
            "id",
            "name",
            "active",
            "company_id",
            "location_type",
            "address_id",
            "location_number",
          ],
          offset: (currentPage - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
          order: "name ASC",
        });

        if (!cancelled) {
          setLocations(result.records);
          setTotalCount(result.length);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch work locations";
        if (!cancelled) setError(message);
        console.error("Failed to fetch work locations:", err);
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

  if (isLoading && locations.length === 0 && !error) {
    return <PageLoader />;
  }

  const typeLabels: Record<string, string> = {
    home: "Home",
    office: "Office",
    other: "Other",
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Work Locations
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {totalCount} locations
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setFormOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Location
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search locations..."
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
            <p className="font-medium">Failed to load work locations</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {error ? null : locations.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title="No work locations found"
          description="Try adjusting your search."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="group h-full p-5 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {loc.name}
                        </h3>
                        {loc.address_id && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {loc.address_id[1]}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setEditingItem(loc);
                        setFormOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {loc.location_type && (
                      <Badge variant="default">
                        {typeLabels[loc.location_type] || loc.location_type}
                      </Badge>
                    )}
                    {loc.location_number && (
                      <Badge variant="info">
                        {loc.location_number}
                      </Badge>
                    )}
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
      <WorkLocationForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSuccess={() => {
          setCurrentPage(1);
          setRefreshKey((k) => k + 1);
        }}
        location={editingItem}
      />
    </div>
  );
}
