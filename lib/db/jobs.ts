import prisma from "@/lib/db/prisma";
import type { JobType, JobStatus, ApplicationStatus } from "@/lib/generated/prisma/client";

// ── Job Listings ────────────────────────────────────────────────────────

export interface JobFilters {
  type?: JobType;
  category?: string;
  location?: string;
  isRemote?: boolean;
  status?: JobStatus;
  limit?: number;
  cursor?: string;
}

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

export async function getJobListing(id: string) {
  return getJobById(id);
}

export async function getJobListingBySlug(slug: string) {
  return getJobBySlug(slug);
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

export async function getJobListings(filters: JobFilters = {}) {
  const where: Record<string, unknown> = { status: filters.status ?? "OPEN" };
  if (filters.type) where.type = filters.type;
  if (filters.location) where.location = { contains: filters.location, mode: "insensitive" };
  if (filters.isRemote !== undefined) where.isRemote = filters.isRemote;

  const jobs = await prisma.jobListing.findMany({
    where,
    include: {
      postedBy: { select: { id: true, name: true, avatar: true } },
      _count: { select: { applications: true } },
    },
    take: filters.limit ?? 20,
    ...(filters.cursor ? { cursor: { id: filters.cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });

  return jobs;
}

export async function listJobs(params: {
  type?: JobType;
  status?: JobStatus;
  limit?: number;
  cursor?: string;
}) {
  return getJobListings(params);
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

export async function updateJobListing(
  jobId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    type?: JobType;
    location?: string;
    isRemote?: boolean;
    salaryRange?: string;
    requirements?: string[];
    status?: JobStatus;
  },
) {
  const job = await prisma.jobListing.findUnique({ where: { id: jobId } });
  if (!job || job.postedById !== userId) throw new Error("Not authorized to update this job");

  return prisma.jobListing.update({ where: { id: jobId }, data });
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

export async function deleteJobListing(jobId: string, userId: string) {
  const job = await prisma.jobListing.findUnique({ where: { id: jobId } });
  if (!job || job.postedById !== userId) throw new Error("Not authorized to delete this job");

  return prisma.jobListing.delete({ where: { id: jobId } });
}

export async function deleteJob(id: string) {
  return prisma.jobListing.delete({ where: { id } });
}

// ── Job Categories ──────────────────────────────────────────────────────

export async function getJobCategories() {
  return Object.values(await import("@/lib/generated/prisma/client").then(m => m.JobType));
}

// ── Applications ────────────────────────────────────────────────────────

export async function applyToJob(params: {
  jobId: string;
  applicantId: string;
  coverLetter?: string;
  resumeUrl?: string;
}) {
  const job = await prisma.jobListing.findUnique({ where: { id: params.jobId } });
  if (!job) throw new Error("Job not found");
  if (job.status !== "OPEN") throw new Error("This job is no longer accepting applications");

  const existing = await prisma.jobApplication.findUnique({
    where: { jobId_applicantId: { jobId: params.jobId, applicantId: params.applicantId } },
  });
  if (existing) throw new Error("You have already applied to this job");

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
  userId?: string,
  status?: ApplicationStatus,
  limit = 50,
) {
  if (userId) {
    const job = await prisma.jobListing.findUnique({ where: { id: jobId } });
    if (!job || job.postedById !== userId) throw new Error("Not authorized to view applications");
  }

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
    include: { job: { select: { id: true, title: true, company: true, slug: true, status: true, type: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  userId: string,
  status: ApplicationStatus,
  notes?: string,
) {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: { job: { select: { postedById: true } } },
  });
  if (!application) throw new Error("Application not found");
  if (application.job.postedById !== userId) throw new Error("Not authorized to update this application");

  return prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status, ...(notes !== undefined ? { notes } : {}) },
  });
}
