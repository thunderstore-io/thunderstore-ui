export type DynamicLink = {
  title: string;
  url: string;
};

export interface PackageCategory {
  id: number;
  name: string;
  slug: string;
}

export type PaginatedList<T> = {
  count: number;
  hasMore: boolean;
  results: T[];
};
