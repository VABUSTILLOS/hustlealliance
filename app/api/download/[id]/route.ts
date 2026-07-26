import { NextRequest } from 'next/server';
import { resources, resourceTypeLabels, getResourceLocale, type Resource } from '@/lib/data/resources';
import { getResourceContent, hasRealContent } from '@/lib/data/resources-content';

function getResourceById(id: string): Resource | undefined {
  return resources.find((r) => r.id === id);
}

function generateRealContentHtml(resource: Resource, lang: 'en' | 'es'): string {
  const { title, description } = getResourceLocale(resource, lang);
  const ct = getResourceContent(resource.id);
  if (!ct) return generateFallbackHtml(resource, lang);

  const isEs = lang === 'es';
  const typeLabel = resourceTypeLabels[resource.type];
  const now = new Date().toISOString().split('T')[0];

  // Build sections based on content kind
  let sectionsHtml = '';
  if (ct.kind === 'guide' || ct.kind === 'ebook') {
    const t = isEs ? ct.contentEs : ct.content;
    sectionsHtml = t.sections.map((s, i) => `
    <div class="content-section">
      <h2>${i + 1}. ${s.heading}</h2>
      <div class="body-text">${s.body.replace(/\n/g, '<br>')}</div>
      ${s.subsections ? s.subsections.map((sub, j) => `
        <h3>${sub.heading}</h3>
        <div class="body-text">${sub.body.replace(/\n/g, '<br>')}</div>
      `).join('') : ''}
    </div>`).join('\n');
  } else if (ct.kind === 'template') {
    const t = isEs ? ct.contentEs : ct.content;
    sectionsHtml = `
    <div class="content-section">
      <h2>Template Fields</h2>
      <ul>${t.fields.map((f) => `<li><strong>${f.label}</strong>: ${f.placeholder} (${f.type})</li>`).join('')}</ul>
    </div>` + t.sections.map((s, i) => `
    <div class="content-section">
      <h2>${i + 1}. ${s.heading}</h2>
      <div class="body-text">${s.body.replace(/\n/g, '<br>')}</div>
    </div>`).join('\n');
  } else if (ct.kind === 'spreadsheet') {
    const t = isEs ? ct.contentEs : ct.content;
    sectionsHtml = `
    <div class="content-section">
      <h2>${t.description}</h2>
      <table class="data-table">
        <thead><tr>${t.columns.map((col: { label: string }) => `<th>${col.label}</th>`).join('')}</tr></thead>
        <tbody>${t.rows.map((row: Record<string, string | number>) =>
    `<tr>${t.columns.map((col: { key: string }) => `<td>${row[col.key] ?? ''}</td>`).join('')}</tr>`
  ).join('')}</tbody>
      </table>
    </div>`;
  } else if (ct.kind === 'cheatsheet') {
    const t = isEs ? ct.contentEs : ct.content;
    sectionsHtml = `
    <div class="content-section">
      <p class="body-text">${t.intro}</p>
      ${t.items.map((item) => `
        <div style="margin-bottom: 16px;">
          <h3>${item.term}</h3>
          <p>${item.definition}</p>
          ${item.example ? `<p style="color:#666;font-style:italic;">Example: ${item.example}</p>` : ''}
        </div>
      `).join('')}
      ${t.tip ? `<div class="template-box"><strong>Tip:</strong> ${t.tip}</div>` : ''}
    </div>`;
  } else if (ct.kind === 'infographic') {
    const t = isEs ? ct.contentEs : ct.content;
    sectionsHtml = `
    <div class="content-section">
      <p class="body-text">${t.description}</p>
    </div>` + t.sections.map((s) => `
    <div class="content-section">
      <h2>${s.title}</h2>
      <ul>${s.points.map((p: string) => `<li>${p}</li>`).join('')}</ul>
      ${s.visual ? `<p style="font-size:32px;text-align:center;">${s.visual}</p>` : ''}
    </div>`).join('\n') + `
    <div class="content-section">
      <h2>Key Takeaway</h2>
      <p class="body-text"><strong>${t.keyTakeaway}</strong></p>
    </div>`;
  } else if (ct.kind === 'sop') {
    const t = isEs ? ct.contentEs : ct.content;
    sectionsHtml = `
    <div class="content-section">
      <p><strong>Purpose:</strong> ${t.purpose}</p>
      <p><strong>Frequency:</strong> ${t.frequency}</p>
      <p><strong>Owner:</strong> ${t.owner}</p>
    </div>` + t.steps.map((s) => `
    <div class="content-section">
      <h2>Step ${s.step}: ${s.action}</h2>
      <div class="body-text">${s.detail.replace(/\n/g, '<br>')}</div>
      ${s.tools ? `<p style="color:#666;"><strong>Tools:</strong> ${s.tools}</p>` : ''}
    </div>`).join('\n') + `
    <div class="content-section">
      <h2>KPIs</h2>
      <ul>${t.kpis.map((k: string) => `<li>${k}</li>`).join('')}</ul>
    </div>`;
  } else if (ct.kind === 'audio') {
    const t = isEs ? ct.contentEs : ct.content;
    sectionsHtml = `
    <div class="content-section">
      <p>${t.description}</p>
      ${t.narrator ? `<p><strong>${isEs ? 'Narrador' : 'Narrator'}:</strong> ${t.narrator}</p>` : ''}
      <p><strong>${isEs ? 'Duración total' : 'Total duration'}:</strong> ${t.totalDuration}</p>
      <h2>${isEs ? 'Capítulos' : 'Chapters'}</h2>
      <ol>${t.chapters.map((c) => `<li><strong>${c.title}</strong> — ${c.duration}</li>`).join('')}</ol>
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Hustle Alliance</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.8;
    color: #1a1a2e;
    max-width: 850px;
    margin: 0 auto;
    padding: 60px 40px;
    background: #fff;
  }
  .header { border-bottom: 3px solid #ff3b30; padding-bottom: 30px; margin-bottom: 40px; }
  .badge { display: inline-block; background: #ff3b30; color: white; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  h1 { font-size: 32px; font-weight: 800; margin-bottom: 12px; line-height: 1.3; }
  .meta { color: #666; font-size: 14px; display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 8px; }
  .desc { color: #555; font-size: 15px; line-height: 1.7; margin-bottom: 30px; }
  h2 { font-size: 22px; font-weight: 700; margin: 30px 0 14px; color: #1a1a2e; }
  h3 { font-size: 17px; font-weight: 600; margin: 20px 0 10px; color: #333; }
  .content-section { background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 20px; border-left: 4px solid #ff3b30; }
  .body-text { margin-bottom: 12px; color: #333; line-height: 1.7; }
  ul { padding-left: 24px; margin: 10px 0; }
  li { margin-bottom: 6px; color: #444; }
  .template-box { background: #1a1a2e; color: #e0e0e0; border-radius: 8px; padding: 20px; margin-top: 12px; overflow-x: auto; }
  .template-box pre { font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
  .data-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; }
  .data-table th { background: #ff3b30; color: white; padding: 10px 14px; text-align: left; font-weight: 600; }
  .data-table td { padding: 10px 14px; border-bottom: 1px solid #e0e0e0; }
  .data-table tr:nth-child(even) td { background: #fafafa; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0; }
  .tag { background: #e9ecef; padding: 4px 12px; border-radius: 16px; font-size: 12px; color: #495057; }
  .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #999; }
  @media print { body { padding: 40px; } }
</style>
</head>
<body>
<div class="header">
  <div class="badge">${typeLabel}</div>
  <h1>${title}</h1>
  <div class="meta">
    <span>📄 ${isEs ? 'Formato' : 'Format'}: ${resource.format}</span>
    <span>📦 ${isEs ? 'Tamaño' : 'Size'}: ${resource.fileSize}</span>
    <span>📅 ${isEs ? 'Fecha' : 'Date'}: ${now}</span>
  </div>
  <p class="desc">${description}</p>
</div>

<div class="tags">
  ${resource.tags.map((tag: string) => `<span class="tag">#${tag}</span>`).join('\n  ')}
</div>

${sectionsHtml}

<div class="footer">
  <p>${isEs ? 'Generado por Hustle Alliance' : 'Generated by Hustle Alliance'} · ${now}</p>
  <p>${isEs ? 'Este recurso es parte de la biblioteca de Hustle Alliance. Distribución permitida solo para uso personal.' : 'This resource is part of the Hustle Alliance library. Distribution permitted for personal use only.'}</p>
</div>
</body>
</html>`;
}

function generateFallbackHtml(resource: Resource, lang: 'en' | 'es'): string {
  const { title, description } = getResourceLocale(resource, lang);
  const isEs = lang === 'es';
  const typeLabel = resourceTypeLabels[resource.type];
  const now = new Date().toISOString().split('T')[0];

  const labels = isEs ? {
    type: 'Tipo',
    format: 'Formato',
    size: 'Tamaño',
    downloads: 'Descargas',
    description: 'Descripción',
    tags: 'Etiquetas',
    generated: 'Generado por Hustle Alliance',
    date: 'Fecha',
    about: 'Sobre este recurso',
    tableOfContents: 'Contenido',
    section1: '1. Resumen Ejecutivo',
    section1Text: 'Este recurso ha sido diseñado para emprendedores y fundadores que buscan construir negocios sostenibles. Contiene frameworks prácticos, plantillas accionables y guías paso a paso basadas en las mejores prácticas de la industria.',
    section2: '2. Cómo Usar Este Recurso',
    section2Text: 'Revisa cada sección en orden. Completa los ejercicios y plantillas incluidos. Adapta los frameworks a tu contexto específico. Comparte los resultados con tu equipo o mentor para obtener retroalimentación.',
    section3: '3. Próximos Pasos',
    section3Text: 'Después de completar este recurso, te recomendamos aplicarlo inmediatamente en tu negocio. La ejecución es lo que separa a los fundadores exitosos del resto.',
    disclaimer: 'Este recurso es parte de la biblioteca de Hustle Alliance. Distribución permitida solo para uso personal.',
  } : {
    type: 'Type',
    format: 'Format',
    size: 'Size',
    downloads: 'Downloads',
    description: 'Description',
    tags: 'Tags',
    generated: 'Generated by Hustle Alliance',
    date: 'Date',
    about: 'About This Resource',
    tableOfContents: 'Contents',
    section1: '1. Executive Summary',
    section1Text: 'This resource has been designed for entrepreneurs and founders building sustainable businesses. It contains practical frameworks, actionable templates, and step-by-step guides based on industry best practices.',
    section2: '2. How to Use This Resource',
    section2Text: 'Review each section in order. Complete the included exercises and templates. Adapt the frameworks to your specific context. Share results with your team or mentor for feedback.',
    section3: '3. Next Steps',
    section3Text: 'After completing this resource, apply it immediately in your business. Execution is what separates successful founders from the rest.',
    disclaimer: 'This resource is part of the Hustle Alliance library. Distribution permitted for personal use only.',
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Hustle Alliance</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.7;
    color: #1a1a2e;
    max-width: 800px;
    margin: 0 auto;
    padding: 60px 40px;
    background: #fff;
  }
  .header {
    border-bottom: 3px solid #ff3b30;
    padding-bottom: 30px;
    margin-bottom: 40px;
  }
  .badge {
    display: inline-block;
    background: #ff3b30;
    color: white;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }
  h1 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
    line-height: 1.3;
  }
  .meta {
    color: #666;
    font-size: 14px;
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }
  .meta span { display: flex; align-items: center; gap: 6px; }
  h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 40px 0 16px;
    color: #1a1a2e;
  }
  p { margin-bottom: 16px; color: #333; }
  .content-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  .tag {
    background: #e9ecef;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    color: #495057;
  }
  .footer {
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
    font-size: 12px;
    color: #999;
  }
  @media print {
    body { padding: 40px; }
  }
</style>
</head>
<body>
<div class="header">
  <div class="badge">${typeLabel}</div>
  <h1>${title}</h1>
  <div class="meta">
    <span>📄 ${labels.format}: ${resource.format}</span>
    <span>📦 ${labels.size}: ${resource.fileSize}</span>
    <span>⬇ ${resource.downloads.toLocaleString()} ${labels.downloads.toLowerCase()}</span>
    <span>📅 ${labels.date}: ${now}</span>
  </div>
</div>

<h2>${labels.about}</h2>
<p>${description}</p>

<div class="tags">
  ${resource.tags.map(tag => `<span class="tag">#${tag}</span>`).join('\n  ')}
</div>

<h2>${labels.tableOfContents}</h2>
<div class="content-section">
  <h3>${labels.section1}</h3>
  <p>${labels.section1Text}</p>
</div>
<div class="content-section">
  <h3>${labels.section2}</h3>
  <p>${labels.section2Text}</p>
</div>
<div class="content-section">
  <h3>${labels.section3}</h3>
  <p>${labels.section3Text}</p>
</div>

<div class="footer">
  <p>${labels.generated} · ${now}</p>
  <p>${labels.disclaimer}</p>
</div>
</body>
</html>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lang = (request.nextUrl.searchParams.get('lang') || 'en') as 'en' | 'es';
  const resource = getResourceById(id);

  if (!resource) {
    return new Response('Resource not found', { status: 404 });
  }

  const { title } = getResourceLocale(resource, lang);
  const html = hasRealContent(id)
    ? generateRealContentHtml(resource, lang)
    : generateFallbackHtml(resource, lang);
  const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') + '-' + lang + '.html';

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
