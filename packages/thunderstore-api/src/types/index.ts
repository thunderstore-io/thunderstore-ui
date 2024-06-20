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
  // Amount of days that the package must be created on or after
  created_recent: string;
  // Amount of days that the package must be updated on or after
  updated_recent: string;
  // Date that the package must be created ON or AFTER
  created_after: string;
  // Date that the package must be created ON or BEFORE
  created_before: string;
  // Date when the package has to been last updated ON or AFTER
  updated_after: string;
  // Date when the package has to been last updated ON or BEFORE
  updated_before: string;
}
