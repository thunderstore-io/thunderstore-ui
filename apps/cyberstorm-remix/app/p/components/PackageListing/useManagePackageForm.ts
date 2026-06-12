import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useRevalidator } from "react-router";

import { type useToast } from "@thunderstore/cyberstorm";
import {
  type CommunityFilters,
  type RequestConfig,
  extractApiErrorMessage,
  fetchCommunityFilters,
  fetchPackagePermissions,
  packageDeprecate,
  packageListingUpdate,
  packageUnlist,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

import { type getPrivateListing } from "../../listingUtils";

const UNLIST_CONFIRM_TIMEOUT_MS = 5000;
const TOAST_SUCCESS_DURATION_MS = 4000;
const TOAST_ERROR_DURATION_MS = 8000;

type Listing = NonNullable<Awaited<ReturnType<typeof getPrivateListing>>>;
type Permissions = Awaited<
  ReturnType<typeof fetchPackagePermissions>
>["permissions"];

export type ManagePackageCategoryOption = { value: string; label: string };

export interface ManagePackageFormBodyProps {
  listing: Listing;
  permissions: Permissions;
  communityFiltersErrorMessage: string | null;
  categoriesErrorMessage: string | null;
  isLoadingCommunityFilters: boolean;
  categoryOptions: ManagePackageCategoryOption[];
  isActionInProgress: boolean;
  selectedCategories: ManagePackageCategoryOption[];
  onCategoriesChange: (categories: string[]) => void;
  unlistConfirming: boolean;
  isUnlisting: boolean;
  onUnlist: () => void;
}

export interface ManagePackageFormFooterProps {
  listing: Listing;
  permissions: Permissions;
  isTogglingDeprecation: boolean;
  isActionInProgress: boolean;
  hasCategoryChanges: boolean;
  isSavingCategories: boolean;
  onToggleDeprecation: () => void;
  onSaveCategories: () => void;
}

export interface UseManagePackageFormParams {
  listing: Listing;
  permissions: Permissions;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
  isActionInProgressRef: RefObject<boolean>;
  enabled: boolean;
}

function categorySlugs(listing: Listing) {
  return listing.categories?.map((c) => c.slug) ?? [];
}

function sameCategories(a: string[], b: string[]) {
  return [...a].sort().join() === [...b].sort().join();
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export function useManagePackageForm({
  listing,
  permissions,
  config,
  toast,
  isActionInProgressRef,
  enabled,
}: UseManagePackageFormParams) {
  const { revalidate } = useRevalidator();

  const packageParams = useMemo(
    () => ({
      community: listing.community_identifier,
      namespace: listing.namespace,
      package: listing.name,
    }),
    [listing.community_identifier, listing.namespace, listing.name]
  );

  const [communityFilters, setCommunityFilters] =
    useState<CommunityFilters | null>(null);
  const [isLoadingCommunityFilters, setIsLoadingCommunityFilters] =
    useState(false);
  const [communityFiltersErrorMessage, setCommunityFiltersErrorMessage] =
    useState<string | null>(null);

  const categoryOptions = useMemo(
    () =>
      communityFilters?.package_categories.map((category) => ({
        value: category.slug,
        label: category.name,
      })) ?? [],
    [communityFilters?.package_categories]
  );

  const categoryNameBySlug = useMemo(
    () =>
      new Map(categoryOptions.map((option) => [option.value, option.label])),
    [categoryOptions]
  );

  const initialCategories = useMemo(
    () => categorySlugs(listing),
    [listing.categories]
  );

  const [categories, setCategories] = useState(initialCategories);
  const [isSavingCategories, setIsSavingCategories] = useState(false);
  const [isTogglingDeprecation, setIsTogglingDeprecation] = useState(false);
  const [categoriesErrorMessage, setCategoriesErrorMessage] = useState<
    string | null
  >(null);
  const [unlistConfirming, setUnlistConfirming] = useState(false);
  const [isUnlisting, setIsUnlisting] = useState(false);

  const isUnlistingRef = useRef(false);
  const isTogglingDeprecationRef = useRef(false);
  const isSavingCategoriesRef = useRef(false);

  const isActionInProgress =
    isSavingCategories || isTogglingDeprecation || isUnlisting;

  const syncActionInProgressRef = () => {
    isActionInProgressRef.current =
      isUnlistingRef.current ||
      isTogglingDeprecationRef.current ||
      isSavingCategoriesRef.current;
  };

  const clearUnlistInFlight = () => {
    isUnlistingRef.current = false;
    setIsUnlisting(false);
    setUnlistConfirming(false);
    syncActionInProgressRef();
  };

  const clearDeprecationInFlight = () => {
    isTogglingDeprecationRef.current = false;
    setIsTogglingDeprecation(false);
    syncActionInProgressRef();
  };

  const clearCategoriesSaveInFlight = () => {
    isSavingCategoriesRef.current = false;
    setIsSavingCategories(false);
    syncActionInProgressRef();
  };

  const showSuccessToast = (message: string) => {
    toast.addToast({
      csVariant: "success",
      children: message,
      duration: TOAST_SUCCESS_DURATION_MS,
    });
    revalidate();
  };

  const showErrorToast = (error: Error) => {
    toast.addToast({
      csVariant: "danger",
      children: extractApiErrorMessage(error),
      duration: TOAST_ERROR_DURATION_MS,
    });
  };

  useEffect(() => {
    if (!enabled) {
      clearUnlistInFlight();
      return;
    }
    setCategories(initialCategories);
    setCategoriesErrorMessage(null);
    clearUnlistInFlight();
  }, [enabled, initialCategories]);

  useEffect(() => {
    if (!enabled || !permissions.can_manage_categories || communityFilters) {
      return;
    }

    let cancelled = false;
    setIsLoadingCommunityFilters(true);
    setCommunityFiltersErrorMessage(null);

    void fetchCommunityFilters({
      config,
      params: { community_id: listing.community_identifier },
      data: {},
      queryParams: {},
    })
      .then((data) => {
        if (!cancelled) setCommunityFilters(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setCommunityFiltersErrorMessage(
            extractApiErrorMessage(toError(error))
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCommunityFilters(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    permissions.can_manage_categories,
    communityFilters,
    config,
    listing.community_identifier,
  ]);

  useEffect(() => {
    if (!unlistConfirming || isUnlisting) return;
    const timeout = setTimeout(
      () => setUnlistConfirming(false),
      UNLIST_CONFIRM_TIMEOUT_MS
    );
    return () => clearTimeout(timeout);
  }, [unlistConfirming, isUnlisting]);

  const deprecateToggleAction = ApiAction({
    endpoint: packageDeprecate,
  });

  const unlistAction = ApiAction({
    endpoint: packageUnlist,
  });

  const saveCategoriesAction = ApiAction({
    endpoint: packageListingUpdate,
  });

  const handleToggleDeprecation = async () => {
    if (isTogglingDeprecationRef.current) return;

    isTogglingDeprecationRef.current = true;
    setIsTogglingDeprecation(true);
    syncActionInProgressRef();

    try {
      await deprecateToggleAction({
        config,
        params: {
          namespace: packageParams.namespace,
          package: packageParams.package,
        },
        queryParams: {},
        data: { deprecate: !listing.is_deprecated },
        useSession: true,
      });
      showSuccessToast(
        listing.is_deprecated ? "Package undeprecated" : "Package deprecated"
      );
    } catch (error) {
      showErrorToast(toError(error));
    } finally {
      clearDeprecationInFlight();
    }
  };

  const handleUnlist = async () => {
    if (isUnlistingRef.current) return;
    if (!unlistConfirming) {
      setUnlistConfirming(true);
      return;
    }

    isUnlistingRef.current = true;
    setIsUnlisting(true);
    syncActionInProgressRef();

    try {
      await unlistAction({
        config,
        params: packageParams,
        queryParams: {},
        data: { unlist: "unlist" },
        useSession: true,
      });
      showSuccessToast("Package unlisted");
    } catch (error) {
      showErrorToast(toError(error));
    } finally {
      clearUnlistInFlight();
    }
  };

  const handleSaveCategories = async () => {
    if (isSavingCategoriesRef.current) return;

    setCategoriesErrorMessage(null);
    isSavingCategoriesRef.current = true;
    setIsSavingCategories(true);
    syncActionInProgressRef();

    try {
      await saveCategoriesAction({
        config,
        params: packageParams,
        queryParams: {},
        data: { categories },
        useSession: true,
      });
      setCategoriesErrorMessage(null);
      showSuccessToast("Categories saved");
    } catch (error) {
      setCategoriesErrorMessage(extractApiErrorMessage(toError(error)));
    } finally {
      clearCategoriesSaveInFlight();
    }
  };

  const canSaveCategories =
    permissions.can_manage_categories &&
    !isLoadingCommunityFilters &&
    communityFilters !== null;

  const hasCategoryChanges =
    canSaveCategories && !sameCategories(categories, initialCategories);

  const selectedCategories = categories.map((slug) => ({
    value: slug,
    label: categoryNameBySlug.get(slug) ?? slug,
  }));

  const bodyProps: ManagePackageFormBodyProps = {
    listing,
    permissions,
    communityFiltersErrorMessage,
    categoriesErrorMessage,
    isLoadingCommunityFilters,
    categoryOptions,
    selectedCategories,
    isActionInProgress,
    isUnlisting,
    unlistConfirming,
    onCategoriesChange: setCategories,
    onUnlist: handleUnlist,
  };

  const footerProps: ManagePackageFormFooterProps = {
    listing,
    permissions,
    isTogglingDeprecation,
    isSavingCategories,
    isActionInProgress,
    hasCategoryChanges,
    onToggleDeprecation: handleToggleDeprecation,
    onSaveCategories: handleSaveCategories,
  };

  return { bodyProps, footerProps };
}
