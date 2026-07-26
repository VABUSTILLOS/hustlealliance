'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { memberProfiles, currentUser } from '@/lib/data/users';
import { learningPaths } from '@/lib/data/learning-paths';
import { spaces as allSpaces } from '@/lib/data/spaces';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function MemberProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { t } = useTranslation();
  const profile = memberProfiles[username];
  const posts = useStore((s) => s.posts);
  const joinedSpaces = useStore((s) => s.joinedSpaces);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!profile) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-white mb-4">{t.profile.notFound}</h1>
        <Link href="/dashboard" className="text-accent font-mono text-sm">← {t.profile.backToDashboard}</Link>
      </div>
    );
  }

  const isOwnProfile = profile.username === currentUser.username;
  const memberPosts = posts.filter((p) => p.author.username === profile.username);
  const memberSpaces = allSpaces.filter((s) => joinedSpaces.includes(s.slug));
  const completedPaths = learningPaths.filter((lp) => profile.completedPaths.includes(lp.slug));

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageSent(true);
      setTimeout(() => {
        setShowMessageModal(false);
        setMessageSent(false);
        setMessageText('');
      }, 2000);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-surface-light rounded-2xl p-6 lg:p-8 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img src={profile.avatar} alt={profile.name}
            className="w-20 h-20 rounded-full border-2 border-white/10 object-cover" />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl text-white uppercase leading-none mb-1">
              {profile.name}
            </h1>
            <p className="font-mono text-xs text-accent mb-2">@{profile.username}</p>
            <p className="text-white text-sm font-medium">{profile.headline}</p>
            <p className="text-muted text-sm mt-1">{profile.bio}</p>
          </div>
          {!isOwnProfile && (
            <button
              onClick={() => setShowMessageModal(true)}
              className="shrink-0 px-4 py-2 bg-accent/10 border border-accent/30 text-accent font-heading font-bold text-sm rounded-xl hover:bg-accent/20 transition-colors"
            >
              {t.profile.message}
            </button>
          )}
        </div>
      </motion.div>

      {/* Startup Pitch */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-accent/20 rounded-2xl p-6 mb-8 shadow-[0_0_40px_rgba(255,59,48,0.06)]"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">{t.profile.startupPitch}</p>
        <p className="text-white/80 text-sm leading-relaxed">{profile.startupPitch}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Feed */}
          <div className="bg-surface border border-surface-light rounded-2xl p-6">
            <h2 className="font-heading font-bold text-white text-lg mb-5">{t.profile.recentActivity}</h2>
            {memberPosts.length > 0 ? (
              <div className="space-y-4">
                {memberPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="pb-4 border-b border-surface-light last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-muted text-xs font-mono">{post.timestamp}</span>
                      {post.space && (
                        <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-[9px] font-mono uppercase">{post.space}</span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm">{post.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-muted text-xs">{post.likes} {t.profile.likes}</span>
                      <span className="text-muted text-xs">{post.comments.length} {t.profile.comments}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">{t.profile.noPosts}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-surface border border-surface-light rounded-2xl p-6">
            <h2 className="font-heading font-bold text-white text-lg mb-4">{t.profile.achievements}</h2>
            <div className="grid grid-cols-2 gap-2">
              {profile.achievements.map((a) => (
                <div key={a.id} className="flex items-center gap-2 p-2 rounded-xl bg-surface-light border border-white/5">
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-white text-xs font-medium">{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Paths */}
          {completedPaths.length > 0 && (
            <div className="bg-surface border border-surface-light rounded-2xl p-6">
              <h2 className="font-heading font-bold text-white text-lg mb-4">{t.profile.completedPaths}</h2>
              <div className="space-y-2">
                {completedPaths.map((lp) => (
                  <Link key={lp.slug} href={`/learning/${lp.slug}`}
                    className="flex items-center gap-3 p-2 rounded-xl bg-surface-light border border-white/5 hover:border-accent/20 transition-all">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm">🎓</span>
                    <span className="text-white text-sm font-medium">{lp.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Spaces */}
          {memberSpaces.length > 0 && (
            <div className="bg-surface border border-surface-light rounded-2xl p-6">
              <h2 className="font-heading font-bold text-white text-lg mb-4">{t.spaces.tag}</h2>
              <div className="flex flex-wrap gap-2">
                {memberSpaces.map((s) => (
                  <Link key={s.slug} href={`/spaces/${s.slug}`}
                    className="px-3 py-1.5 rounded-full bg-surface-light border border-white/5 text-white text-xs hover:border-accent/30 transition-all">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-surface-light rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={profile.avatar} alt="" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                <h3 className="font-heading font-bold text-white">{t.profile.messageTo} {profile.name}</h3>
              </div>
              {messageSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <p className="text-4xl mb-3">✉️</p>
                  <p className="font-heading font-bold text-white text-lg">{t.profile.messageSent}</p>
                  <p className="text-muted text-sm mt-1">{profile.name} {t.profile.notified}</p>
                </motion.div>
              ) : (
                <>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Hi ${profile.name.split(' ')[0]}, I'd love to connect...`}
                    rows={4}
                    className="w-full bg-surface-light border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-muted resize-none mb-4"
                    autoFocus
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowMessageModal(false)}
                      className="px-4 py-2 text-muted text-sm hover:text-white transition-colors"
                    >
                      {t.profile.cancel}
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="px-5 py-2 bg-accent text-white font-heading font-bold text-sm rounded-xl hover:bg-accent-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {t.profile.sendMessage}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
