'use client';

import type { Block } from '@/lib/pages/blocks';

/**
 * Right-hand property inspector. Renders a form for the selected block's
 * `props`, tailored per block type. Edits call `onChange` with the full
 * updated props object (shallow-merged by the caller into the block).
 */
export function Inspector({
  block,
  onChange,
}: {
  block: Block | null;
  onChange: (props: Record<string, unknown>) => void;
}) {
  if (!block) {
    return (
      <div className="p-6 text-sm text-muted">
        Select a section on the canvas to edit its properties.
      </div>
    );
  }

  const props = block.props as Record<string, unknown>;
  const set = (key: string, value: unknown) => onChange({ ...props, [key]: value });
  const setNested = (key: string, nestedKey: string, value: unknown) =>
    onChange({ ...props, [key]: { ...(props[key] as object), [nestedKey]: value } });

  const field = (label: string, children: React.ReactNode) => (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-muted mb-1.5">{label}</span>
      {children}
    </label>
  );

  const textInput = (key: string, placeholder?: string) => (
    <input
      type="text"
      value={(props[key] as string) || ''}
      placeholder={placeholder}
      onChange={(e) => set(key, e.target.value)}
      className="w-full px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
    />
  );

  const textArea = (key: string, placeholder?: string) => (
    <textarea
      value={(props[key] as string) || ''}
      placeholder={placeholder}
      onChange={(e) => set(key, e.target.value)}
      rows={3}
      className="w-full px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
    />
  );

  const buttonFields = (key: 'primaryCta' | 'secondaryCta' | 'button' | 'cta') => {
    const val = (props[key] as { label?: string; href?: string }) || {};
    return (
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={val.label || ''}
          placeholder="Label"
          onChange={(e) => setNested(key, 'label', e.target.value)}
          className="px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <input
          type="text"
          value={val.href || ''}
          placeholder="URL"
          onChange={(e) => setNested(key, 'href', e.target.value)}
          className="px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
    );
  };

  const listEditor = <T,>(key: string, empty: T, renderItem: (item: T, i: number, update: (next: T) => void) => React.ReactNode) => {
    const items = (props[key] as T[]) || [];
    const update = (i: number, next: T) => {
      const copy = [...items];
      copy[i] = next;
      set(key, copy);
    };
    const remove = (i: number) => set(key, items.filter((_, idx) => idx !== i));
    const add = () => set(key, [...items, empty]);
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-3 bg-surface-light rounded-lg relative">
            <button
              onClick={() => remove(i)}
              className="absolute top-2 right-2 text-muted hover:text-red-400 text-xs"
            >
              ✕
            </button>
            {renderItem(item, i, (next) => update(i, next))}
          </div>
        ))}
        <button
          onClick={add}
          className="w-full py-2 rounded-lg border border-dashed border-border text-muted hover:text-accent hover:border-accent text-xs font-medium"
        >
          + Add item
        </button>
      </div>
    );
  };

  switch (block.type) {
    case 'hero':
      return (
        <div className="p-4">
          {field('Eyebrow', textInput('eyebrow'))}
          {field('Headline', textInput('headline'))}
          {field('Subheadline', textArea('subheadline'))}
          {field('Image URL', textInput('imageUrl'))}
          {field('Primary Button', buttonFields('primaryCta'))}
          {field('Secondary Button', buttonFields('secondaryCta'))}
          {field(
            'Alignment',
            <select
              value={(props.align as string) || 'center'}
              onChange={(e) => set('align', e.target.value)}
              className="w-full px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground"
            >
              <option value="center">Center</option>
              <option value="left">Left</option>
            </select>
          )}
        </div>
      );
    case 'features':
      return (
        <div className="p-4">
          {field('Heading', textInput('heading'))}
          {field('Subheading', textInput('subheading'))}
          {field(
            'Columns',
            <input
              type="number"
              min={1}
              max={4}
              value={(props.columns as number) || 3}
              onChange={(e) => set('columns', Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground"
            />
          )}
          {field(
            'Items',
            listEditor('items', { icon: '', title: '', description: '' }, (item: { icon?: string; title?: string; description?: string }, _i, update) => (
              <div className="space-y-2">
                <input
                  type="text"
                  value={item.icon || ''}
                  placeholder="Icon (emoji)"
                  onChange={(e) => update({ ...item, icon: e.target.value })}
                  className="w-full px-2 py-1.5 bg-surface rounded text-sm"
                />
                <input
                  type="text"
                  value={item.title || ''}
                  placeholder="Title"
                  onChange={(e) => update({ ...item, title: e.target.value })}
                  className="w-full px-2 py-1.5 bg-surface rounded text-sm"
                />
                <textarea
                  value={item.description || ''}
                  placeholder="Description"
                  onChange={(e) => update({ ...item, description: e.target.value })}
                  rows={2}
                  className="w-full px-2 py-1.5 bg-surface rounded text-sm resize-none"
                />
              </div>
            ))
          )}
        </div>
      );
    case 'pricing':
      return (
        <div className="p-4">
          {field('Heading', textInput('heading'))}
          {field('Subheading', textInput('subheading'))}
          {field(
            'Tiers',
            listEditor(
              'tiers',
              { name: '', price: '', period: '', description: '', features: [], cta: { label: '', href: '' }, highlighted: false },
              (
                tier: { name?: string; price?: string; period?: string; description?: string; features?: string[]; cta?: { label?: string; href?: string }; highlighted?: boolean },
                _i,
                update
              ) => (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tier.name || ''}
                    placeholder="Name"
                    onChange={(e) => update({ ...tier, name: e.target.value })}
                    className="w-full px-2 py-1.5 bg-surface rounded text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={tier.price || ''}
                      placeholder="Price"
                      onChange={(e) => update({ ...tier, price: e.target.value })}
                      className="px-2 py-1.5 bg-surface rounded text-sm"
                    />
                    <input
                      type="text"
                      value={tier.period || ''}
                      placeholder="Period (e.g. mo)"
                      onChange={(e) => update({ ...tier, period: e.target.value })}
                      className="px-2 py-1.5 bg-surface rounded text-sm"
                    />
                  </div>
                  <textarea
                    value={(tier.features || []).join('\n')}
                    placeholder="Features (one per line)"
                    onChange={(e) => update({ ...tier, features: e.target.value.split('\n').filter(Boolean) })}
                    rows={3}
                    className="w-full px-2 py-1.5 bg-surface rounded text-sm resize-none"
                  />
                  <label className="flex items-center gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={!!tier.highlighted}
                      onChange={(e) => update({ ...tier, highlighted: e.target.checked })}
                    />
                    Highlighted
                  </label>
                </div>
              )
            )
          )}
        </div>
      );
    case 'testimonials':
      return (
        <div className="p-4">
          {field('Heading', textInput('heading'))}
          {field(
            'Items',
            listEditor(
              'items',
              { quote: '', name: '', role: '', avatarUrl: '' },
              (item: { quote?: string; name?: string; role?: string; avatarUrl?: string }, _i, update) => (
                <div className="space-y-2">
                  <textarea
                    value={item.quote || ''}
                    placeholder="Quote"
                    onChange={(e) => update({ ...item, quote: e.target.value })}
                    rows={2}
                    className="w-full px-2 py-1.5 bg-surface rounded text-sm resize-none"
                  />
                  <input
                    type="text"
                    value={item.name || ''}
                    placeholder="Name"
                    onChange={(e) => update({ ...item, name: e.target.value })}
                    className="w-full px-2 py-1.5 bg-surface rounded text-sm"
                  />
                  <input
                    type="text"
                    value={item.role || ''}
                    placeholder="Role"
                    onChange={(e) => update({ ...item, role: e.target.value })}
                    className="w-full px-2 py-1.5 bg-surface rounded text-sm"
                  />
                </div>
              )
            )
          )}
        </div>
      );
    case 'cta':
      return (
        <div className="p-4">
          {field('Heading', textInput('heading'))}
          {field('Subheading', textArea('subheading'))}
          {field('Button', buttonFields('button'))}
        </div>
      );
    case 'faq':
      return (
        <div className="p-4">
          {field('Heading', textInput('heading'))}
          {field(
            'Items',
            listEditor('items', { question: '', answer: '' }, (item: { question?: string; answer?: string }, _i, update) => (
              <div className="space-y-2">
                <input
                  type="text"
                  value={item.question || ''}
                  placeholder="Question"
                  onChange={(e) => update({ ...item, question: e.target.value })}
                  className="w-full px-2 py-1.5 bg-surface rounded text-sm"
                />
                <textarea
                  value={item.answer || ''}
                  placeholder="Answer"
                  onChange={(e) => update({ ...item, answer: e.target.value })}
                  rows={2}
                  className="w-full px-2 py-1.5 bg-surface rounded text-sm resize-none"
                />
              </div>
            ))
          )}
        </div>
      );
    case 'richtext':
      return (
        <div className="p-4">
          {field('HTML', <textarea
            value={(props.html as string) || ''}
            onChange={(e) => set('html', e.target.value)}
            rows={10}
            className="w-full px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground font-mono resize-none"
          />)}
        </div>
      );
    case 'image':
      return (
        <div className="p-4">
          {field('Image URL', textInput('src'))}
          {field('Alt text', textInput('alt'))}
          {field('Caption', textInput('caption'))}
        </div>
      );
    case 'video':
      return (
        <div className="p-4">
          {field('Video URL', textInput('src'))}
          {field('Poster URL', textInput('poster'))}
          {field(
            'Autoplay',
            <input
              type="checkbox"
              checked={!!props.autoplay}
              onChange={(e) => set('autoplay', e.target.checked)}
            />
          )}
        </div>
      );
    case 'embed':
      return (
        <div className="p-4">
          {field('Embed URL (iframe)', textInput('url'))}
          {field('Raw HTML (used if no URL)', textArea('html'))}
        </div>
      );
    default:
      return <div className="p-6 text-sm text-muted">No editable properties.</div>;
  }
}
