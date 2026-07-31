"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

interface JobFilters {
  search?: string;
  type?: string;
  location?: string;
  isRemote?: boolean;
}

export function useJobs(filters: JobFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("query", filters.search);
  if (filters.type) params.set("type", filters.type);
  if (filters.location) params.set("location", filters.location);
  if (filters.isRemote) params.set("isRemote", "true");

  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchJobs"));
      return res.json();
    },
  });
}

export function useJob(slug: string) {
  return useQuery({
    queryKey: ["job", slug],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${slug}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchJob"));
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(getErrorMsg("createJob"));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useApplyToJob(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { coverLetter?: string; resumeUrl?: string }) => {
      const res = await fetch(`/api/jobs/${jobId}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || getErrorMsg("applyJob"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", "applications"] });
    },
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/applications");
      if (!res.ok) throw new Error(getErrorMsg("fetchApplications"));
      return res.json();
    },
  });
}

export function useJobCategories() {
  return useQuery({
    queryKey: ["job-categories"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/categories");
      if (!res.ok) throw new Error(getErrorMsg("fetchCategories"));
      return res.json();
    },
    staleTime: Infinity,
  });
}
