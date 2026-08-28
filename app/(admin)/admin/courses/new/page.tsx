'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';

type Instructor = { id: string; name: string; email: string };
type Category = { id: string; name: string; slug: string };

export default function NewCoursePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    thumbnail: '',
    difficulty: 'BEGINNER',
    accessLevel: 'FREE',
    price: 0,
    categoryId: '',
    instructorId: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    fetch('/api/admin/courses?limit=1')
      .then((r) => r.json())
      .then((data) => {
        setInstructors(data.instructors || []);
        setCategories(data.categories || []);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/courses/${data.course.id}`);
      } else {
        alert(t.admin.courses.form.failedCreate);
      }
    } catch {
      alert(t.admin.courses.form.errorCreate);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors';
  const labelClass = 'block text-sm text-muted mb-1.5';

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-foreground">{t.admin.courses.createNew}</h1>
        <button
          type="button"
          onClick={() => router.push('/admin/ai-studio')}
          className="px-4 py-2 bg-surface border border-surface-light text-foreground rounded-xl text-sm font-medium hover:border-accent transition-colors"
        >
          ✨ Generate with AI
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>{t.admin.courses.form.title} *</label>
            <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>{t.admin.courses.form.slug} *</label>
            <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder={t.admin.courses.form.slugPlaceholder} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t.admin.courses.form.tagline}</label>
          <input name="tagline" value={form.tagline} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>{t.admin.courses.form.description}</label>
          <textarea name="description" value={form.description} onChange={handleChange} className={inputClass} rows={4} />
        </div>

        <div>
          <label className={labelClass}>{t.admin.courses.form.thumbnail}</label>
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className={inputClass} placeholder={t.admin.courses.form.thumbnailPlaceholder} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>{t.admin.courses.form.difficulty}</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange} className={inputClass}>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.admin.courses.form.accessLevel}</label>
            <select name="accessLevel" value={form.accessLevel} onChange={handleChange} className={inputClass}>
              <option value="FREE">Free</option>
              <option value="BASIC">Basic</option>
              <option value="PRO">Pro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.admin.courses.form.price}</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className={inputClass} min={0} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>{t.admin.courses.form.category}</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputClass}>
              <option value="">{t.admin.common.none}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.admin.courses.form.instructor}</label>
            <select name="instructorId" value={form.instructorId} onChange={handleChange} className={inputClass}>
              <option value="">{t.admin.common.none}</option>
              {instructors.map((i) => (
                <option key={i.id} value={i.id}>{i.name || i.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.admin.courses.form.status}</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {saving ? t.admin.courses.form.creating : t.admin.courses.form.createCourse}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-surface border border-surface-light text-muted rounded-xl font-medium text-sm hover:text-foreground transition-colors"
          >
            {t.admin.courses.form.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
