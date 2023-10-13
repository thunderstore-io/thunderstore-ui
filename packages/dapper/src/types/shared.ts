export type DynamicLink = {
  title: string;
  url: string;
};

export interface PackageCategory {
  name: string;
  slug: string;
}

export type PaginatedList<T> = {
  count: number;
  hasMore: boolean;
  results: T[];
};
