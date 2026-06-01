import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRevalidator } from "react-router";

import {
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewSelectSearch,
  NewTag,
  useToast,
} from "@thunderstore/cyberstorm";
import { type DapperTsInterface } from "@thunderstore/dapper-ts";
import {
  type RequestConfig,
  extractApiErrorMessage,
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
type CommunityFilters = Awaited<
  ReturnType<DapperTsInterface["getCommunityFilters"]>
>;

export interface ManagePackageFormProps {
  listing: Listing;
  permissions: Permissions;
  communityFilters: CommunityFilters;
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
  communityFilters,
  config,
  toast,
}: ManagePackageFormProps) {
  const { revalidate } = useRevalidator();

  const packageParams = useMemo(
    () => ({
      community: listing.community_identifier,
      namespace: listing.namespace,
      package: listing.name,
    }),
    [listing.community_identifier, listing.namespace, listing.name]
  );

  const categoryOptions = useMemo(
    () =>
      communityFilters.package_categories.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
    [communityFilters.package_categories]
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

  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [isSavingCategories, setIsSavingCategories] = useState(false);
  const [isTogglingDeprecation, setIsTogglingDeprecation] = useState(false);
  const [categoriesErrorMessage, setCategoriesErrorMessage] = useState<
    string | null
  >(null);
  const [unlistConfirming, setUnlistConfirming] = useState(false);

  const isActionInProgress = isSavingCategories || isTogglingDeprecation;
  const wasOpenRef = useRef(false);

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
    const justOpened = isOpen && !wasOpenRef.current;
    wasOpenRef.current = isOpen;
    if (justOpened) {
      setCategories(initialCategories);
      setCategoriesErrorMessage(null);
    }
  }, [isOpen, initialCategories]);

  useEffect(() => {
    if (!unlistConfirming) return;
    const timeout = setTimeout(
      () => setUnlistConfirming(false),
      UNLIST_CONFIRM_TIMEOUT_MS
    );
    return () => clearTimeout(timeout);
  }, [unlistConfirming]);

  const deprecateToggleAction = ApiAction({
    endpoint: packageDeprecate,
    onSubmitSuccess: () => {
      setIsTogglingDeprecation(false);
      showSuccessToast(
        listing.is_deprecated ? "Package published" : "Package deprecated"
      );
    },
    onSubmitError: (error) => {
      setIsTogglingDeprecation(false);
      showErrorToast(error);
    },
  });

  const unlistAction = ApiAction({
    endpoint: packageUnlist,
    onSubmitSuccess: () => {
      setUnlistConfirming(false);
      showSuccessToast("Package unlisted");
    },
    onSubmitError: showErrorToast,
  });

  const saveCategoriesAction = ApiAction({
    endpoint: packageListingUpdate,
    onSubmitSuccess: () => {
      setIsSavingCategories(false);
      setCategoriesErrorMessage(null);
      showSuccessToast("Categories saved");
    },
    onSubmitError: (error) => {
      setIsSavingCategories(false);
      setCategoriesErrorMessage(extractApiErrorMessage(error));
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) setUnlistConfirming(false);
    if (!open && isActionInProgress) return;
    setIsOpen(open);
  };

  const handleToggleDeprecation = () => {
    setIsTogglingDeprecation(true);
    void deprecateToggleAction({
      config,
      params: {
        namespace: packageParams.namespace,
        package: packageParams.package,
      },
      queryParams: {},
      data: { deprecate: !listing.is_deprecated },
      useSession: true,
    });
  };

  const handleUnlist = () => {
    if (!unlistConfirming) {
      setUnlistConfirming(true);
      return;
    }
    void unlistAction({
      config,
      params: packageParams,
      queryParams: {},
      data: { unlist: "unlist" },
      useSession: true,
    });
  };

  const handleSaveCategories = () => {
    setCategoriesErrorMessage(null);
    setIsSavingCategories(true);
    void saveCategoriesAction({
      config,
      params: packageParams,
      queryParams: {},
      data: { categories },
      useSession: true,
    });
  };

  const hasCategoryChanges =
    permissions.can_manage_categories &&
    !sameCategories(categories, initialCategories);

  const selectedCategories = categories.map((slug) => ({
    value: slug,
    label: categoryNameBySlug.get(slug) ?? slug,
  }));

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
      <Modal.Body className="manage-package__body">
        {permissions.can_manage_categories && (
          <>
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
            <NewSelectSearch
              placeholder="Select categories"
              multiple
              options={categoryOptions}
              disabled={isActionInProgress}
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
              {unlistConfirming ? "Confirm unlist" : "Unlist"}
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
            {listing.is_deprecated ? "Publish" : "Deprecate"}
          </NewButton>
        )}
        {hasCategoryChanges ? (
          <NewButton
            csVariant="accent"
            onClick={handleSaveCategories}
            disabled={isActionInProgress}
          >
            Save changes
          </NewButton>
        ) : (
          <Modal.Close asChild>
            <NewButton csVariant="secondary" disabled={isActionInProgress}>
              Close
            </NewButton>
          </Modal.Close>
        )}
      </Modal.Footer>
    </Modal>
  );
}
