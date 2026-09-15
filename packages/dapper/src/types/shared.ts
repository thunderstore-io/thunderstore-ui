export type DynamicLink = {
  title: string;
  url: string;
};

export type MarkdownResponse = {
  html: string;
  is_edited?: boolean;
  edited_at?: string | null;
};

export type HTMLContentResponse = {
  html: string;
  is_edited?: boolean;
  edited_at?: string | null;
};

export interface PackageCategory {
  id: string;
  name: string;
  slug: string;
}

export type PaginatedList<T> = {
  count: number;
  hasMore: boolean;
  results: T[];
};
