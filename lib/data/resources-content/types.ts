// Resource content type definitions
// Each resource can have structured content in both English and Spanish

export interface ResourceSection {
  heading: string;
  body: string; // Markdown
  subsections?: ResourceSection[];
}

export interface TemplateField {
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date';
  options?: string[];
  required?: boolean;
}

export interface TemplateContent {
  description: string;
  fields: TemplateField[];
  sections: ResourceSection[];
}

export interface SpreadsheetColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'percent' | 'date' | 'formula';
  width?: number;
  formula?: string;
}

export interface SpreadsheetContent {
  description: string;
  columns: SpreadsheetColumn[];
  rows: Record<string, string | number>[];
  formulas?: Record<string, string>;
}

export interface CheatsheetItem {
  term: string;
  definition: string;
  example?: string;
}

export interface CheatsheetContent {
  intro: string;
  items: CheatsheetItem[];
  tip?: string;
}

export interface InfographicSection {
  title: string;
  points: string[];
  visual?: string; // emoji or icon reference
}

export interface InfographicContent {
  description: string;
  sections: InfographicSection[];
  keyTakeaway: string;
}

export interface AudioChapter {
  title: string;
  duration: string; // "MM:SS"
  src?: string;
}

export interface AudioContent {
  description: string;
  narrator?: string;
  totalDuration: string;
  chapters: AudioChapter[];
  transcript?: string;
}

export interface SOPContent {
  purpose: string;
  frequency: string;
  owner: string;
  steps: { step: number; action: string; detail: string; tools?: string }[];
  kpis: string[];
}

export type ResourceContentType =
  | { kind: 'guide'; content: { sections: ResourceSection[] }; contentEs: { sections: ResourceSection[] } }
  | { kind: 'template'; content: TemplateContent; contentEs: TemplateContent }
  | { kind: 'spreadsheet'; content: SpreadsheetContent; contentEs: SpreadsheetContent }
  | { kind: 'cheatsheet'; content: CheatsheetContent; contentEs: CheatsheetContent }
  | { kind: 'infographic'; content: InfographicContent; contentEs: InfographicContent }
  | { kind: 'ebook'; content: { sections: ResourceSection[] }; contentEs: { sections: ResourceSection[] } }
  | { kind: 'sop'; content: SOPContent; contentEs: SOPContent }
  | { kind: 'audio'; content: AudioContent; contentEs: AudioContent };
