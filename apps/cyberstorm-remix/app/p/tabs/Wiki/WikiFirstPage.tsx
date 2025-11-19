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
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();

    try {
      const wiki = await dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );
      const firstPage =
        wiki.pages.length > 0
          ? await dapper.getPackageWikiPage(wiki.pages[0].id)
          : undefined;
      return {
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        promises: Promise.all([wiki, firstPage, undefined]),
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
  if (params.communityId && params.namespaceId && params.packageId) {
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

    const firstPagePromise = wikiPromise.then((resolvedWiki) => {
      if (!resolvedWiki || resolvedWiki.pages.length === 0) {
        return undefined;
      }
      return dapper.getPackageWikiPage(resolvedWiki.pages[0].id);
    });

    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      promises: Promise.all([
        wikiPromise,
        firstPagePromise,
        permissionsPromise,
      ]),
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
 * Renders the first wiki page, deferring data resolution to Suspense.
 */
export default function WikiFirstPage() {
  const { communityId, namespaceId, packageId, promises } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <Suspense fallback={<SkeletonBox className="package-wiki__skeleton" />}>
      <Await resolve={promises} errorElement={<NimbusAwaitErrorElement />}>
        {(resolvedData) => {
          const [wiki, firstPage, permissions] = resolvedData;
          if (wiki && firstPage) {
            const nextPage =
              wiki.pages.length > 1 ? wiki.pages[1].slug : undefined;

            return (
              <WikiContent
                page={firstPage}
                communityId={communityId}
                namespaceId={namespaceId}
                packageId={packageId}
                previousPage={undefined}
                nextPage={nextPage}
                canManage={Promise.resolve(
                  permissions?.permissions.can_manage ?? false
                )}
              />
            );
          }

          return (
            <NewAlert csVariant="info">
              There are no wiki pages available yet.
            </NewAlert>
          );
        }}
      </Await>
    </Suspense>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
