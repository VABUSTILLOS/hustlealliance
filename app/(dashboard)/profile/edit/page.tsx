"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUpdateProfile } from "../hooks/useSocial";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";
import clsx from "clsx";

export default function EditProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error(getErrorMsg("fetchProfile"));
      return res.json();
    },
    staleTime: 30_000,
  });

  const [form, setForm] = useState({
    displayName: profile?.profile?.displayName ?? profile?.name ?? "",
    headline: profile?.profile?.headline ?? profile?.headline ?? "",
    bio: profile?.bio ?? "",
    summary: profile?.profile?.summary ?? "",
    location: profile?.profile?.location ?? "",
    website: profile?.profile?.website ?? "",
    twitter: profile?.profile?.socialLinks?.twitter ?? "",
    linkedin: profile?.profile?.socialLinks?.linkedin ?? "",
    github: profile?.profile?.socialLinks?.github ?? "",
    instagram: profile?.profile?.socialLinks?.instagram ?? "",
    youtube: profile?.profile?.socialLinks?.youtube ?? "",
    skills: profile?.profile?.skills?.join(", ") ?? "",
    industries: profile?.profile?.industries?.join(", ") ?? "",
    yearsExperience: profile?.profile?.yearsExperience?.toString() ?? "",
  });

  // Sync form when profile loads
  if (profile && form.displayName === "") {
    setForm({
      displayName: profile.profile?.displayName ?? profile.name ?? "",
      headline: profile.profile?.headline ?? profile.headline ?? "",
      bio: profile.bio ?? "",
      summary: profile.profile?.summary ?? "",
      location: profile.profile?.location ?? "",
      website: profile.profile?.website ?? "",
      twitter: profile.profile?.socialLinks?.twitter ?? "",
      linkedin: profile.profile?.socialLinks?.linkedin ?? "",
      github: profile.profile?.socialLinks?.github ?? "",
      instagram: profile.profile?.socialLinks?.instagram ?? "",
      youtube: profile.profile?.socialLinks?.youtube ?? "",
      skills: profile.profile?.skills?.join(", ") ?? "",
      industries: profile.profile?.industries?.join(", ") ?? "",
      yearsExperience: profile.profile?.yearsExperience?.toString() ?? "",
    });
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        displayName: form.displayName || undefined,
        headline: form.headline || undefined,
        bio: form.bio || undefined,
        summary: form.summary || undefined,
        location: form.location || undefined,
        website: form.website || undefined,
        socialLinks: {
          twitter: form.twitter,
          linkedin: form.linkedin,
          github: form.github,
          instagram: form.instagram,
          youtube: form.youtube,
        },
        skills: form.skills
          ? form.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        industries: form.industries
          ? form.industries.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        yearsExperience: form.yearsExperience
          ? parseInt(form.yearsExperience)
          : undefined,
      });
      router.push(`/profile/${currentUser.username ?? "member"}`);
    } catch {
      // Error handled by mutation state
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-surface border border-surface-light text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-accent/50 transition-colors";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-surface border border-surface-light text-muted hover:text-foreground transition-colors"
        >
          ←
        </button>
        <h1 className="font-display text-2xl text-foreground font-bold">
          {t.profile.editProfileTitle}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar / Cover placeholders */}
        <div className="bg-surface border border-surface-light rounded-2xl p-4">
          <p className="font-heading font-bold text-sm text-foreground mb-3">
            {t.profile.profilePhotoLabel}
          </p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-surface-light border border-surface-light flex items-center justify-center text-muted text-2xl">
              📷
            </div>
            <p className="text-xs text-muted">
              {t.profile.avatarUploadNote}
            </p>
          </div>
        </div>

        <div className="bg-surface border border-surface-light rounded-2xl p-4">
          <p className="font-heading font-bold text-sm text-foreground mb-3">
            {t.profile.coverPhotoLabel}
          </p>
          <div className="h-24 rounded-xl bg-gradient-to-br from-accent/20 to-surface-light flex items-center justify-center text-muted text-2xl">
            🖼️
          </div>
          <p className="text-xs text-muted mt-2">
            {t.profile.coverPhotoUploadNote}
          </p>
        </div>

        {/* Basic Info */}
        <div className="bg-surface border border-surface-light rounded-2xl p-6 space-y-5">
          <h2 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
            {t.profile.sectionBasicInfo}
          </h2>

          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              {t.profile.labelDisplayName}
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
              className={inputClass}
              placeholder={t.profile.placeholderDisplayName}
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              {t.profile.labelHeadline}
            </label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              className={inputClass}
              placeholder={t.profile.placeholderHeadline}
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              {t.profile.labelBio}
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              className={clsx(inputClass, "min-h-[100px] resize-y")}
              placeholder={t.profile.placeholderBio}
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              {t.profile.labelSummary}
            </label>
            <textarea
              value={form.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              className={clsx(inputClass, "min-h-[120px] resize-y")}
              placeholder={t.profile.placeholderSummary}
            />
          </div>
        </div>

        {/* Location & Website */}
        <div className="bg-surface border border-surface-light rounded-2xl p-6 space-y-5">
          <h2 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
            {t.profile.sectionLocationLinks}
          </h2>

          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              {t.profile.labelLocation}
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className={inputClass}
              placeholder={t.profile.placeholderLocation}
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              {t.profile.labelWebsite}
            </label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className={inputClass}
              placeholder={t.profile.placeholderWebsite}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-surface border border-surface-light rounded-2xl p-6 space-y-5">
          <h2 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
            {t.profile.sectionSocialLinks}
          </h2>

          {(["twitter", "linkedin", "github", "instagram", "youtube"] as const).map(
            (platform) => (
              <div key={platform}>
                <label className="block font-mono text-xs text-muted mb-1.5 capitalize">
                  {platform}
                </label>
                <input
                  type="text"
                  value={form[platform]}
                  onChange={(e) => handleChange(platform, e.target.value)}
                  className={inputClass}
                  placeholder={t.profile.placeholderSocialLink.replace('{platform}', platform)}
                />
              </div>
            ),
          )}
        </div>

        {/* Skills & Industries */}
        <div className="bg-surface border border-surface-light rounded-2xl p-6 space-y-5">
          <h2 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
            {t.profile.sectionSkillsExperience}
          </h2>

          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              {t.profile.labelSkillsCommaSeparated}
            </label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => handleChange("skills", e.target.value)}
              className={inputClass}
              placeholder={t.profile.placeholderSkills}
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              {t.profile.labelIndustriesCommaSeparated}
            </label>
            <input
              type="text"
              value={form.industries}
              onChange={(e) => handleChange("industries", e.target.value)}
              className={inputClass}
              placeholder={t.profile.placeholderIndustries}
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              {t.profile.labelYearsOfExperience}
            </label>
            <input
              type="number"
              value={form.yearsExperience}
              onChange={(e) => handleChange("yearsExperience", e.target.value)}
              className={inputClass}
              placeholder={t.profile.placeholderYearsOfExperience}
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="px-6 py-3 rounded-xl bg-accent text-white font-heading font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-60"
          >
            {updateProfile.isPending ? t.profile.buttonSavingProfile : t.profile.buttonSaveProfile}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl bg-surface border border-surface-light text-muted font-heading font-semibold text-sm hover:text-foreground transition-colors"
          >
            {t.profile.buttonCancel}
          </button>
        </div>

        {updateProfile.isError && (
          <p className="text-red-400 text-sm">
            {(updateProfile.error as Error)?.message ?? t.profile.errorFailedToSave}
          </p>
        )}

        {updateProfile.isSuccess && (
          <p className="text-emerald-400 text-sm">{t.profile.successProfileSaved}</p>
        )}
      </form>
    </div>
  );
}
