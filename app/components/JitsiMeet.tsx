'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface JitsiMeetProps {
  roomName: string;
  displayName: string;
  email?: string;
  onClose?: () => void;
}

// Jitsi Meet external API script URL
const JITSI_SCRIPT = 'https://meet.jit.si/external_api.js';

export default function JitsiMeet({ roomName, displayName, email, onClose }: JitsiMeetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiApi = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Load Jitsi script dynamically
    if (document.querySelector(`script[src="${JITSI_SCRIPT}"]`)) {
      initJitsi();
      return;
    }

    const script = document.createElement('script');
    script.src = JITSI_SCRIPT;
    script.async = true;
    script.onload = () => { setIsLoaded(true); initJitsi(); };
    script.onerror = () => setLoadError(true);
    document.body.appendChild(script);

    return () => {
      if (jitsiApi.current) {
        jitsiApi.current.dispose();
        jitsiApi.current = null;
      }
    };
  }, [roomName]);

  function initJitsi() {
    if (!containerRef.current || jitsiApi.current) return;

    try {
      const JitsiMeetExternalAPI = (window as any).JitsiMeetExternalAPI;
      if (!JitsiMeetExternalAPI) return;

      const domain = 'meet.jit.si';
      const options = {
        roomName,
        parentNode: containerRef.current,
        userInfo: {
          displayName,
          email: email || '',
        },
        configOverrides: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          toolbarButtons: [
            'microphone', 'camera', 'chat', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'tileview', 'settings',
            'raisehand', 'recording',
          ],
        },
        interfaceConfigOverrides: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          FILM_STRIP_MAX_HEIGHT: 120,
        },
      };

      jitsiApi.current = new JitsiMeetExternalAPI(domain, options);
    } catch (e) {
      console.error('Jitsi init error:', e);
      setLoadError(true);
    }
  }

  const toggleFullscreen = () => {
    if (jitsiApi.current?.isLargeVideo) {
      try {
        if (!isFullscreen) {
          containerRef.current?.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
        setIsFullscreen(!isFullscreen);
      } catch { /* ignore */ }
    }
  };

  if (loadError) {
    return (
      <div className="aspect-video bg-surface rounded-2xl flex flex-col items-center justify-center text-muted border border-surface-light">
        <p className="font-heading font-bold text-lg mb-2">Live Class Unavailable</p>
        <p className="text-sm">Jitsi Meet couldn&apos;t be loaded. Check your connection.</p>
        {onClose && (
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-accent rounded-lg text-sm">
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-muted">🔴 LIVE</span>
        <div className="flex items-center gap-2">
          <button onClick={toggleFullscreen} className="p-1.5 rounded-lg bg-surface-light hover:bg-white/10 transition-colors">
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-muted" /> : <Maximize2 className="w-4 h-4 text-muted" />}
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg bg-surface-light hover:bg-white/10 transition-colors">
              <X className="w-4 h-4 text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* Jitsi container */}
      <div
        ref={containerRef}
        className="aspect-video bg-black rounded-2xl overflow-hidden border border-surface-light"
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
          <div className="animate-pulse text-muted text-sm">Loading live class...</div>
        </div>
      )}
    </div>
  );
}

// Declare window extension for TypeScript
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}
