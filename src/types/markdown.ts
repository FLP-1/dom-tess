export interface MarkdownHeading {
  level: number;
  text: string;
  id: string;
}

export interface MarkdownLink {
  href: string;
  title?: string;
  text: string;
}

export interface MarkdownImage {
  src: string;
  alt?: string;
  title?: string;
}

export interface MarkdownTable {
  headers: string[];
  rows: string[][];
}

export interface MarkdownCode {
  language?: string;
  value: string;
}

export interface MarkdownList {
  ordered: boolean;
  items: string[];
}

export interface MarkdownBlockquote {
  text: string;
  citation?: string;
}

export interface MarkdownDocument {
  title?: string;
  description?: string;
  headings: MarkdownHeading[];
  links: MarkdownLink[];
  images: MarkdownImage[];
  tables: MarkdownTable[];
  code: MarkdownCode[];
  lists: MarkdownList[];
  blockquotes: MarkdownBlockquote[];
  content: string;
}

export type MarkdownParser = (markdown: string) => MarkdownDocument;

export interface MarkdownRendererProps {
  markdown: string;
  components?: {
    heading?: React.ComponentType<{ level: number; children: React.ReactNode }>;
    link?: React.ComponentType<{ href: string; children: React.ReactNode }>;
    image?: React.ComponentType<{ src: string; alt?: string }>;
    table?: React.ComponentType<{ headers: string[]; rows: string[][] }>;
    code?: React.ComponentType<{ language?: string; value: string }>;
    list?: React.ComponentType<{ ordered: boolean; items: string[] }>;
    blockquote?: React.ComponentType<{ text: string; citation?: string }>;
  };
} 