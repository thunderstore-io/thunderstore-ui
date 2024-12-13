/**
 * Parameters for ordering, paginating, and filtering package lists.
 */
export interface PackageListingQueryParams {
  /** Ordering for the results */
  ordering: string;
  /** Page number for the paginated results */
  page: number;
  /** Free text search for filtering e.g. by package name */
  q: string;
  /** Ids of categories the package MUST belong to */
  includedCategories: string[];
  /** Ids of categories the package MUST NOT belong to */
  excludedCategories: string[];
  /**
   * UUID of community's section the package MUST fit.
   *
   * Sections are community-specific shorthands for filtering by
   * multiple included and excluded categories at once.
   * */
  section: string;
  /** Should NSFW packages be included (by default they're not) */
  nsfw: boolean;
  /** Should deprecated packages be included (by default they're not) */
  deprecated: boolean;
  // Disabled until the UX for date filtering is resolved
}
