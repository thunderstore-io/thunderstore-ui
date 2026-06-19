export type DynamicLink = {
  title: string;
  url: string;
};

export type MarkdownResponse = {
  html: string;
};

export type HTMLContentResponse = {
  html: string;
};

export interface PackageCategory {
  id: string;
  name: string;
  slug: string;
}

export type ModeratorNoteTargetType = "community" | "listing" | "version";

export interface ModeratorNote {
  id: number;
  target_type: ModeratorNoteTargetType;
  content: string;
  // Set only for version notes.
  version_number: string | null;
  is_active: boolean;
  datetime_created: string;
  datetime_updated: string;
}

export type PaginatedList<T> = {
  count: number;
  hasMore: boolean;
  results: T[];
};
