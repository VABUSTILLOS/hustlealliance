import { Clock, Check, Eye, X, MessageCircle } from "lucide-react";
import type { ApplicationStatus } from "@/lib/generated/prisma/client";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string; icon: React.ReactNode }> = {
  SUBMITTED: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="w-3 h-3" />,
  },
  REVIEWING: {
    label: "Reviewed",
    className: "bg-blue-100 text-blue-800",
    icon: <Eye className="w-3 h-3" />,
  },
  INTERVIEW: {
    label: "Interview",
    className: "bg-purple-100 text-purple-800",
    icon: <MessageCircle className="w-3 h-3" />,
  },
  OFFERED: {
    label: "Accepted",
    className: "bg-green-100 text-green-800",
    icon: <Check className="w-3 h-3" />,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800",
    icon: <X className="w-3 h-3" />,
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "bg-gray-100 text-gray-800",
    icon: <X className="w-3 h-3" />,
  },
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.SUBMITTED;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
