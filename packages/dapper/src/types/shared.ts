export type DynamicLink = {
  title: string;
  url: string;
};

export type PaginatedList<T> = {
  count: number;
  hasMore: boolean;
  results: T[];
};
