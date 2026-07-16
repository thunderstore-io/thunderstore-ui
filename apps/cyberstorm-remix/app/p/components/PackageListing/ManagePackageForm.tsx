import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

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
  type RequestConfig,
  fetchPackagePermissions,
} from "@thunderstore/thunderstore-api";

import { type getPrivateListing } from "../../listingUtils";
import "./ManagePackageForm.css";
import {
  type ManagePackageFormBodyProps,
  type ManagePackageFormFooterProps,
  useManagePackageForm,
} from "./useManagePackageForm";

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

  const { bodyProps, footerProps } = useManagePackageForm({
    listing,
    permissions,
    config,
    toast,
    isActionInProgressRef,
    enabled: isOpen,
  });

  return (
    <Modal
      csSize="medium"
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <NewButton
          csSize="small"
          csModifiers={["only-icon"]}
          aria-label="Manage Package"
          tooltipText="Manage Package"
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faCog} />
          </NewIcon>
        </NewButton>
      }
      titleContent="Manage Package"
      disableBody
    >
      {isOpen ? (
        <>
          <ManagePackageFormBody {...bodyProps} />
          <ManagePackageFormFooter {...footerProps} />
        </>
      ) : null}
    </Modal>
  );
}

function ManagePackageFormBody({
  listing,
  permissions,
  communityFiltersErrorMessage,
  categoriesErrorMessage,
  isLoadingCommunityFilters,
  categoryOptions,
  isActionInProgress,
  selectedCategories,
  onCategoriesChange,
  unlistConfirming,
  isUnlisting,
  onUnlist,
}: ManagePackageFormBodyProps) {
  return (
    <Modal.Body>
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
            {listing.is_deprecated ? "Deprecated" : "Not deprecated"}
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
              onCategoriesChange(val?.map((option) => option.value) ?? []);
            }}
            value={selectedCategories}
          />
        </section>
      )}

      {permissions.can_unlist && (
        <section className="manage-package__block">
          <p className="manage-package__label">Listed</p>
          <p className="manage-package__description">
            Control if the package is listed on Thunderstore (in any community).
          </p>
          <NewAlert csVariant="danger">
            When you unlist the package, this page too will become unavailable.
          </NewAlert>
          <NewButton
            onClick={onUnlist}
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
  );
}

function ManagePackageFormFooter({
  listing,
  permissions,
  isTogglingDeprecation,
  deprecationConfirming,
  isActionInProgress,
  hasCategoryChanges,
  isSavingCategories,
  onToggleDeprecation,
  onSaveCategories,
}: ManagePackageFormFooterProps) {
  return (
    <Modal.Footer>
      {permissions.can_manage_deprecation && (
        <NewButton
          onClick={onToggleDeprecation}
          csSize="medium"
          csVariant={listing.is_deprecated ? "success" : "warning"}
          rootClasses="manage-package__deprecate-button"
          disabled={isActionInProgress}
        >
          {isTogglingDeprecation
            ? listing.is_deprecated
              ? "Undeprecating…"
              : "Deprecating…"
            : deprecationConfirming
              ? listing.is_deprecated
                ? "Confirm undeprecate"
                : "Confirm deprecate"
              : listing.is_deprecated
                ? "Undeprecate"
                : "Deprecate"}
        </NewButton>
      )}
      {hasCategoryChanges ? (
        <NewButton
          csVariant="accent"
          onClick={onSaveCategories}
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
  );
}
