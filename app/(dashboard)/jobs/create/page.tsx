"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useCreateJob } from "../components/hooks/useJobs";

export default function CreateJobPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const createJob = useCreateJob();
  const [error, setError] = useState("");
  const jobTypes = [
    { value: "FULL_TIME", label: t.jobs.jobTypeFullTime },
    { value: "PART_TIME", label: t.jobs.jobTypePartTime },
    { value: "CONTRACT", label: t.jobs.jobTypeContract },
    { value: "INTERNSHIP", label: t.jobs.jobTypeInternship },
    { value: "CO_FOUNDER", label: t.jobs.jobTypeCoFounder },
  ];

  const [form, setForm] = useState({
    title: "",
    company: "",
    slug: "",
    description: "",
    type: "FULL_TIME",
    location: "",
    isRemote: false,
    salaryRange: "",
    requirements: "",
    applicationUrl: "",
    contactEmail: "",
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title
      if (field === "title") {
        updated.slug = (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.company || !form.description) {
      setError(t.jobs.createValidationError);
      return;
    }

    try {
      const result = await createJob.mutateAsync({
        title: form.title,
        company: form.company,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: form.description,
        type: form.type,
        location: form.location || undefined,
        isRemote: form.isRemote,
        salaryRange: form.salaryRange || undefined,
        requirements: form.requirements
          ? form.requirements.split("\n").filter((r) => r.trim())
          : [],
        applicationUrl: form.applicationUrl || undefined,
        contactEmail: form.contactEmail || undefined,
      });
      router.push(`/jobs/${result.slug}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.jobs.backToJobs}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-blue-600" />
        {t.jobs.postJobHeading}
      </h1>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border p-6 sm:p-8 shadow-sm">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobs.jobTitleLabel}</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={t.jobs.jobTitlePlaceholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobs.companyLabel}</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder={t.jobs.companyPlaceholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobs.slugLabel}</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            placeholder={t.jobs.slugPlaceholder}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobs.descriptionLabel}</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={6}
            placeholder={t.jobs.descriptionPlaceholder}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobs.jobTypeLabel}</label>
            <select
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {jobTypes.map((jobType) => (
                <option key={jobType.value} value={jobType.value}>{jobType.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobs.locationLabel}</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder={t.jobs.locationPlaceholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isRemote}
              onChange={(e) => handleChange("isRemote", e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {t.jobs.remotePositionCheckbox}
          </label>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobs.salaryRangeLabel}</label>
            <input
              type="text"
              value={form.salaryRange}
              onChange={(e) => handleChange("salaryRange", e.target.value)}
              placeholder={t.jobs.salaryRangePlaceholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.jobs.requirementsHeading} <span className="text-gray-400">{t.jobs.requirementsHelper}</span>
          </label>
          <textarea
            value={form.requirements}
            onChange={(e) => handleChange("requirements", e.target.value)}
            rows={4}
            placeholder={t.jobs.requirementsPlaceholder}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobs.applicationUrlLabel}</label>
            <input
              type="url"
              value={form.applicationUrl}
              onChange={(e) => handleChange("applicationUrl", e.target.value)}
              placeholder={t.jobs.applicationUrlPlaceholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobs.contactEmailLabel}</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              placeholder={t.jobs.contactEmailPlaceholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={createJob.isPending}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {createJob.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.jobs.postingButton}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {t.jobs.postJobButton}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
