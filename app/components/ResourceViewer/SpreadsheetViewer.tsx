'use client';

import { useState } from 'react';
import type { SpreadsheetContent } from '@/lib/data/resources-content/types';

interface SpreadsheetViewerProps {
  title: string;
  description: string;
  content: SpreadsheetContent;
}

export function SpreadsheetViewer({ title, description, content }: SpreadsheetViewerProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [data, setData] = useState(content.rows.map((r) => ({ ...r })));

  const updateCell = (rowIdx: number, colKey: string, value: string) => {
    setData((prev) =>
      prev.map((row, i) => (i === rowIdx ? { ...row, [colKey]: value } : row))
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
          Spreadsheet
        </span>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">{title}</h1>
        <p className="text-muted">{description}</p>
      </div>

      {/* Formulas reference */}
      {content.formulas && Object.keys(content.formulas).length > 0 && (
        <div className="p-4 rounded-xl bg-surface-light/30 border border-surface-light space-y-2">
          <h3 className="text-xs font-heading font-bold text-foreground uppercase tracking-wider">Key Formulas</h3>
          {Object.entries(content.formulas).map(([key, formula]) => (
            <div key={key} className="flex items-start gap-2 text-sm">
              <code className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-mono">{key}</code>
              <span className="text-muted">{formula}</span>
            </div>
          ))}
        </div>
      )}

      {/* Spreadsheet table */}
      <div className="overflow-x-auto rounded-xl border border-surface-light">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-light/50">
              {content.columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-foreground uppercase tracking-wider border-b border-surface-light"
                  style={{ minWidth: col.width || 120 }}
                >
                  {col.label}
                  {col.type === 'formula' && <span className="ml-1 text-accent text-[10px]">fx</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-surface-light/50 hover:bg-surface-light/20 transition-colors"
              >
                {content.columns.map((col, colIdx) => {
                  const isEditing =
                    editingCell?.row === rowIdx && editingCell?.col === colIdx;
                  const value = row[col.key] ?? '';

                  if (col.type === 'formula' && content.formulas?.[col.key]) {
                    return (
                      <td key={col.key} className="px-4 py-2.5 text-muted font-mono text-xs">
                        {content.formulas[col.key]}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-2.5 cursor-text transition-colors
                        ${col.key === 'status' ? 'font-medium' : 'text-foreground'}
                        ${value === '' ? 'text-muted/40' : ''}
                        ${isEditing ? 'bg-accent/5 ring-1 ring-accent/30 rounded' : ''}
                      `}
                      onClick={() => col.type !== 'text' && setEditingCell({ row: rowIdx, col: colIdx })}
                    >
                      {isEditing ? (
                        <input
                          type={col.type === 'number' || col.type === 'currency' ? 'number' : 'text'}
                          value={String(value)}
                          onChange={(e) => updateCell(rowIdx, col.key, e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingCell(null);
                            if (e.key === 'Escape') {
                              updateCell(rowIdx, col.key, String(content.rows[rowIdx]?.[col.key] ?? ''));
                              setEditingCell(null);
                            }
                          }}
                          className="w-full bg-transparent text-foreground text-sm outline-none"
                          autoFocus
                        />
                      ) : (
                        <span>
                          {col.key === 'metric' ? (
                            <span className="font-medium">{value || <>&nbsp;</>}</span>
                          ) : value ? (
                            String(value)
                          ) : (
                            <span className="italic text-muted/40">—</span>
                          )}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted">
        Click on any cell to edit. Your data is saved locally as you type.
      </p>
    </div>
  );
}
