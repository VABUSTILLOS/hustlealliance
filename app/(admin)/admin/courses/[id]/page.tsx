'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';

type Module_ = { id: string; title: string; sortOrder: number; lessons: Lesson_[] };
type Lesson_ = {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  isPreview: boolean;
  lessonType: string;
  durationMinutes: number;
  accessLevel: string | null;
};
type Instructor = { id: string; name: string; email: string };
type Category = { id: string; name: string; slug: string };

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonData, setNewLessonData] = useState<Record<string, { title: string; slug: string }>>({});
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/courses?limit=1')
      .then((r) => r.json())
      .then((data) => {
        setInstructors(data.instructors || []);
        setCategories(data.categories || []);
        // Find the course by ID
        return fetch(`/api/admin/courses?limit=100`);
      })
      .then((r) => r.json())
      .then((data) => {
        const found = (data.courses || []).find((c: any) => c.id === id);
        if (found) setCourse(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fetchCourse = async () => {
    // Re-fetch after mutations — find course in admin list
    const res = await fetch('/api/admin/courses?limit=100');
    const data = await res.json();
    const found = (data.courses || []).find((c: any) => c.id === id);
    if (found) setCourse(found);
  };

  const updateField = async (field: string, value: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addModule = async () => {
    if (!newModuleTitle.trim()) return;
    await fetch(`/api/admin/courses/${id}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newModuleTitle }),
    });
    setNewModuleTitle('');
    fetchCourse();
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm(t.admin.courses.edit.deleteModuleConfirm)) return;
    await fetch(`/api/admin/courses/${id}/modules?moduleId=${moduleId}`, { method: 'DELETE' });
    fetchCourse();
  };

  const addLesson = async (moduleId: string) => {
    const data = newLessonData[moduleId];
    if (!data?.title || !data?.slug) return;
    await fetch(`/api/admin/courses/${id}/modules/${moduleId}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setNewLessonData((prev) => ({ ...prev, [moduleId]: { title: '', slug: '' } }));
    fetchCourse();
  };

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm(t.admin.courses.edit.deleteLessonConfirm)) return;
    await fetch(`/api/admin/courses/${id}/modules/${moduleId}/lessons?lessonId=${lessonId}`, { method: 'DELETE' });
    fetchCourse();
  };

  const inputClass = 'w-full px-3 py-2 bg-surface border border-surface-light rounded-lg text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors';

  if (loading) return <div className="p-4 md:p-8 text-muted">{t.general.loading}</div>;
  if (!course) return <div className="p-4 md:p-8 text-muted">{t.general.courseNotFound}</div>;
  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-4 md:mb-8">
        <button onClick={() => router.push('/admin/courses')} className="text-muted hover:text-foreground">
          {t.admin.common.back}
        </button>
        <h1 className="text-2xl font-heading font-bold text-foreground">{t.admin.courses.edit.title.replace('{title}', course.title)}</h1>
      </div>

      {/* Course details form */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-heading font-bold text-foreground mb-4">{t.admin.courses.edit.courseDetails}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.title}</label>
            <input defaultValue={course.title} onBlur={(e) => e.target.value !== course.title && updateField('title', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.slug}</label>
            <input defaultValue={course.slug} onBlur={(e) => e.target.value !== course.slug && updateField('slug', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.tagline}</label>
            <input defaultValue={course.tagline || ''} onBlur={(e) => e.target.value !== (course.tagline || '') && updateField('tagline', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.thumbnail}</label>
            <input defaultValue={course.thumbnail || ''} onBlur={(e) => e.target.value !== (course.thumbnail || '') && updateField('thumbnail', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.difficulty}</label>
            <select defaultValue={course.difficulty} onChange={(e) => updateField('difficulty', e.target.value)} className={inputClass}>
              <option value="BEGINNER">{t.admin.courses.form.options.beginner}</option>
              <option value="INTERMEDIATE">{t.admin.courses.form.options.intermediate}</option>
              <option value="ADVANCED">{t.admin.courses.form.options.advanced}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.accessLevel}</label>
            <select defaultValue={course.accessLevel} onChange={(e) => updateField('accessLevel', e.target.value)} className={inputClass}>
              <option value="FREE">{t.admin.courses.form.options.free}</option>
              <option value="BASIC">{t.admin.courses.form.options.basic}</option>
              <option value="PRO">{t.admin.courses.form.options.pro}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.price}</label>
            <input type="number" defaultValue={course.price || 0} onBlur={(e) => Number(e.target.value) !== (course.price || 0) && updateField('price', Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.status}</label>
            <select defaultValue={course.status} onChange={(e) => updateField('status', e.target.value)} className={inputClass}>
              <option value="DRAFT">{t.admin.courses.form.options.draft}</option>
              <option value="PUBLISHED">{t.admin.courses.form.options.published}</option>
              <option value="ARCHIVED">{t.admin.courses.form.options.archived}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.category}</label>
            <select defaultValue={course.categoryId || ''} onChange={(e) => updateField('categoryId', e.target.value || null)} className={inputClass}>
              <option value="">{t.admin.common.none}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.instructor}</label>
            <select defaultValue={course.instructorId || ''} onChange={(e) => updateField('instructorId', e.target.value || null)} className={inputClass}>
              <option value="">{t.admin.common.none}</option>
              {instructors.map((i) => (
                <option key={i.id} value={i.id}>{i.name || i.email}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-muted mb-1 block">{t.admin.courses.form.description}</label>
          <textarea defaultValue={course.description || ''} onBlur={(e) => e.target.value !== (course.description || '') && updateField('description', e.target.value)} className={inputClass} rows={4} />
        </div>
        {saving && <p className="text-accent text-xs mt-2">{t.admin.courses.edit.saving}</p>}
      </div>

      {/* Modules & Lessons */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold text-foreground">{t.admin.courses.edit.modulesLessons}</h2>
          <span className="text-muted text-xs">{t.admin.courses.edit.modulesCount.replace('{count}', String(course.modules?.length || 0))}</span>
        </div>

        {/* Add module */}
        <div className="flex gap-2 mb-6 pb-6 border-b border-surface-light">
          <input
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder={t.admin.courses.edit.newModulePlaceholder}
            className={`${inputClass} flex-1`}
            onKeyDown={(e) => e.key === 'Enter' && addModule()}
          />
          <button onClick={addModule} className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90">
            {t.admin.courses.edit.addModule}
          </button>
        </div>

        {/* Module list */}
        {!course.modules?.length ? (
          <p className="text-muted text-sm text-center py-4">{t.admin.courses.edit.noModules}</p>
        ) : (
          <div className="space-y-4">
            {(course.modules as Module_[]).map((mod) => (
              <div key={mod.id} className="border border-surface-light rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-surface">
                  <button
                    onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                    className="flex items-center gap-3 text-foreground text-sm font-medium hover:text-accent"
                  >
                    <svg className={`w-4 h-4 transition-transform ${expandedModule === mod.id ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    {mod.title}
                    <span className="text-muted text-xs">{t.admin.courses.edit.lessonsCount.replace('{count}', String(mod.lessons?.length || 0))}</span>
                  </button>
                  <button onClick={() => deleteModule(mod.id)} className="text-xs text-red-400 hover:text-red-300">{t.admin.common.delete}</button>
                </div>

                {expandedModule === mod.id && (
                  <div className="p-4 border-t border-surface-light space-y-3">
                    {/* Existing lessons */}
                    {(mod.lessons || []).map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between py-2 px-3 bg-surface-light/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-muted text-xs w-6">{lesson.sortOrder + 1}.</span>
                          <div>
                            <p className="text-foreground text-sm">{lesson.title}</p>
                            <p className="text-muted text-[10px]">{lesson.lessonType} · {lesson.durationMinutes}min · /{lesson.slug}</p>
                          </div>
                          {lesson.isPreview && <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[10px] rounded">{t.admin.courses.edit.preview}</span>}
                        </div>
                        <button onClick={() => deleteLesson(mod.id, lesson.id)} className="text-xs text-red-400 hover:text-red-300">{t.admin.common.delete}</button>
                      </div>
                    ))}

                    {/* Add lesson to this module */}
                    <div className="flex gap-2 pt-2">
                      <input
                        value={newLessonData[mod.id]?.title || ''}
                        onChange={(e) => setNewLessonData((prev) => ({ ...prev, [mod.id]: { ...prev[mod.id], title: e.target.value, slug: prev[mod.id]?.slug || '' } }))}
                        placeholder={t.admin.courses.edit.lessonTitlePlaceholder}
                        className={`${inputClass} flex-1`}
                      />
                      <input
                        value={newLessonData[mod.id]?.slug || ''}
                        onChange={(e) => setNewLessonData((prev) => ({ ...prev, [mod.id]: { ...prev[mod.id], slug: e.target.value, title: prev[mod.id]?.title || '' } }))}
                        placeholder={t.admin.courses.edit.lessonSlugPlaceholder}
                        className={`${inputClass} w-40`}
                      />
                      <button onClick={() => addLesson(mod.id)} className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90">
                        {t.admin.courses.edit.add}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
