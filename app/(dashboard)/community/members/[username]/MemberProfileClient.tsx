'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { MemberProfile } from '@/lib/db/community';
import { toggleFollow, addToList, createList, getLists, removeFromList } from './actions';
import { useTranslation } from '@/lib/i18n/useTranslation';

const tierBadgeClass: Record<string, string> = {
  PRO: 'bg-accent text-white',
  BASIC: 'bg-surface-light text-foreground-muted',
  FREE: 'bg-transparent text-muted border border-white/5',
};

export function MemberProfileClient({
  profile,
  isFollowing: initialFollowing,
  currentUserId,
}: {
  profile: MemberProfile;
  isFollowing: boolean;
  currentUserId?: string;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [following, setFollowing] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(profile.followerCount);
  const [showListModal, setShowListModal] = useState(false);
  const [lists, setLists] = useState<{ id: string; name: string; _count: { items: number } }[]>([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(false);
  const [listNote, setListNote] = useState('');
  const [addedMessage, setAddedMessage] = useState('');

  const handleFollow = useCallback(async () => {
    if (!currentUserId) return;
    setFollowing(!following);
    setFollowerCount((c: number) => following ? c - 1 : c + 1);
    await toggleFollow(profile.id);
    router.refresh();
  }, [currentUserId, following, profile.id, router]);

  const openListModal = useCallback(async () => {
    if (!currentUserId) return;
    setShowListModal(true);
    const userLists = await getLists();
    setLists(userLists);
  }, [currentUserId]);

  const handleAddToList = useCallback(async (listId: string) => {
    if (!currentUserId || loading) return;
    setLoading(true);
    await addToList(profile.id, listId, listNote || undefined);
    setAddedMessage(`✓ ${t.community.addToListTitle}`);
    setTimeout(() => { setAddedMessage(''); setShowListModal(false); setListNote(''); }, 1500);
    setLoading(false);
  }, [currentUserId, profile.id, listNote, loading, t.community.addToListTitle]);

  const handleCreateAndAdd = useCallback(async () => {
    if (!currentUserId || !newListName.trim() || loading) return;
    setLoading(true);
    const listId = await createList(newListName.trim());
    await addToList(profile.id, listId, listNote || undefined);
    setAddedMessage(`✓ ${t.community.createAndAdd}: "${newListName}"`);
    setTimeout(() => { setAddedMessage(''); setShowListModal(false); setNewListName(''); setListNote(''); }, 1500);
    setLoading(false);
  }, [currentUserId, profile.id, newListName, listNote, loading, t.community.createAndAdd]);

  const isOwnProfile = currentUserId === profile.id;

  return (
    <>
      {/* Header */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-surface-light overflow-hidden shrink-0 border-2 border-white/5">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-foreground-muted uppercase">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Name + Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="font-display text-2xl sm:text-3xl text-white uppercase leading-tight">
                {profile.name}
              </h1>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${tierBadgeClass[profile.membershipTier] || tierBadgeClass.FREE}`}>
                {profile.membershipTier}
              </span>
              {profile.role !== 'STUDENT' && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                  {profile.role === 'INSTRUCTOR' ? t.community.roleInstructor : t.community.roleAdmin}
                </span>
              )}
            </div>
            <p className="text-sm text-muted font-mono">@{profile.username}</p>

            {profile.headline && (
              <p className="mt-2 text-foreground-muted text-sm font-medium">
                {profile.headline}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-muted font-mono">
              {profile.location && <span>📍 {profile.location}</span>}
              {profile.yearsExperience && <span>🕐 {profile.yearsExperience}{t.community.yearsExperience}</span>}
              <span>{t.community.joined} {new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="text-center">
                <span className="font-display text-lg text-white">{followerCount}</span>
                <span className="block text-[10px] text-muted font-mono uppercase">{t.community.statsFollowers}</span>
              </div>
              <div className="text-center">
                <span className="font-display text-lg text-white">{profile.followingCount}</span>
                <span className="block text-[10px] text-muted font-mono uppercase">{t.community.statsFollowing}</span>
              </div>
              <div className="text-center">
                <span className="font-display text-lg text-white">{profile.postCount}</span>
                <span className="block text-[10px] text-muted font-mono uppercase">{t.community.statsPosts}</span>
              </div>
              <div className="text-center">
                <span className="font-display text-lg text-white">{profile.commentCount}</span>
                <span className="block text-[10px] text-muted font-mono uppercase">{t.community.commentsLabel}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {currentUserId && !isOwnProfile && (
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={handleFollow}
                className={`px-6 py-2.5 rounded-xl font-mono text-sm font-bold transition-all ${
                  following
                    ? 'bg-surface-light text-foreground-muted border border-white/5 hover:border-red-400 hover:text-red-400'
                    : 'bg-accent text-white hover:opacity-90'
                }`}
              >
                {following ? t.community.following : t.community.follow}
              </button>
              <button
                onClick={openListModal}
                className="px-6 py-2.5 rounded-xl font-mono text-sm font-bold bg-surface-light text-foreground-muted border border-white/5 hover:border-accent hover:text-accent transition-all"
              >
                {t.community.addToList}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bio + Business */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 space-y-6">
          {/* Bio */}
          {profile.bio && (
            <section className="bg-surface border border-white/5 rounded-2xl p-6">
              <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-muted mb-3">{t.community.about}</h2>
              <p className="text-white leading-relaxed">{profile.bio}</p>
            </section>
          )}

          {/* Business Info */}
          {profile.businessInfo && (
            <section className="bg-surface border border-white/5 rounded-2xl p-6">
              <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-muted mb-3">{t.community.business}</h2>
              <p className="text-white leading-relaxed">{profile.businessInfo}</p>
            </section>
          )}

          {/* Can Help With */}
          {profile.canHelpWith.length > 0 && (
            <section className="bg-surface border border-white/5 rounded-2xl p-6">
              <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-muted mb-3">{t.community.canHelpWith}</h2>
              <div className="flex flex-wrap gap-2">
                {profile.canHelpWith.map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-mono">
                    🤝 {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Looking For */}
          {profile.lookingFor.length > 0 && (
            <section className="bg-surface border border-white/5 rounded-2xl p-6">
              <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-muted mb-3">{t.community.lookingFor}</h2>
              <div className="flex flex-wrap gap-2">
                {profile.lookingFor.map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-lg bg-surface-light text-foreground-muted text-sm font-mono border border-white/5">
                    🔍 {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Opportunities */}
          {profile.hasOpportunities && (
            <section className="bg-surface border border-accent/30 rounded-2xl p-6">
              <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-accent mb-3">{t.community.openToOpportunities}</h2>
              <p className="text-foreground-muted text-sm">
                {t.community.opportunitiesMessage.replace('{name}', profile.name)}
              </p>
            </section>
          )}

          {/* Marketplace */}
          {profile.marketplaceSeller && (
            <section className="bg-surface border border-white/5 rounded-2xl p-6">
              <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-muted mb-3">{t.community.marketplaceSeller}</h2>
              <p className="text-foreground-muted text-sm">
                {t.community.marketplaceSellerMessage.replace('{name}', profile.name)}
              </p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Industries */}
          {profile.industries.length > 0 && (
            <div className="bg-surface border border-white/5 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-muted mb-3">{t.community.industries}</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.industries.map((ind) => (
                  <span key={ind} className="px-2 py-1 rounded-md bg-surface-light text-foreground-muted text-xs font-mono">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="bg-surface border border-white/5 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-muted mb-3">{t.community.skills}</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 rounded-md bg-surface-light text-foreground-muted text-xs font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {profile.interests.length > 0 && (
            <div className="bg-surface border border-white/5 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-muted mb-3">{t.community.interests}</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map((interest) => (
                  <span key={interest} className="px-2 py-1 rounded-md bg-surface-light text-foreground-muted text-xs font-mono">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
            <div className="bg-surface border border-white/5 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-muted mb-3">{t.community.links}</h3>
              <div className="space-y-1.5">
                {Object.entries(profile.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 rounded-md text-xs font-mono text-accent hover:bg-surface-light transition-colors capitalize"
                  >
                    🔗 {platform}
                  </a>
                ))}
              </div>
            </div>
          )}

          {profile.website && (
            <div className="bg-surface border border-white/5 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-muted mb-3">{t.community.links}</h3>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-accent hover:underline break-all"
              >
                {profile.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* List Modal */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowListModal(false)}>
          <div className="bg-surface border border-white/5 rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-lg text-white mb-1">{t.community.addToListTitle}</h3>
            <p className="text-xs text-muted font-mono mb-4">{t.community.addToListDescription.replace('{name}', profile.name)}</p>

            {addedMessage ? (
              <p className="text-accent text-sm font-mono py-4 text-center">{addedMessage}</p>
            ) : (
              <>
                {/* Note */}
                <input
                  type="text"
                  placeholder={t.community.optionalNotePlaceholder}
                  value={listNote}
                  onChange={(e) => setListNote(e.target.value)}
                  className="w-full px-3 py-2 mb-3 rounded-lg bg-surface-light border border-white/5 text-sm text-white font-mono placeholder:text-muted focus:outline-none focus:border-accent"
                />

                {/* Existing lists */}
                {lists.length > 0 && (
                  <div className="space-y-1 mb-3 max-h-48 overflow-y-auto">
                    {lists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => handleAddToList(list.id)}
                        disabled={loading}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-light transition-colors flex justify-between items-center"
                      >
                        <span className="text-sm text-white font-mono">{list.name}</span>
                        <span className="text-[10px] text-muted font-mono">{list._count.items} {t.community.statsMembers.toLowerCase()}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Create new list */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.community.newListNamePlaceholder}
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-surface-light border border-white/5 text-sm text-white font-mono placeholder:text-muted focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={handleCreateAndAdd}
                    disabled={!newListName.trim() || loading}
                    className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-mono font-bold disabled:opacity-50 transition-opacity"
                  >
                    {loading ? t.community.loading : t.community.createAndAdd}
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => setShowListModal(false)}
              className="w-full mt-4 py-2 text-xs font-mono text-muted hover:text-white transition-colors"
            >
              {t.community.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
