export type DynamicLink = {
  title: string;
  url: string;
};

export type PaginatedList<T> = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
};
