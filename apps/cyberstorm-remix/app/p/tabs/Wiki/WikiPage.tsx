import "./Wiki.css";

import { Await, type LoaderFunctionArgs } from "react-router";
import { Suspense, useMemo } from "react";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import { WikiContent } from "./WikiContent";
import {
  getPackagePermissions,
  getPackageWiki,
  getPackageWikiPage,
} from "@thunderstore/dapper-ts/src/methods/package";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  CONFLICT_MAPPING,
  RATE_LIMIT_MAPPING,
  createServerErrorMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import { wikiErrorMappings } from "./Wiki";
import { isApiError } from "../../../../../../packages/thunderstore-api/src";

type ResultType = {
  wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
  page: ReturnType<typeof getPackageWikiPage> | undefined;
  communityId: string;
  namespaceId: string;
  packageId: string;
  permissions: ReturnType<typeof getPackagePermissions> | undefined;
};

const wikiPageErrorMappings = [
  ...wikiErrorMappings,
  CONFLICT_MAPPING,
  RATE_LIMIT_MAPPING,
  createServerErrorMapping(),
];

export async function loader({ params }: LoaderFunctionArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.slug
  ) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });

    try {
      const wikiPromise = dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );
      const pagePromise = dapper.getPackageWikiPage(params.slug);

      await Promise.all([wikiPromise, pagePromise]);

      return {
        wiki: await wikiPromise,
        page: pagePromise,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        permissions: undefined,
      } satisfies ResultType;
    } catch (error) {
      if (isApiError(error) && error.response.status === 404) {
        return {
          wiki: undefined,
          page: undefined,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions: undefined,
        } satisfies ResultType;
      }

      handleLoaderError(error, { mappings: wikiPageErrorMappings });
    }
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.slug
  ) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });

    const permissions = dapper.getPackagePermissions(
      params.communityId,
      params.namespaceId,
      params.packageId
    );

    try {
      const wikiPromise = dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );
      const pagePromise = dapper.getPackageWikiPage(params.slug);

      await Promise.all([wikiPromise, pagePromise, permissions]);

      return {
        wiki: await wikiPromise,
        page: pagePromise,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        permissions,
      } satisfies ResultType;
    } catch (error) {
      if (isApiError(error) && error.response.status === 404) {
        return {
          wiki: undefined,
          page: undefined,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions,
        } satisfies ResultType;
      }

      handleLoaderError(error, { mappings: wikiPageErrorMappings });
    }
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function WikiPage() {
  const { wiki, page, communityId, namespaceId, packageId } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const wikiAndPageMemo = useMemo(() => Promise.all([wiki, page]), [wiki, page]);

  return (
    <Suspense fallback={<SkeletonBox className="package-wiki__skeleton" />}>
      <Await
        resolve={wikiAndPageMemo}
        errorElement={<div>Error occurred while loading wiki page</div>}
      >
        {(resolvedValue) => {
          const [resolvedWiki, resolvedPage] = resolvedValue;

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
              />
            );
          }

          return <>Wiki Page Not Found</>;
        }}
      </Await>
    </Suspense>
  );
}
