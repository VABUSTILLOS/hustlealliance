'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store/useStore';

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  src: string;
  duration: number; // seconds
  chapters?: { title: string; start: number }[];
  resourceId?: string;
}

interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMinimized: boolean;
  playlist: AudioTrack[];
}

// This component mounts ONCE at the app level and persists across navigation
export function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMinimized: true,
    playlist: [],
  });

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    const onTimeUpdate = () => setState((s) => ({ ...s, currentTime: audio.currentTime }));
    const onLoadedMetadata = () => setState((s) => ({ ...s, duration: audio.duration }));
    const onEnded = () => {
      setState((s) => ({ ...s, isPlaying: false }));
      // Auto-play next track
      const idx = state.playlist.findIndex((t) => t.id === state.currentTrack?.id);
      if (idx >= 0 && idx < state.playlist.length - 1) {
        playTrack(state.playlist[idx + 1]);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Sync audio.src when track changes
  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      audioRef.current.src = state.currentTrack.src;
      audioRef.current.load();
    }
  }, [state.currentTrack?.id]);

  const playTrack = useCallback((track: AudioTrack) => {
    if (!audioRef.current) return;
    setState((s) => ({
      ...s,
      currentTrack: track,
      isPlaying: true,
      isMinimized: false,
      playlist: s.playlist.some((t) => t.id === track.id) ? s.playlist : [...s.playlist, track],
    }));
    if (audioRef.current.src !== track.src) {
      audioRef.current.src = track.src;
      audioRef.current.load();
    }
    audioRef.current.play().catch(() => {});
    // Save progress to store
    const store = useStore.getState();
    if (track.resourceId) {
      store.saveAudioProgress?.(track.resourceId, 0);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !state.currentTrack) return;
    if (state.isPlaying) {
      audioRef.current.pause();
      setState((s) => ({ ...s, isPlaying: false }));
    } else {
      audioRef.current.play().catch(() => {});
      setState((s) => ({ ...s, isPlaying: true }));
    }
  }, [state.isPlaying, state.currentTrack]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setState((s) => ({ ...s, currentTime: time }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = vol;
    setState((s) => ({ ...s, volume: vol }));
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Expose playTrack globally so other components can call it
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__haAudioPlayer = { playTrack, getState: () => state };
  }

  const { currentTrack, isPlaying, currentTime, duration, volume, isMinimized } = state;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed bottom-0 left-0 right-0 z-[300] bg-surface border-t border-surface-light shadow-2xl transition-all
          ${isMinimized ? 'h-16' : 'h-auto'}
        `}
      >
        {isMinimized ? (
          /* Minimized bar */
          <div className="h-full flex items-center px-4 gap-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-glow transition-all shrink-0"
            >
              {isPlaying ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
              )}
            </button>

            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setState((s) => ({ ...s, isMinimized: false }))}>
              <p className="text-foreground text-sm font-medium truncate">{currentTrack.title}</p>
              {currentTrack.artist && (
                <p className="text-muted text-xs truncate">{currentTrack.artist}</p>
              )}
            </div>

            <span className="text-muted text-xs shrink-0">{formatTime(currentTime)}</span>

            <button
              onClick={() => setState((s) => ({ ...s, isMinimized: false }))}
              className="text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </button>
          </div>
        ) : (
          /* Expanded player */
          <div className="p-4 space-y-4">
            {/* Track info */}
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-foreground font-heading font-bold truncate">{currentTrack.title}</p>
                {currentTrack.artist && <p className="text-muted text-xs">{currentTrack.artist}</p>}
              </div>
              <button
                onClick={() => setState((s) => ({ ...s, isMinimized: true }))}
                className="text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,15 12,9 18,15" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div
                className="h-1.5 rounded-full bg-surface-light cursor-pointer group relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  seek(pct * duration);
                }}
              >
                <div
                  className="h-full bg-accent rounded-full relative transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                  <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 accent-accent"
                />
              </div>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-glow transition-all"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                ) : (
                  <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                )}
              </button>

              {/* Speed */}
              <select className="bg-surface border border-surface-light rounded-lg text-xs text-muted px-2 py-1 focus:outline-none">
                <option value="1">1×</option>
                <option value="1.25">1.25×</option>
                <option value="1.5">1.5×</option>
                <option value="2">2×</option>
              </select>
            </div>

            {/* Chapters */}
            {currentTrack.chapters && currentTrack.chapters.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                <p className="text-xs text-muted uppercase tracking-wider font-medium">Chapters</p>
                {currentTrack.chapters.map((ch, i) => (
                  <button
                    key={i}
                    onClick={() => seek(ch.start)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors
                      ${currentTime >= ch.start && currentTime < (currentTrack.chapters?.[i + 1]?.start ?? duration)
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted hover:text-foreground hover:bg-surface-light/50'
                      }`}
                  >
                    <span className="font-mono mr-2">{formatTime(ch.start)}</span>
                    {ch.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Helper to play audio from any component
export function playAudioTrack(track: AudioTrack) {
  const player = (window as unknown as Record<string, { playTrack: (t: AudioTrack) => void } | undefined>).__haAudioPlayer;
  player?.playTrack(track);
}
