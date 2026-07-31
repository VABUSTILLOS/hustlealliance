'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCreateGroup } from './hooks/useGroups';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function GroupCreator() {
  const router = useRouter();
  const { t } = useTranslation();
  const createGroup = useCreateGroup();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const group = await createGroup.mutateAsync({
        name: name.trim(),
        slug,
        description: description.trim() || undefined,
        visibility,
      });
      router.push(`/groups/${group.slug}`);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto space-y-6"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-heading font-bold text-foreground mb-2">
          Group Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.groups.namePlaceholder}
          className="w-full px-4 py-3 bg-surface border border-surface-light rounded-xl text-foreground placeholder:text-muted outline-none focus:border-accent/40 transition-colors"
          required
        />
        {name && (
          <p className="text-[10px] text-muted font-mono mt-1">
            Slug: {slug}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-heading font-bold text-foreground mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.groups.descriptionPlaceholder}
          rows={4}
          className="w-full px-4 py-3 bg-surface border border-surface-light rounded-xl text-foreground placeholder:text-muted outline-none focus:border-accent/40 transition-colors resize-none"
        />
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-heading font-bold text-foreground mb-2">
          Visibility
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['PUBLIC', 'PRIVATE', 'HIDDEN'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVisibility(v)}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase border transition-all ${
                visibility === v
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-surface border-surface-light text-muted hover:border-accent/20'
              }`}
            >
              {v.charAt(0) + v.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted mt-2">
          {visibility === 'PUBLIC' && 'Anyone can join. Visible in directory.'}
          {visibility === 'PRIVATE' && 'Members must be approved or invited. Visible in directory.'}
          {visibility === 'HIDDEN' && 'Invite only. Not visible in directory.'}
        </p>
      </div>

      {/* Error */}
      {createGroup.isError && (
        <p className="text-red-400 text-xs font-mono">
          {(createGroup.error as Error)?.message || 'Failed to create group'}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!name.trim() || createGroup.isPending}
        className="w-full px-6 py-3 rounded-xl bg-accent text-foreground font-heading font-bold text-sm uppercase transition-all hover:bg-accent-glow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createGroup.isPending ? 'Creating...' : 'Create Group'}
      </button>
    </motion.form>
  );
}
