'use client';

import { useState } from 'react';
import type { TemplateField } from '@/lib/data/resources-content/types';

interface GuideViewerProps {
  title: string;
  description: string;
  type: string;
  sections: { heading: string; body: string; subsections?: { heading: string; body: string }[] }[];
  fields?: TemplateField[];
}

export function GuideViewer({ title, description, type, sections, fields }: GuideViewerProps) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row min-h-0">
      {/* Sidebar table of contents */}
      <nav className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-surface-light p-4 lg:p-6 space-y-1 max-h-48 lg:max-h-full overflow-y-auto">
        {sections.map((section, i) => (
          <button
            key={i}
            onClick={() => setActiveSection(i)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all
              ${activeSection === i
                ? 'bg-accent/10 text-accent font-medium border border-accent/20'
                : 'text-muted hover:text-foreground hover:bg-surface-light/50'
              }`}
          >
            {section.heading}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="space-y-3 mb-8">
          <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
            {type}
          </span>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">{title}</h1>
          <p className="text-muted leading-relaxed">{description}</p>
        </div>

        {/* Template fields (if applicable) */}
        {fields && fields.length > 0 && (
          <div className="mb-8 p-6 rounded-xl bg-surface-light/30 border border-surface-light space-y-4">
            <h3 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider">
              Fillable Fields
            </h3>
            {fields.map((field, i) => (
              <div key={i} className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  {field.label} {field.required && <span className="text-accent">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full p-3 rounded-lg bg-surface border border-surface-light text-foreground text-sm placeholder:text-muted/50 resize-none focus:outline-none focus:border-accent/50 transition-all"
                  />
                ) : field.type === 'select' && field.options ? (
                  <select className="w-full p-3 rounded-lg bg-surface border border-surface-light text-foreground text-sm focus:outline-none focus:border-accent/50 transition-all">
                    <option value="">{field.placeholder}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full p-3 rounded-lg bg-surface border border-surface-light text-foreground text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Section content */}
        {sections[activeSection] && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">
              {sections[activeSection].heading}
            </h2>
            <div className="text-muted leading-relaxed space-y-4">
              {sections[activeSection].body.split('\n\n').map((paragraph, i) => {
                // Handle bold text
                const formatted = paragraph.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-foreground font-semibold">$1</strong>'
                );
                // Handle bullet points
                if (paragraph.includes('\n- ')) {
                  const [intro, ...items] = paragraph.split('\n- ');
                  return (
                    <div key={i}>
                      {intro && <p dangerouslySetInnerHTML={{ __html: formatted.split('\n- ')[0] }} />}
                      <ul className="space-y-2 mt-2">
                        {items.map((item, j) => (
                          <li key={j} className="flex gap-2" dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                      </ul>
                    </div>
                  );
                }
                // Handle numbered lists
                if (paragraph.includes('\n1. ')) {
                  const [intro, ...items] = paragraph.split('\n');
                  return (
                    <div key={i}>
                      {intro && !intro.match(/^\d/) && <p dangerouslySetInnerHTML={{ __html: intro }} />}
                      <ol className="space-y-2 mt-2 list-decimal list-inside">
                        {items.map((item, j) => (
                          <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, '') }} />
                        ))}
                      </ol>
                    </div>
                  );
                }
                return (
                  <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
                );
              })}
            </div>

            {/* Subsections */}
            {sections[activeSection].subsections?.map((sub, j) => (
              <div key={j} className="mt-6 pt-4 border-t border-surface-light">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-3">{sub.heading}</h3>
                <div className="text-muted leading-relaxed space-y-3">
                  {sub.body.split('\n\n').map((p, k) => (
                    <p key={k} dangerouslySetInnerHTML={{
                      __html: p.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
