'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getTaskById, getLevelById } from '@/lib/data/journey';
import { useToast } from '@/app/components/ToastProvider';
import { useState, useRef, useCallback } from 'react';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const levelId = Number(params.levelId);
  const taskId = String(params.taskId);
  const level = getLevelById(levelId);
  const task = getTaskById(levelId, taskId);

  const isTaskComplete = useStore((s) => s.isTaskComplete);
  const isLevelComplete = useStore((s) => s.isLevelComplete);
  const completeTask = useStore((s) => s.completeTask);
  const journeyProgress = useStore((s) => s.journeyProgress);

  const [textValue, setTextValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null); // base64 data URL
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Previous evidence
  const existingEvidence = journeyProgress[String(levelId)]?.tasks?.[taskId]?.evidence;
  const alreadyCompleted = isTaskComplete(levelId, taskId);

  if (!level || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="text-5xl">🔍</span>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t.journey.taskNotFound}</h1>
          <Link href="/journey" className="text-accent hover:underline">{t.journey.backToJourney}</Link>
        </div>
      </div>
    );
  }

  // Check if previous tasks in this level are done
  const taskIndex = level.tasks.findIndex((t) => t.id === taskId);
  const prevTasksDone = taskIndex === 0 ||
    level.tasks.slice(0, taskIndex).every((t) => isTaskComplete(levelId, t.id));
  const taskLocked = !prevTasksDone && !alreadyCompleted;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const evidence =
      task.type === 'text_input'
        ? textValue
        : task.type === 'file_upload'
          ? uploadedFile
          : 'checked'; // checkbox

    completeTask(levelId, taskId, evidence || undefined);

    addToast({
      message: `+${task.points} XP! Task completed: ${task.title}`,
      icon: '✅',
      type: 'success',
      duration: 4000,
    });

    // Check if level is now complete
    const allDone = level.tasks.every((t) =>
      t.id === taskId ? true : isTaskComplete(levelId, t.id)
    );
    if (allDone && !isLevelComplete(levelId)) {
      setTimeout(() => {
        addToast({
          message: `🎉 Level complete! +${level.xpReward} bonus XP!`,
          icon: '🏆',
          type: 'success',
          duration: 6000,
        });
      }, 1000);
    }

    setTimeout(() => {
      router.push(`/journey/${levelId}`);
    }, 500);
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back link */}
      <Link
        href={`/journey/${levelId}`}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to {level.title}
      </Link>

      {/* Task header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-accent font-bold px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
            {t.journey.level} {level.id}
          </span>
          <span className="text-xs font-mono text-muted px-3 py-1 rounded-full bg-surface-light border border-white/5">
            {t.journey.taskOf.replace('{current}', String(taskIndex + 1)).replace('{total}', String(level.tasks.length))}
          </span>
          {task.required && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-accent/10 text-accent font-medium">
              {t.journey.required}
            </span>
          )}
          {alreadyCompleted && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-green-400/10 text-green-400 font-medium">
              ✓ {t.journey.complete}
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          {task.title}
        </h1>

        <p className="text-muted leading-relaxed">{task.description}</p>

        {/* Hint */}
        {task.hint && (
          <div className="p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/20 flex gap-2">
            <span className="text-sm">💡</span>
            <p className="text-sm text-yellow-400/80">{task.hint}</p>
          </div>
        )}

        {/* Points */}
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-foreground font-bold">
            ⚡ +{task.points} {t.journey.points}
          </span>
        </div>
      </div>

      {/* Task locked */}
      {taskLocked && (
        <div className="p-6 rounded-2xl bg-surface/50 border border-surface-light text-center space-y-3">
          <span className="text-3xl block">🔒</span>
          <p className="text-foreground font-medium">{t.journey.taskLocked}</p>
        </div>
      )}

      {/* Task content (not locked) */}
      {!taskLocked && !alreadyCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Text input */}
          {task.type === 'text_input' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t.journey.yourAnswer}</label>
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder={t.journey.textPlaceholder}
                rows={8}
                className="w-full p-4 rounded-xl bg-surface border border-surface-light text-foreground placeholder:text-muted/50 resize-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>
          )}

          {/* File upload */}
          {task.type === 'file_upload' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all
                ${dragOver
                  ? 'border-accent bg-accent/5'
                  : 'border-surface-light bg-surface/30 hover:border-accent/40 hover:bg-accent/5'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileSelect}
              />

              {uploadedFile ? (
                <div className="space-y-3">
                  {uploadedFile.startsWith('data:image') ? (
                    <img src={uploadedFile} alt={uploadedFileName} className="max-h-48 mx-auto rounded-lg" />
                  ) : (
                    <span className="text-4xl block">📄</span>
                  )}
                  <p className="text-foreground font-medium text-sm">{uploadedFileName}</p>
                  <p className="text-muted text-xs">{t.journey.uploading}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setUploadedFileName(''); }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    {t.journey.remove}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-4xl block">📤</span>
                  <p className="text-foreground font-medium">{t.journey.fileUpload}</p>
                  <p className="text-muted text-xs">{t.journey.uploadHint}</p>
                </div>
              )}
            </div>
          )}

          {/* Checkbox */}
          {task.type === 'checkbox' && (
            <div className="p-4 rounded-xl bg-surface/50 border border-surface-light text-center">
              <p className="text-foreground font-medium">{t.journey.checkboxDesc}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (task.type === 'text_input' && !textValue.trim()) ||
              (task.type === 'file_upload' && !uploadedFile)
            }
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white font-heading font-bold rounded-xl hover:bg-accent-glow transition-all shadow-[0_0_20px_rgba(255,59,48,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ animation: isSubmitting ? 'none' : 'cta-pulse 2s infinite' }}
          >
            {isSubmitting ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>⚡</motion.span>
                {t.journey.submitting}
              </>
            ) : (
              <>
                <span>✅</span>
                {t.journey.submitEvidence}
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Already completed — show evidence */}
      {alreadyCompleted && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-green-400/5 border border-green-400/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-400 text-lg">✅</span>
              <span className="text-green-400 font-heading font-bold">{t.journey.evidenceSubmitted}</span>
            </div>

            {existingEvidence && existingEvidence !== 'checked' && (
              <div className="p-3 rounded-lg bg-surface/50 border border-surface-light">
                <p className="text-xs text-muted mb-2">{t.journey.previousEvidence}</p>
                {existingEvidence.startsWith('data:image') ? (
                  <img src={existingEvidence} alt={t.journey.evidenceSubmitted} className="max-h-48 rounded-lg" />
                ) : existingEvidence.startsWith('data:') ? (
                  <span className="text-2xl">📄</span>
                ) : (
                  <p className="text-foreground text-sm whitespace-pre-wrap bg-surface-light/50 p-3 rounded-lg">
                    {existingEvidence}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Next task link */}
          {taskIndex < level.tasks.length - 1 && (
            <Link
              href={`/journey/${levelId}/${level.tasks[taskIndex + 1].id}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent/10 border border-accent/30 text-accent font-heading font-bold rounded-xl hover:bg-accent/20 transition-all"
            >
              {t.journey.nextTask}
            </Link>
          )}

          {taskIndex === level.tasks.length - 1 && (
            <Link
              href={`/journey/${levelId}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-heading font-bold rounded-xl hover:bg-accent-glow transition-all shadow-[0_0_20px_rgba(255,59,48,0.3)]"
            >
              {t.journey.backToLevelOverview}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
