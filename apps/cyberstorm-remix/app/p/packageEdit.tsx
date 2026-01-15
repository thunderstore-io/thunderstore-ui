import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";
import {
  NewAlert,
  NewButton,
  NewIcon,
  NewSelectSearch,
  NewTag,
  SkeletonBox,
  formatToDisplayName,
  useToast,
} from "@thunderstore/cyberstorm";
import "./packageEdit.css";
import {
  packageDeprecate,
  packageListingUpdate,
  type PackageListingUpdateRequestData,
  packageUnlist,
  isApiError,
} from "@thunderstore/thunderstore-api";
import { type OutletContextShape } from "~/root";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck } from "@fortawesome/pro-solid-svg-icons";
import { getDapperForRequest } from "cyberstorm/utils/dapperSingleton";
import { getPrivateListing } from "app/p/listingUtils";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

export const meta: MetaFunction<typeof clientLoader> = ({ data }) => {
  return [
    {
      title: data
        ? `${formatToDisplayName(data.listing.name)} - Edit package`
        : "Edit package",
    },
  ];
};

const package404 = new Response("Package not found", { status: 404 });

export async function loader() {
  return undefined;
}

export async function clientLoader({ params, request }: LoaderFunctionArgs) {
  const { communityId, namespaceId, packageId } = params;

  if (!communityId || !namespaceId || !packageId) {
    throw package404;
  }

  try {
    const dapper = getDapperForRequest(request);

    // Fetch everything at once for faster page load, even if we may
    //  overfetch in case we lack authentication/authorization.
    const [listing, permissions, filters] = await Promise.all([
      getPrivateListing(dapper, { communityId, namespaceId, packageId }),
      dapper.getPackagePermissions(communityId, namespaceId, packageId),
      dapper.getCommunityFilters(communityId),
    ]);

    if (!permissions) {
      throw new Response("Unauthenticated", { status: 401 });
    } else if (
      !permissions.permissions.can_manage &&
      !permissions.permissions.can_moderate
    ) {
      throw new Response("Unauthorized", { status: 403 });
    }

    return { listing, permissions, filters };
  } catch (error) {
    if (isApiError(error) && error.response.status === 404) {
      throw package404;
    }
    throw error;
  }
}

clientLoader.hydrate = true;

export default function PackageListing() {
  const loaderData = useLoaderData<typeof loader | typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;
  const config = outletContext.requestConfig;
  const toast = useToast();
  const revalidator = useRevalidator();

  const deprecateToggleAction = ApiAction({
    endpoint: packageDeprecate,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: listing.is_deprecated
          ? "Package undeprecated"
          : "Package deprecated",
        duration: 4000,
      });
      revalidator.revalidate();
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  const unlistAction = ApiAction({
    endpoint: packageUnlist,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: "Package unlisted",
        duration: 4000,
      });
      revalidator.revalidate();
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  function formFieldUpdateAction(
    state: PackageListingUpdateRequestData,
    action: {
      field: keyof PackageListingUpdateRequestData;
      value: PackageListingUpdateRequestData[keyof PackageListingUpdateRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    categories: loaderData?.listing?.categories?.map((c) => c.slug) ?? [],
  });

  type SubmitorOutput = Awaited<ReturnType<typeof packageListingUpdate>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    if (!listing) {
      throw new Error("Listing not loaded");
    }

    return await packageListingUpdate({
      config: config,
      params: {
        community: listing.community_identifier,
        namespace: listing.namespace,
        package: listing.name,
      },
      queryParams: {},
      data: { categories: data.categories },
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    PackageListingUpdateRequestData,
    Error,
    SubmitorOutput,
    Error,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Changes saved!`,
        duration: 4000,
      });
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  if (!loaderData) {
    return <SkeletonBox className="package-edit__skeleton" />;
  }

  const { listing, filters, permissions } = loaderData;

  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        Edit package
      </PageHeader>
      <div className="package-edit__main">
        <section className="package-edit__section">
          {permissions.permissions.can_unlist && (
            <>
              <div className="package-edit__row">
                <div className="package-edit__info">
                  <div className="package-edit__title">Listed</div>
                  <div className="package-edit__description">
                    Control if the package is listed on Thunderstore. (in any
                    community)
                  </div>
                </div>
                <div className="package-edit__row-content">
                  <div className="package-edit__status">
                    <NewAlert csVariant="danger">
                      When you unlist the package, this page too will become
                      unavailable.
                    </NewAlert>
                  </div>
                  <NewButton
                    onClick={() =>
                      unlistAction({
                        config: config,
                        params: {
                          community: listing.community_identifier,
                          namespace: listing.namespace,
                          package: listing.name,
                        },
                        queryParams: {},
                        data: { unlist: "unlist" },
                        useSession: true,
                      })
                    }
                    csSize="medium"
                    csVariant="danger"
                  >
                    Unlist
                  </NewButton>
                </div>
              </div>
              <div className="package-edit__divider" />
            </>
          )}
          {permissions.permissions.can_manage_deprecation && (
            <>
              <div className="package-edit__row">
                <div className="package-edit__info">
                  <div className="package-edit__title">Status</div>
                  <div className="package-edit__description">
                    Control the status of your package.
                  </div>
                </div>
                <div className="package-edit__row-content">
                  <div className="package-edit__status">
                    <NewTag
                      csSize="small"
                      csVariant={listing.is_deprecated ? "yellow" : "green"}
                    >
                      <NewIcon csMode="inline" noWrapper>
                        <FontAwesomeIcon
                          icon={listing.is_deprecated ? faBan : faCheck}
                        />
                      </NewIcon>
                      {listing.is_deprecated ? "Deprecated" : "Active"}
                    </NewTag>
                    <span className="package-edit__status-description">
                      {listing.is_deprecated
                        ? "This package is marked as deprecated and is not listed on Thunderstore."
                        : "This package is marked as active and is listed on Thunderstore."}
                    </span>
                  </div>
                  <NewButton
                    onClick={() =>
                      deprecateToggleAction({
                        config: config,
                        params: {
                          namespace: listing.namespace,
                          package: listing.name,
                        },
                        queryParams: {},
                        data: { deprecate: !listing.is_deprecated },
                        useSession: true,
                      })
                    }
                    csSize="medium"
                    csVariant={listing.is_deprecated ? "success" : "warning"}
                  >
                    {listing.is_deprecated ? "Undeprecate" : "Deprecate"}
                  </NewButton>
                </div>
              </div>
              <div className="package-edit__divider" />
            </>
          )}
          {permissions?.permissions.can_manage_categories ? (
            <>
              <div className="package-edit__row">
                <div className="package-edit__info">
                  <div className="package-edit__title">Categories</div>
                  <div className="package-edit__description">
                    Select descriptive categories to help people discover your
                    package.
                  </div>
                </div>
                <div className="package-edit__row-content">
                  <NewSelectSearch
                    placeholder="Select categories"
                    multiple
                    options={filters.package_categories.map((category) => ({
                      value: category.slug,
                      label: category.name,
                    }))}
                    onChange={(val) => {
                      updateFormFieldState({
                        field: "categories",
                        value: val ? val.map((v) => v.value) : [],
                      });
                    }}
                    value={formInputs.categories.map((categoryId) => ({
                      value: categoryId,
                      label:
                        filters.package_categories.find(
                          (c) => c.slug === categoryId
                        )?.name || "",
                    }))}
                  />
                </div>
              </div>
            </>
          ) : null}
          <div className="package-edit__divider" />
          <div className="package-edit__row">
            <div className="package-edit__info">
              <div className="package-edit__title">Save changes</div>
              <div className="package-edit__description">
                Your changes will take effect after hitting “Save”.
              </div>
            </div>
            <div className="package-edit__actions">
              <NewButton
                csVariant="secondary"
                csSize="big"
                primitiveType="cyberstormLink"
                linkId="Package"
                community={listing.community_identifier}
                namespace={listing.namespace}
                package={listing.name}
              >
                Cancel
              </NewButton>
              <NewButton
                csVariant="accent"
                csSize="big"
                onClick={() => {
                  strongForm.submit();
                }}
                rootClasses="package-edit__save-button"
              >
                Save changes
              </NewButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
