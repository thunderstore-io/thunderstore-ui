import { getSectionDefault } from "cyberstorm/utils/section";

import { type Section } from "@thunderstore/dapper/types";
import { type CommunityFilters } from "@thunderstore/thunderstore-api";

import { type CategorySelection } from "../types";
import {
  PackageOrderOptions,
  type PackageOrderOptionsType,
  isPackageOrderOptions,
} from "./components/packageOrderOptions";

export type SearchParamsType = {
  search: string;
  order: PackageOrderOptionsType | undefined;
  section: string;
  deprecated: boolean;
  nsfw: boolean;
  page: number;
  includedCategories: string;
  excludedCategories: string;
};

export const searchParamsToBlob = (
  searchParams: URLSearchParams,
  sections?: Section[]
) => {
  const initialSearch = searchParams.getAll("search").join(" ");
  const initialOrder = searchParams.get("ordering");
  const initialSection = searchParams.get("section");
  const initialDeprecated = searchParams.get("deprecated");
  const initialNsfw = searchParams.get("nsfw");
  const initialPage = searchParams.get("page");
  const initialIncludedCategories = searchParams.get("includedCategories");
  const initialExcludedCategories = searchParams.get("excludedCategories");

  return {
    search: initialSearch,
    order:
      initialOrder && isPackageOrderOptions(initialOrder)
        ? (initialOrder as PackageOrderOptionsType)
        : undefined,
    section: getSectionDefault(initialSection, sections),
    deprecated:
      initialDeprecated === null
        ? false
        : initialDeprecated === "true"
          ? true
          : initialDeprecated === "false"
            ? false
            : false,
    nsfw:
      initialNsfw === null
        ? false
        : initialNsfw === "true"
          ? true
          : initialNsfw === "false"
            ? false
            : false,
    page:
      initialPage &&
      !Number.isNaN(Number.parseInt(initialPage)) &&
      Number.isSafeInteger(Number.parseInt(initialPage))
        ? Math.max(1, Number.parseInt(initialPage))
        : 1,
    includedCategories:
      initialIncludedCategories !== null ? initialIncludedCategories : "",
    excludedCategories:
      initialExcludedCategories !== null ? initialExcludedCategories : "",
  };
};

export function parseCategories(
  includedCategories: string,
  excludedCategories: string,
  categories?: CategorySelection[]
): CategorySelection[] {
  if (!categories) return [];
  const iCArr = includedCategories.split(",");
  const eCArr = excludedCategories.split(",");
  return categories.map((c) =>
    iCArr.includes(c.id)
      ? { ...c, selection: "include" }
      : eCArr.includes(c.id)
        ? { ...c, selection: "exclude" }
        : c
  );
}

export const compareSearchParamBlobs = (
  b1: SearchParamsType,
  b2: SearchParamsType
) => {
  if (b1.search !== b2.search) return false;
  if (b1.includedCategories !== b2.includedCategories) return false;
  if (b1.excludedCategories !== b2.excludedCategories) return false;
  if (b1.page !== b2.page) return false;
  if (b1.deprecated !== b2.deprecated) return false;
  if (b1.nsfw !== b2.nsfw) return false;
  if (b1.order !== b2.order) return false;
  if (b1.section !== b2.section) return false;
  return true;
};

// Start setters
export const setParamsBlobCategories = (
  setter: (v: SearchParamsType) => void,
  oldBlob: SearchParamsType,
  v: CategorySelection[]
) => {
  const newSearchParams = { ...oldBlob };
  const includedCategories = v
    .filter((c) => c.selection === "include")
    .map((c) => c.id);
  if (includedCategories.length === 0) {
    newSearchParams.includedCategories = "";
  } else {
    newSearchParams.includedCategories = includedCategories.join(",");
  }
  const excludedCategories = v
    .filter((c) => c.selection === "exclude")
    .map((c) => c.id);
  if (excludedCategories.length === 0) {
    newSearchParams.excludedCategories = "";
  } else {
    newSearchParams.excludedCategories = excludedCategories.join(",");
  }
  setter({ ...newSearchParams });
};

export const resetParams = (
  setter: (v: SearchParamsType) => void,
  order: PackageOrderOptionsType | undefined,
  sortedSections: CommunityFilters["sections"] | undefined
) => {
  setter({
    search: "",
    order: order,
    section: getSectionDefault(null, sortedSections as Section[]),
    deprecated: false,
    nsfw: false,
    page: 1,
    includedCategories: "",
    excludedCategories: "",
  });
};

export const clearAll =
  (setter: (v: SearchParamsType) => void, oldBlob: SearchParamsType) => () =>
    setter({
      ...oldBlob,
      search: "",
      includedCategories: "",
      excludedCategories: "",
    });

export function synchronizeSearchParams(
  searchParams: URLSearchParams,
  debouncedSearchParamsBlob: SearchParamsType,
  searchParamsBlobRefCurrent: SearchParamsType,
  sortedSections: Section[] | undefined
): { useReplace: boolean; resetPage: boolean; newPage: number } {
  let useReplace = false;
  let resetPage = false;
  const oldSearch = searchParams.getAll("search").join(" ");
  const oldOrdering = searchParams.get("ordering") ?? undefined;
  const oldDeprecated = searchParams.get("deprecated") === "true";
  const oldNSFW = searchParams.get("nsfw") === "true";
  const oldIncludedCategories = searchParams.get("includedCategories") ?? "";
  const oldExcludedCategories = searchParams.get("excludedCategories") ?? "";
  const oldPage = searchParams.get("page")
    ? Math.max(1, Number(searchParams.get("page")))
    : 1;

  // Search
  if (oldSearch !== debouncedSearchParamsBlob.search) {
    const trimmedSearch = debouncedSearchParamsBlob.search.trim();
    if (trimmedSearch === "") {
      searchParams.delete("search");
    } else {
      searchParams.set("search", trimmedSearch);
    }
    resetPage = true;
    useReplace = true;
  }
  // Order
  if (oldOrdering !== debouncedSearchParamsBlob.order) {
    if (
      debouncedSearchParamsBlob.order === undefined ||
      debouncedSearchParamsBlob.order === PackageOrderOptions.Updated
    ) {
      searchParams.delete("ordering");
    } else {
      searchParams.set("ordering", debouncedSearchParamsBlob.order);
    }
    resetPage = true;
  }
  // Section
  if (sortedSections) {
    if (
      debouncedSearchParamsBlob.section === "" ||
      sortedSections.length === 0 ||
      debouncedSearchParamsBlob.section === sortedSections[0]?.uuid
    ) {
      searchParams.delete("section");
    } else {
      searchParams.set("section", debouncedSearchParamsBlob.section);
    }
  }

  // Reset page if section has changed
  if (
    searchParamsBlobRefCurrent.section !== debouncedSearchParamsBlob.section
  ) {
    resetPage = true;
  }

  // Deprecated
  if (oldDeprecated !== debouncedSearchParamsBlob.deprecated) {
    if (debouncedSearchParamsBlob.deprecated === false) {
      searchParams.delete("deprecated");
    } else {
      searchParams.set("deprecated", "true");
    }
    resetPage = true;
  }
  // NSFW
  if (oldNSFW !== debouncedSearchParamsBlob.nsfw) {
    if (debouncedSearchParamsBlob.nsfw === false) {
      searchParams.delete("nsfw");
    } else {
      searchParams.set("nsfw", "true");
    }
    resetPage = true;
  }
  // Categories
  if (oldIncludedCategories !== debouncedSearchParamsBlob.includedCategories) {
    if (debouncedSearchParamsBlob.includedCategories === "") {
      searchParams.delete("includedCategories");
    } else {
      searchParams.set(
        "includedCategories",
        debouncedSearchParamsBlob.includedCategories
      );
    }
    resetPage = true;
  }
  if (oldExcludedCategories !== debouncedSearchParamsBlob.excludedCategories) {
    if (debouncedSearchParamsBlob.excludedCategories === "") {
      searchParams.delete("excludedCategories");
    } else {
      searchParams.set(
        "excludedCategories",
        debouncedSearchParamsBlob.excludedCategories
      );
    }
    resetPage = true;
  }

  let newPage = oldPage;
  // Page number
  if (resetPage || debouncedSearchParamsBlob.page === 1) {
    searchParams.delete("page");
    newPage = 1;
  } else if (oldPage !== debouncedSearchParamsBlob.page) {
    searchParams.set("page", String(debouncedSearchParamsBlob.page));
    newPage = debouncedSearchParamsBlob.page;
  }

  return { useReplace, resetPage, newPage };
}
// End setters
