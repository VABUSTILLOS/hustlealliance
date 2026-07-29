"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MapPin, Briefcase, Clock, Building2, Share2, Send } from "lucide-react";
import { useJob, useApplyToJob } from "../components/hooks/useJobs";
import { ApplicationForm } from "../components/ApplicationForm";

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: job, isLoading, error } = useJob(slug);
  const applyMutation = useApplyToJob(job?.id ?? "");
  const [showApplication, setShowApplication] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async (data: { coverLetter?: string; resumeUrl?: string }) => {
    await applyMutation.mutateAsync(data);
    setApplied(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-gray-900">Job not found</h2>
        <Link href="/jobs" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to jobs board
        </Link>
      </div>
    );
  }

  const TYPE_LABEL: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    CO_FOUNDER: "Co-Founder",
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </Link>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                {job.postedBy?.avatar ? (
                  <img src={job.postedBy.avatar} alt="" className="w-14 h-14 rounded-xl object-cover" />
                ) : (
                  <Building2 className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-gray-600">{job.company}</p>
              </div>
            </div>
            <span className="flex-shrink-0 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {TYPE_LABEL[job.type] || job.type}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            )}
            {job.isRemote && (
              <span className="flex items-center gap-1.5 text-green-600">
                <Briefcase className="w-4 h-4" />
                Remote
              </span>
            )}
            {job.salaryRange && (
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                {job.salaryRange}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Send className="w-4 h-4" />
              {job._count?.applications ?? 0} application{(job._count?.applications ?? 0) !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="border-t p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {job.description}
          </div>

          {job.requirements?.length > 0 && (
            <>
              <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {job.requirements.map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="border-t p-6 sm:p-8 bg-gray-50 flex flex-col sm:flex-row gap-3">
          {job.status === "OPEN" && !applied ? (
            <button
              onClick={() => setShowApplication(true)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
              Apply Now
            </button>
          ) : applied ? (
            <div className="flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl">
              ✓ Application Submitted
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-500 bg-gray-100 rounded-xl">
              Applications Closed
            </div>
          )}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border hover:bg-gray-50 rounded-xl transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <ApplicationForm
        jobTitle={job.title}
        isOpen={showApplication}
        onClose={() => setShowApplication(false)}
        onSubmit={handleApply}
      />

      {/* Related jobs section placeholder */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">More from {job.company}</h3>
        <Link
          href={`/jobs?search=${encodeURIComponent(job.company)}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View all jobs from {job.company} →
        </Link>
      </div>
    </div>
  );
}
