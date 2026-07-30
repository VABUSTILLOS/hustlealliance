"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Briefcase } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useMyApplications } from "../components/hooks/useJobs";
import { ApplicationStatusBadge } from "../components/ApplicationStatusBadge";

export default function ApplicationsPage() {
  const { t } = useTranslation();
  const { data: applications, isLoading, error } = useMyApplications();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.jobs.backToJobs}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          {t.jobs.myApplicationsHeading}
        </h1>
        <p className="text-gray-500 mt-1">{t.jobs.myApplicationsSubtitle}</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {t.jobs.loadApplicationsError}
        </div>
      )}

      {applications?.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-2xl border">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">{t.jobs.noApplicationsYet}</h3>
          <p className="text-gray-500 mt-1 mb-4">{t.jobs.noApplicationsSubtext}</p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            {t.jobs.browseJobsButton}
          </Link>
        </div>
      )}

      {applications?.length > 0 && (
        <div className="space-y-3">
          {applications.map((app: Record<string, unknown> & { id: string }) => (
            <Link
              key={app.id}
              href={`/jobs/${(app.job as { slug: string })?.slug || "#"}`}
              className="block bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {(app.job as { title?: string })?.title || t.jobs.unknownPosition}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {(app.job as { company?: string })?.company || t.jobs.unknownCompany}
                  </p>
                </div>
                <ApplicationStatusBadge status={app.status as Parameters<typeof ApplicationStatusBadge>[0]["status"]} />
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                <span>{t.jobs.postedLabel} {new Date(app.createdAt as string).toLocaleDateString()}</span>
                {(app.coverLetter as string) && <span>{t.jobs.coverLetterIncluded}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
