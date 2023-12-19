export type DynamicLink = {
  title: string;
  url: string;
};

export type MarkdownResponse = {
  html: string;
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
