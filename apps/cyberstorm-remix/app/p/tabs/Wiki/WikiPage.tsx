import "./Wiki.css";

import { Await, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { Suspense } from "react";
import { NewAlert, SkeletonBox } from "@thunderstore/cyberstorm";
import { WikiContent } from "./WikiContent";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

export async function loader({ params }: LoaderFunctionArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.slug
  ) {
    const { dapper } = getLoaderTools();

    try {
      const permissionsPromise = dapper.getPackagePermissions(
        params.communityId,
        params.namespaceId,
        params.packageId
      );

      const wikiPromise = dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );

      const pagePromise = dapper.getPackageWikiPage(params.slug);

      return {
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        promises: Promise.all([wikiPromise, pagePromise, permissionsPromise]),
      };
    } catch (error) {
      handleLoaderError(error);
    }
  } else {
    throwUserFacingPayloadResponse({
      headline: "Wiki page not available.",
      description: "We could not find the requested wiki page.",
      category: "not_found",
      status: 404,
    });
  }
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.slug
  ) {
    const { dapper } = getLoaderTools();

    const permissionsPromise = dapper.getPackagePermissions(
      params.communityId,
      params.namespaceId,
      params.packageId
    );

    const wikiPromise = dapper.getPackageWiki(
      params.namespaceId,
      params.packageId
    );

    const pagePromise = dapper.getPackageWikiPage(params.slug);

    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      promises: Promise.all([wikiPromise, pagePromise, permissionsPromise]),
    };
  } else {
    throwUserFacingPayloadResponse({
      headline: "Wiki page not available.",
      description: "We could not find the requested wiki page.",
      category: "not_found",
      status: 404,
    });
  }
}

/**
 * Displays a specific wiki page and navigational context using Suspense.
 */
export default function WikiPage() {
  const { communityId, namespaceId, packageId, promises } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <Suspense fallback={<SkeletonBox className="package-wiki__skeleton" />}>
      <Await resolve={promises} errorElement={<NimbusAwaitErrorElement />}>
        {(resolvedData) => {
          const [resolvedWiki, resolvedPage, resolvedPermissions] =
            resolvedData;
          if (resolvedWiki && resolvedPage) {
            const currentPageIndex = resolvedWiki.pages.findIndex(
              (resolved) => resolved.id === resolvedPage.id
            );

            const previousPage =
              currentPageIndex > 0
                ? resolvedWiki.pages[currentPageIndex - 1]?.slug
                : undefined;

            const nextPage =
              currentPageIndex < resolvedWiki.pages.length - 1
                ? resolvedWiki.pages[currentPageIndex + 1]?.slug
                : undefined;

            return (
              <WikiContent
                page={resolvedPage}
                communityId={communityId}
                namespaceId={namespaceId}
                packageId={packageId}
                previousPage={previousPage}
                nextPage={nextPage}
                canManage={Promise.resolve(
                  resolvedPermissions?.permissions.can_manage ?? false
                )}
              />
            );
          }

          return <NewAlert csVariant="info">Wiki page not found.</NewAlert>;
        }}
      </Await>
    </Suspense>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
