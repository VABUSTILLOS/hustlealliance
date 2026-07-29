'use client';

import { useState, useCallback, createContext, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface ToastData {
  id: string;
  title: string;
  body: string;
  avatar?: string;
  link?: string;
}

interface ToastContextValue {
  addToast: (toast: Omit<ToastData, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const router = useRouter();

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => {
              if (toast.link) {
                router.push(toast.link);
              }
              dismiss(toast.id);
            }}
            className="pointer-events-auto flex items-start gap-3 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl shadow-lg p-4 w-80 cursor-pointer hover:bg-surface-light transition-colors"
          >
            {toast.avatar ? (
              <Image
                src={toast.avatar}
                alt=""
                width={36}
                height={36}
                className="rounded-full flex-shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{toast.title}</p>
              <p className="text-xs text-muted mt-0.5 line-clamp-2">{toast.body}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss(toast.id);
              }}
              className="flex-shrink-0 p-1 text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
