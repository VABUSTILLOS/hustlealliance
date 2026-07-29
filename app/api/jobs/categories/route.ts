import { NextResponse } from "next/server";
import { JobType } from "@/lib/generated/prisma/client";

const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  CO_FOUNDER: "Co-Founder",
};

export async function GET() {
  const categories = Object.values(JobType).map((type) => ({
    value: type,
    label: JOB_TYPE_LABELS[type] || type,
  }));

  return NextResponse.json(categories);
}
