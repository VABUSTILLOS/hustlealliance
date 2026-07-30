"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { JobType } from "@/lib/generated/prisma/client";

export interface JobFilterValues {
  search: string;
  type: string;
  location: string;
  isRemote: boolean;
}

interface JobFiltersProps {
  filters: JobFilterValues;
  onChange: (filters: JobFilterValues) => void;
}

export function JobFilters({ filters, onChange }: JobFiltersProps) {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const jobTypes: { value: JobType | ""; label: string }[] = [
    { value: "", label: t.jobs.allTypesFilter },
    { value: "FULL_TIME", label: t.jobs.jobTypeFullTime },
    { value: "PART_TIME", label: t.jobs.jobTypePartTime },
    { value: "CONTRACT", label: t.jobs.jobTypeContract },
    { value: "INTERNSHIP", label: t.jobs.jobTypeInternship },
    { value: "CO_FOUNDER", label: t.jobs.jobTypeCoFounder },
  ];

  const update = (patch: Partial<JobFilterValues>) => {
    onChange({ ...filters, ...patch });
  };

  const clear = () => {
    onChange({ search: "", type: "", location: "", isRemote: false });
  };

  const hasActiveFilters = filters.type || filters.location || filters.isRemote;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t.jobs.searchPlaceholder}
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${
            showFilters || hasActiveFilters
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t.jobs.filtersButton}
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <select
            value={filters.type}
            onChange={(e) => update({ type: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {jobTypes.map((jobType) => (
              <option key={jobType.value} value={jobType.value}>{jobType.label}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder={t.jobs.locationPlaceholder}
            value={filters.location}
            onChange={(e) => update({ location: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isRemote}
              onChange={(e) => update({ isRemote: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {t.jobs.remoteOnlyFilter}
          </label>

          {hasActiveFilters && (
            <button
              onClick={clear}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              {t.jobs.clearFiltersButton}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
