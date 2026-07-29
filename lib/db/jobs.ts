import prisma from "@/lib/db/prisma";
import type { JobType, JobStatus, ApplicationStatus } from "@/lib/generated/prisma/client";

// ── Job Listings ────────────────────────────────────────────────────────

export async function createJob(params: {
  title: string;
  company: string;
  slug: string;
  description: string;
  type?: JobType;
  location?: string;
  isRemote?: boolean;
  salaryRange?: string;
  requirements?: string[];
  applicationUrl?: string;
  contactEmail?: string;
  postedById: string;
  expiresAt?: Date;
}) {
  return prisma.jobListing.create({
    data: {
      title: params.title,
      company: params.company,
      slug: params.slug,
      description: params.description,
      type: params.type ?? "FULL_TIME",
      location: params.location ?? null,
      isRemote: params.isRemote ?? false,
      salaryRange: params.salaryRange ?? null,
      requirements: params.requirements ?? [],
      applicationUrl: params.applicationUrl ?? null,
      contactEmail: params.contactEmail ?? null,
      postedById: params.postedById,
      expiresAt: params.expiresAt ?? null,
    },
    include: {
      postedBy: { select: { id: true, name: true, avatar: true } },
    },
  });
}

export async function getJobBySlug(slug: string) {
  return prisma.jobListing.findUnique({
    where: { slug },
    include: {
      postedBy: { select: { id: true, name: true, avatar: true, headline: true } },
      _count: { select: { applications: true } },
    },
  });
}

export async function getJobById(id: string) {
  return prisma.jobListing.findUnique({
    where: { id },
    include: {
      postedBy: { select: { id: true, name: true, avatar: true, headline: true } },
      _count: { select: { applications: true } },
    },
  });
}

export async function listJobs(params: {
  type?: JobType;
  status?: JobStatus;
  limit?: number;
  cursor?: string;
}) {
  const where: Record<string, unknown> = { status: params.status ?? "OPEN" };
  if (params.type) where.type = params.type;

  return prisma.jobListing.findMany({
    where,
    include: {
      postedBy: { select: { id: true, name: true, avatar: true } },
      _count: { select: { applications: true } },
    },
    take: params.limit ?? 20,
    ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserJobs(userId: string) {
  return prisma.jobListing.findMany({
    where: { postedById: userId },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function searchJobs(query: string, limit = 20) {
  return prisma.jobListing.findMany({
    where: {
      status: "OPEN",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { postedBy: { select: { id: true, name: true, avatar: true } } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateJob(id: string, data: {
  title?: string;
  description?: string;
  type?: JobType;
  location?: string;
  isRemote?: boolean;
  salaryRange?: string;
  requirements?: string[];
  status?: JobStatus;
}) {
  return prisma.jobListing.update({ where: { id }, data });
}

export async function deleteJob(id: string) {
  return prisma.jobListing.delete({ where: { id } });
}

// ── Applications ────────────────────────────────────────────────────────

export async function applyToJob(params: {
  jobId: string;
  applicantId: string;
  coverLetter?: string;
  resumeUrl?: string;
}) {
  const [application] = await prisma.$transaction([
    prisma.jobApplication.create({
      data: {
        jobId: params.jobId,
        applicantId: params.applicantId,
        coverLetter: params.coverLetter ?? null,
        resumeUrl: params.resumeUrl ?? null,
      },
    }),
    prisma.jobListing.update({
      where: { id: params.jobId },
      data: { applicantCount: { increment: 1 } },
    }),
  ]);
  return application;
}

export async function getJobApplications(
  jobId: string,
  status?: ApplicationStatus,
  limit = 50,
) {
  return prisma.jobApplication.findMany({
    where: { jobId, ...(status ? { status } : {}) },
    include: { applicant: { select: { id: true, name: true, avatar: true, headline: true } } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserApplications(userId: string) {
  return prisma.jobApplication.findMany({
    where: { applicantId: userId },
    include: { job: { select: { id: true, title: true, company: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string,
) {
  return prisma.jobApplication.update({
    where: { id },
    data: { status, ...(notes !== undefined ? { notes } : {}) },
  });
}
