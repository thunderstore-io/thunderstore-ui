import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { createNotFoundMapping } from "cyberstorm/utils/errors/loaderMappings";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";
import { Suspense } from "react";
import {
  Await,
  type LoaderFunctionArgs,
  Outlet,
  useLoaderData,
  useOutletContext,
} from "react-router";
import { type OutletContextShape } from "~/root";

import { NewButton, NewIcon, SkeletonBox } from "@thunderstore/cyberstorm";

import "./Wiki.css";

export const wikiErrorMappings = [
  createNotFoundMapping(
    "Wiki not available.",
    "We could not find the requested wiki."
  ),
];

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();
    try {
      const wiki = await dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );

      return {
        wiki,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        slug: params.slug,
        permissions: undefined,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: wikiErrorMappings });
    }
  } else {
    throwUserFacingPayloadResponse({
      headline: "Wiki not available.",
      description: "We could not find the requested wiki.",
      category: "not_found",
      status: 404,
    });
  }
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();

    const wikiPromise = dapper.getPackageWiki(
      params.namespaceId,
      params.packageId
    );

    const permissionsPromise = dapper.getPackagePermissions(
      params.communityId,
      params.namespaceId,
      params.packageId
    );

    return {
      wiki: wikiPromise,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      slug: params.slug,
      permissions: permissionsPromise,
    };
  } else {
    throwUserFacingPayloadResponse({
      headline: "Wiki not available.",
      description: "We could not find the requested wiki.",
      category: "not_found",
      status: 404,
    });
  }
}

/**
 * Displays the package wiki navigation and nested routes, relying on Suspense for data.
 */
export default function Wiki() {
  const { wiki, communityId, namespaceId, packageId, slug, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <div className="package-wiki">
      <div className="package-wiki-nav">
        <Suspense>
          <Await
            resolve={permissions}
            errorElement={<NimbusAwaitErrorElement />}
          >
            {(resolvedValue) =>
              resolvedValue?.permissions.can_manage ? (
                <div className="package-wiki-nav__header">
                  <NewButton
                    primitiveType="cyberstormLink"
                    linkId="PackageWikiNewPage"
                    community={communityId}
                    namespace={namespaceId}
                    package={packageId}
                  >
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faPlus} />
                    </NewIcon>
                    New Page
                  </NewButton>
                </div>
              ) : null
            }
          </Await>
        </Suspense>
        <div className="package-wiki-nav__section">
          <div className="package-wiki-nav__list">
            <Suspense
              fallback={<SkeletonBox className="package-wiki-nav__skeleton" />}
            >
              <Await resolve={wiki} errorElement={<NimbusAwaitErrorElement />}>
                {(resolvedValue) =>
                  resolvedValue &&
                  resolvedValue.pages.map((page, index) => {
                    if (!slug && index === 0) {
                      return (
                        <NewButton
                          key={page.id}
                          csSize="small"
                          csVariant="secondary"
                          primitiveType="cyberstormLink"
                          linkId="PackageWikiPage"
                          community={communityId}
                          namespace={namespaceId}
                          package={packageId}
                          wikipageslug={page.slug}
                        >
                          {page.title}
                        </NewButton>
                      );
                    }
                    if (page.slug === slug) {
                      return (
                        <NewButton
                          key={page.id}
                          csSize="small"
                          csVariant="secondary"
                          primitiveType="cyberstormLink"
                          linkId="PackageWikiPage"
                          community={communityId}
                          namespace={namespaceId}
                          package={packageId}
                          wikipageslug={page.slug}
                        >
                          {page.title}
                        </NewButton>
                      );
                    }
                    return (
                      <NewButton
                        key={page.id}
                        csSize="small"
                        csVariant="secondary"
                        primitiveType="cyberstormLink"
                        linkId="PackageWikiPage"
                        community={communityId}
                        namespace={namespaceId}
                        package={packageId}
                        wikipageslug={page.slug}
                        csModifiers={["ghost"]}
                        rootClasses="package-wiki-nav__unselected"
                      >
                        {page.title}
                      </NewButton>
                    );
                  })
                }
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
      <div className="package-wiki-content">
        <Outlet context={outletContext} />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
