import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useRevalidator } from "react-router";

import {
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewSelectSearchMultiple,
  NewTag,
  useToast,
} from "@thunderstore/cyberstorm";
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
import "./ManagePackageForm.css";

const UNLIST_CONFIRM_TIMEOUT_MS = 5000;
const TOAST_SUCCESS_DURATION_MS = 4000;
const TOAST_ERROR_DURATION_MS = 8000;

type Listing = NonNullable<Awaited<ReturnType<typeof getPrivateListing>>>;
type Permissions = Awaited<
  ReturnType<typeof fetchPackagePermissions>
>["permissions"];

export interface ManagePackageFormProps {
  listing: Listing;
  permissions: Permissions;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}

function categorySlugs(listing: Listing) {
  return listing.categories?.map((c) => c.slug) ?? [];
}

function sameCategories(a: string[], b: string[]) {
  return [...a].sort().join() === [...b].sort().join();
}

export function ManagePackageForm({
  listing,
  permissions,
  config,
  toast,
}: ManagePackageFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActionInProgressRef = useRef(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && isActionInProgressRef.current) return;
    setIsOpen(open);
  };

  return (
    <Modal
      csSize="medium"
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <NewButton csSize="small">
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faCog} />
          </NewIcon>
          Manage Package
        </NewButton>
      }
      titleContent="Manage Package"
    >
      {isOpen ? (
        <ManagePackageFormContent
          listing={listing}
          permissions={permissions}
          config={config}
          toast={toast}
          isActionInProgressRef={isActionInProgressRef}
        />
      ) : null}
    </Modal>
  );
}

interface ManagePackageFormContentProps extends ManagePackageFormProps {
  isActionInProgressRef: RefObject<boolean>;
}

function ManagePackageFormContent({
  listing,
  permissions,
  config,
  toast,
  isActionInProgressRef,
}: ManagePackageFormContentProps) {
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
    setCategories(initialCategories);
    setCategoriesErrorMessage(null);
    clearUnlistInFlight();
  }, [initialCategories]);

  useEffect(() => {
    if (!permissions.can_manage_categories || communityFilters) {
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
            extractApiErrorMessage(
              error instanceof Error ? error : new Error(String(error))
            )
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
        listing.is_deprecated ? "Package published" : "Package deprecated"
      );
    } catch (error) {
      showErrorToast(error instanceof Error ? error : new Error(String(error)));
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
      showErrorToast(error instanceof Error ? error : new Error(String(error)));
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
      setCategoriesErrorMessage(
        extractApiErrorMessage(
          error instanceof Error ? error : new Error(String(error))
        )
      );
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

  return (
    <>
      <Modal.Body className="manage-package__body">
        {permissions.can_manage_categories && (
          <>
            {communityFiltersErrorMessage && (
              <NewAlert csVariant="danger">
                {communityFiltersErrorMessage}
              </NewAlert>
            )}
            {categoriesErrorMessage && (
              <NewAlert csVariant="danger">{categoriesErrorMessage}</NewAlert>
            )}
            <NewAlert csVariant="info">
              Changes might take several minutes to show publicly! Info shown
              below is always up to date.
            </NewAlert>
          </>
        )}

        {permissions.can_manage_deprecation && (
          <section className="manage-package__block">
            <p className="manage-package__label">Package status</p>
            <NewTag
              csSize="small"
              csVariant={listing.is_deprecated ? "yellow" : "green"}
            >
              {listing.is_deprecated ? "Deprecated" : "Active"}
            </NewTag>
          </section>
        )}

        {permissions.can_manage_categories && (
          <section className="manage-package__block">
            <p className="manage-package__label">Edit categories</p>
            <NewSelectSearchMultiple
              placeholder={
                isLoadingCommunityFilters
                  ? "Loading categories…"
                  : "Select categories"
              }
              options={categoryOptions}
              disabled={isActionInProgress || isLoadingCommunityFilters}
              onChange={(val) => {
                setCategories(val?.map((option) => option.value) ?? []);
              }}
              value={selectedCategories}
            />
          </section>
        )}

        {permissions.can_unlist && (
          <section className="manage-package__block">
            <p className="manage-package__label">Listed</p>
            <p className="manage-package__description">
              Control if the package is listed on Thunderstore (in any
              community).
            </p>
            <NewAlert csVariant="danger">
              When you unlist the package, this page too will become
              unavailable.
            </NewAlert>
            <NewButton
              onClick={handleUnlist}
              csSize="medium"
              csVariant="danger"
              disabled={isActionInProgress}
            >
              {isUnlisting
                ? "Unlisting…"
                : unlistConfirming
                  ? "Confirm unlist"
                  : "Unlist"}
            </NewButton>
          </section>
        )}
      </Modal.Body>

      <Modal.Footer className="modal-content__footer">
        {permissions.can_manage_deprecation && (
          <NewButton
            onClick={handleToggleDeprecation}
            csSize="medium"
            csVariant={listing.is_deprecated ? "success" : "warning"}
            rootClasses="manage-package__deprecate-button"
            disabled={isActionInProgress}
          >
            {isTogglingDeprecation
              ? listing.is_deprecated
                ? "Publishing…"
                : "Deprecating…"
              : listing.is_deprecated
                ? "Publish"
                : "Deprecate"}
          </NewButton>
        )}
        {hasCategoryChanges ? (
          <NewButton
            csVariant="accent"
            onClick={handleSaveCategories}
            disabled={isActionInProgress}
          >
            {isSavingCategories ? "Saving…" : "Save changes"}
          </NewButton>
        ) : (
          <Modal.Close asChild>
            <NewButton csVariant="secondary" disabled={isActionInProgress}>
              Close
            </NewButton>
          </Modal.Close>
        )}
      </Modal.Footer>
    </>
  );
}
