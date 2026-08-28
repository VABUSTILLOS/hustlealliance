'use client';

import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '@/lib/utils/format-date';
import { getInitialsAvatarUrl } from '@/lib/utils/avatar';
import { useToast } from '@/app/components/ToastProvider';
import Image from 'next/image';

interface GroupFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  uploaderId: string;
  uploader: { id: string; name: string; avatar: string | null };
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('spreadsheet') || mimeType.includes('csv')) return '📊';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return '🗜️';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  return '📎';
}

export function GroupFilesTab({
  groupId,
  isMember,
  isAdmin,
}: {
  groupId: string;
  isMember: boolean;
  isAdmin: boolean;
}) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery<{ files: GroupFile[]; currentUserId: string }>({
    queryKey: ['group-files', groupId],
    queryFn: async () => {
      const res = await fetch(`/api/groups/${groupId}/files`);
      if (!res.ok) throw new Error('Failed to load files');
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const res = await fetch(`/api/groups/${groupId}/files?fileId=${fileId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-files', groupId] });
      addToast({ message: 'File deleted', type: 'success' });
    },
    onError: () => addToast({ message: 'Failed to delete file', type: 'error' }),
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/groups/${groupId}/files`, { method: 'POST', body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      queryClient.invalidateQueries({ queryKey: ['group-files', groupId] });
      addToast({ message: 'File uploaded', type: 'success' });
    } catch (err) {
      addToast({ message: (err as Error).message, type: 'error' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const files = data?.files ?? [];
  const currentUserId = data?.currentUserId;

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 bg-surface-light rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {isMember && (
        <div className="flex justify-end">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-background rounded-xl font-mono text-xs uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {uploading ? 'Uploading…' : 'Upload file'}
          </button>
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-foreground-muted text-sm">
            No files shared yet{isMember ? ' — upload the first one!' : '.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const canDelete = isAdmin || file.uploaderId === currentUserId;
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 bg-surface border border-surface-light rounded-xl px-4 py-3"
              >
                <span className="text-2xl shrink-0">{fileIcon(file.mimeType)}</span>
                <div className="min-w-0 flex-1">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground font-medium hover:text-accent transition-colors truncate block"
                  >
                    {file.fileName}
                  </a>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Image
                      src={file.uploader.avatar ?? getInitialsAvatarUrl(file.uploader.name)}
                      alt=""
                      width={16}
                      height={16}
                      className="rounded-full object-cover"
                    />
                    <span className="text-xs text-muted">
                      {file.uploader.name} · {formatSize(file.fileSize)} · {formatRelativeTime(file.createdAt)}
                    </span>
                  </div>
                </div>
                {canDelete && (
                  <button
                    onClick={() => deleteMutation.mutate(file.id)}
                    disabled={deleteMutation.isPending}
                    className="text-muted hover:text-red-400 transition-colors p-1.5 disabled:opacity-50"
                    aria-label={`Delete ${file.fileName}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
