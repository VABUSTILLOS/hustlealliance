"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Plus, FileText } from "lucide-react";
import { JobCard } from "./components/JobCard";
import { JobFilters, type JobFilterValues } from "./components/JobFilters";
import { useJobs } from "./components/hooks/useJobs";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function JobsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<JobFilterValues>({
    search: "",
    type: "",
    location: "",
    isRemote: false,
  });

  const { data: jobs, isLoading, error } = useJobs({
    search: filters.search || undefined,
    type: filters.type || undefined,
    location: filters.location || undefined,
    isRemote: filters.isRemote || undefined,
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            {t.jobs.pageTitle}
          </h1>
          <p className="text-gray-500 mt-1">{t.jobs.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/jobs/applications"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            {t.jobs.myApplicationsButton}
          </Link>
          <Link
            href="/jobs/create"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.jobs.postJobButton}
          </Link>
        </div>
      </div>

      <JobFilters filters={filters} onChange={setFilters} />

      <div className="mt-6 space-y-4">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {t.jobs.loadJobsError}
          </div>
        )}

        {jobs?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">{t.jobs.noJobsFound}</h3>
            <p className="text-gray-500 mt-1">{t.jobs.noJobsFoundSubtext}</p>
          </div>
        )}

        {jobs?.map((job: { id: string } & Record<string, unknown>) => (
          <JobCard key={job.id} job={job as Parameters<typeof JobCard>[0]["job"]} />
        ))}
      </div>
    </div>
  );
}
