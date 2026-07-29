'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  useGroup,
  useGroupMembers,
  useUpdateGroup,
  useDeleteGroup,
  useUpdateMemberRole,
  useRemoveMember,
  useInviteToGroup,
} from '../../components/hooks/useGroups';
import { MemberList } from '../../components/MemberList';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function GroupSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { t } = useTranslation();

  const { data: group, isLoading } = useGroup(slug);
  const { data: members } = useGroupMembers(group?.id ?? '');

  const updateGroup = useUpdateGroup(group?.id ?? '');
  const deleteGroup = useDeleteGroup(group?.id ?? '');
  const updateRole = useUpdateMemberRole(group?.id ?? '');
  const removeMember = useRemoveMember(group?.id ?? '');
  const inviteToGroup = useInviteToGroup(group?.id ?? '');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [inviteUserId, setInviteUserId] = useState('');

  // Sync form when group loads
  const formReady = group && name === '' && description === '' && visibility === '';
  if (formReady) {
    setName(group.name);
    setDescription(group.description ?? '');
    setVisibility(group.visibility);
  }

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-xl mx-auto animate-pulse">
        <div className="h-8 bg-surface-light rounded w-1/3 mb-6" />
        <div className="space-y-4">
          <div className="h-12 bg-surface-light rounded-xl" />
          <div className="h-24 bg-surface-light rounded-xl" />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-foreground mb-4">{t.spaces.notFound}</h1>
        <Link href="/groups" className="text-accent font-mono text-sm hover:underline">
          ← {t.spaces.backToSpaces}
        </Link>
      </div>
    );
  }

  const isAdmin = group.currentUserRole === 'OWNER' || group.currentUserRole === 'ADMIN';
  if (!isAdmin) {
    router.replace(`/groups/${slug}`);
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGroup.mutateAsync({
      name: name.trim(),
      description: description.trim() || null,
      visibility,
    });
  };

  const handleDelete = async () => {
    await deleteGroup.mutateAsync();
    router.push('/groups');
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteUserId.trim()) return;
    await inviteToGroup.mutateAsync(inviteUserId.trim());
    setInviteUserId('');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-xl mx-auto">
      {/* Back */}
      <Link
        href={`/groups/${slug}`}
        className="inline-flex items-center gap-1 text-muted font-mono text-xs hover:text-accent mb-6 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Group
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl text-foreground uppercase mb-8">Group Settings</h1>

        {/* Edit details */}
        <form onSubmit={handleUpdate} className="bg-surface border border-surface-light rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="font-heading font-bold text-foreground text-lg mb-2">Details</h2>

          <div>
            <label className="block text-xs font-mono text-muted mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-sm text-foreground outline-none focus:border-accent/30"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-sm text-foreground outline-none focus:border-accent/30 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted mb-1">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-sm text-muted outline-none focus:border-accent/30"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={updateGroup.isPending}
            className="px-5 py-2 rounded-xl bg-accent text-foreground font-heading font-bold text-sm uppercase hover:bg-accent-glow transition-all disabled:opacity-50"
          >
            {updateGroup.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Invite member */}
        {group.visibility !== 'PUBLIC' && (
          <div className="bg-surface border border-surface-light rounded-2xl p-6 mb-6">
            <h2 className="font-heading font-bold text-foreground text-lg mb-3">Invite Member</h2>
            <form onSubmit={handleInvite} className="flex gap-2">
              <input
                type="text"
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
                placeholder="User ID to invite"
                className="flex-1 px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted outline-none focus:border-accent/30"
              />
              <button
                type="submit"
                disabled={!inviteUserId.trim() || inviteToGroup.isPending}
                className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold uppercase hover:bg-accent/20 transition-colors disabled:opacity-50"
              >
                Invite
              </button>
            </form>
            {inviteToGroup.isError && (
              <p className="text-red-400 text-xs mt-2">{(inviteToGroup.error as Error)?.message}</p>
            )}
          </div>
        )}

        {/* Manage members */}
        {members && (
          <div className="bg-surface border border-surface-light rounded-2xl p-6 mb-6">
            <h2 className="font-heading font-bold text-foreground text-lg mb-3">
              Members ({members.length})
            </h2>
            <MemberList
              members={members}
              currentUserRole={group.currentUserRole}
              onRoleChange={(userId, role) => updateRole.mutate({ userId, role })}
              onRemove={(userId) => removeMember.mutate(userId)}
            />
          </div>
        )}

        {/* Danger zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <h2 className="font-heading font-bold text-red-400 text-lg mb-2">Danger Zone</h2>
          <p className="text-muted text-sm mb-4">
            Deleting this group is permanent and cannot be undone. All posts, memberships, and data will be removed.
          </p>
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase hover:bg-red-500/10 transition-colors"
            >
              Delete Group
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteGroup.isPending}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-mono font-bold uppercase hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteGroup.isPending ? 'Deleting...' : 'Confirm Delete'}
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 rounded-lg border border-surface-light text-muted text-xs font-mono hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
