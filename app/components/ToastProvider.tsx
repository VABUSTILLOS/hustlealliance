'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
  id: string;
  message: string;
  icon?: string;
  type?: 'success' | 'info' | 'streak' | 'error';
  duration?: number;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {}, removeToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isError = toast.type === 'error';
            const isSuccess = toast.type === 'success';
            return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`
                pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm max-w-sm
                ${isError ? 'bg-red-950/90 border border-red-800 text-red-200' : ''}
                ${isSuccess ? 'bg-green-950/90 border border-green-800 text-green-200' : ''}
                ${!isError && !isSuccess ? 'bg-[var(--color-surface)] border border-white/10 shadow-black/20' : ''}
              `}
            >
              {toast.icon && <span className="text-xl shrink-0">{toast.icon}</span>}
              {!toast.icon && isError && <span className="text-xl shrink-0">⚠</span>}
              {!toast.icon && isSuccess && <span className="text-xl shrink-0">✓</span>}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isError || isSuccess ? '' : 'text-[var(--color-foreground)]'}`}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted hover:text-foreground transition-colors shrink-0 ml-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
