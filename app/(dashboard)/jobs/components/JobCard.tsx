import Link from "next/link";
import { MapPin, Clock, Briefcase, Building2 } from "lucide-react";
import type { JobListing } from "@/lib/generated/prisma/client";

const TYPE_BADGE: Record<string, string> = {
  FULL_TIME: "bg-blue-100 text-blue-800",
  PART_TIME: "bg-purple-100 text-purple-800",
  CONTRACT: "bg-orange-100 text-orange-800",
  INTERNSHIP: "bg-green-100 text-green-800",
  CO_FOUNDER: "bg-yellow-100 text-yellow-800",
};

const TYPE_LABEL: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  CO_FOUNDER: "Co-Founder",
};

type JobWithMeta = JobListing & {
  postedBy: { id: string; name: string; avatar: string | null };
  _count: { applications: number };
};

export function JobCard({ job }: { job: JobWithMeta }) {
  const timeAgo = getTimeAgo(new Date(job.createdAt));

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="block rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            {job.postedBy.avatar ? (
              <img src={job.postedBy.avatar} alt="" className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <Building2 className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
            <p className="text-sm text-gray-500 truncate">{job.company}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${TYPE_BADGE[job.type] || "bg-gray-100 text-gray-800"}`}>
          {TYPE_LABEL[job.type] || job.type}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
        )}
        {job.isRemote && (
          <span className="flex items-center gap-1 text-green-600">
            <Briefcase className="w-3.5 h-3.5" />
            Remote
          </span>
        )}
        {job.salaryRange && (
          <span className="font-medium text-gray-700">{job.salaryRange}</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </span>
        <span>{job._count.applications} application{job._count.applications !== 1 ? "s" : ""}</span>
      </div>
    </Link>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
