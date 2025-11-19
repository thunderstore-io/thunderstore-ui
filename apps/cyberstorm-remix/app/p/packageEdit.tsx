import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router";
import {
  NewAlert,
  NewButton,
  NewIcon,
  NewSelectSearch,
  NewTag,
  formatToDisplayName,
  useToast,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import "./packageEdit.css";
import {
  packageDeprecate,
  packageListingUpdate,
  type PackageListingUpdateRequestData,
  packageUnlist,
  UserFacingError,
} from "@thunderstore/thunderstore-api";
import { type OutletContextShape } from "~/root";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { Suspense, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck } from "@fortawesome/pro-solid-svg-icons";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import type { DapperTsInterface } from "@thunderstore/dapper-ts";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data
        ? `${formatToDisplayName(data[0].name)} - Edit package`
        : "Edit package",
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const { dapper } = getLoaderTools();
      const resolvedData = await Promise.all([
        dapper.getCommunity(params.communityId),
        dapper.getCommunityFilters(params.communityId),
        dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
        dapper.getTeamDetails(params.namespaceId),
        undefined,
      ]);

      return resolvedData;
    } catch (error) {
      handleLoaderError(error);
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Package not found.",
    description: "We could not find the requested package.",
    category: "not_found",
    status: 404,
  });
}

// TODO: Needs to check if package is available for the logged in user
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const { dapper } = getLoaderTools();

      const permissionsPromise = dapper.getPackagePermissions(
        params.communityId,
        params.namespaceId,
        params.packageId
      );

      const permissions = await permissionsPromise;

      if (!permissions?.permissions.can_manage) {
        throwUserFacingPayloadResponse({
          headline: "You do not have permission to edit this package.",
          description: "Sign in with a team member account to continue.",
          category: "auth",
          status: 403,
        });
      }

      const promises = Promise.all([
        dapper.getCommunity(params.communityId),
        dapper.getCommunityFilters(params.communityId),
        dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
        dapper.getTeamDetails(params.namespaceId),
        permissionsPromise,
      ]);

      return promises;
    } catch (error) {
      handleLoaderError(error);
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Package not found.",
    description: "We could not find the requested package.",
    category: "not_found",
    status: 404,
  });
}

clientLoader.hydrate = true;

/**
 * Renders the package edit page and defers loading states to Suspense/Await.
 */
export default function PackageListing() {
  const loaderData = useLoaderData<typeof loader | typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;
  const config = outletContext.requestConfig;
  const toast = useToast();
  const revalidator = useRevalidator();

  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        Edit package
      </PageHeader>
      <div className="package-edit__main">
        <Suspense fallback={<PackageEditSkeleton />}>
          <Await
            resolve={loaderData}
            errorElement={<NimbusAwaitErrorElement />}
          >
            {(resolvedData) => {
              const data = {
                community: resolvedData[0],
                filters: resolvedData[1],
                listing: resolvedData[2],
                team: resolvedData[3],
                permissions: resolvedData[4],
              };

              return (
                <PackageEditContent
                  data={data}
                  config={config}
                  toast={toast}
                  revalidator={revalidator}
                />
              );
            }}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

type PackageEditResolvedData = {
  community: Awaited<ReturnType<DapperTsInterface["getCommunity"]>>;
  listing: Awaited<ReturnType<DapperTsInterface["getPackageListingDetails"]>>;
  filters: Awaited<ReturnType<DapperTsInterface["getCommunityFilters"]>>;
  permissions:
    | Awaited<ReturnType<DapperTsInterface["getPackagePermissions"]>>
    | undefined;
};

type PackageEditContentProps = {
  data: PackageEditResolvedData;
  config: OutletContextShape["requestConfig"];
  toast: ReturnType<typeof useToast>;
  revalidator: ReturnType<typeof useRevalidator>;
};

/**
 * Provides the interactive package edit form once all dependencies resolve.
 */
function PackageEditContent({
  data,
  config,
  toast,
  revalidator,
}: PackageEditContentProps) {
  const { community, listing, filters, permissions } = data;

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
        children: error.description
          ? `${error.headline} ${error.description}`
          : error.headline,
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
        children: error.description
          ? `${error.headline} ${error.description}`
          : error.headline,
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
    categories: listing.categories.map((category) => category.slug),
  });

  type SubmitorOutput = Awaited<ReturnType<typeof packageListingUpdate>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await packageListingUpdate({
      config: config,
      params: {
        community: community.identifier,
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

  const { submit: submitPackageUpdate } = useStrongForm<
    typeof formInputs,
    PackageListingUpdateRequestData,
    Error,
    SubmitorOutput,
    UserFacingError,
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
        children: error.description
          ? `${error.headline} ${error.description}`
          : error.headline,
        duration: 8000,
      });
    },
  });

  return (
    <section className="package-edit__section">
      {permissions?.permissions.can_unlist ? (
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
                      community: community.identifier,
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
      ) : null}
      {permissions?.permissions.can_manage_deprecation ? (
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
      ) : null}
      <div className="package-edit__row">
        <div className="package-edit__info">
          <div className="package-edit__title">Categories</div>
          <div className="package-edit__description">
            Select descriptive categories to help people discover your package.
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
                  (category) => category.slug === categoryId
                )?.name || "",
            }))}
          />
        </div>
      </div>
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
              submitPackageUpdate();
            }}
            rootClasses="package-edit__save-button"
          >
            Save changes
          </NewButton>
        </div>
      </div>
    </section>
  );
}

/**
 * Displays a basic skeleton layout while package edit data streams in.
 */
function PackageEditSkeleton() {
  return (
    <section className="package-edit__section">
      <div className="package-edit__row">
        <SkeletonBox className="package-edit__skeleton-heading" />
        <SkeletonBox className="package-edit__skeleton-body" />
      </div>
      <div className="package-edit__divider" />
      <div className="package-edit__row">
        <SkeletonBox className="package-edit__skeleton-heading" />
        <SkeletonBox className="package-edit__skeleton-body" />
      </div>
      <div className="package-edit__divider" />
      <div className="package-edit__row">
        <SkeletonBox className="package-edit__skeleton-heading" />
        <SkeletonBox className="package-edit__skeleton-body" />
      </div>
    </section>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
