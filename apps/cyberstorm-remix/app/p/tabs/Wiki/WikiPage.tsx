import "./Wiki.css";

import {
  Await,
  type LoaderFunctionArgs,
  useLoaderData,
  useRouteError,
} from "react-router";
import { Suspense, useMemo } from "react";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { NewAlert, SkeletonBox } from "@thunderstore/cyberstorm";
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
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";

type MaybePromise<T> = T | Promise<T>;

type ResultType = {
  wiki: MaybePromise<Awaited<ReturnType<typeof getPackageWiki>> | undefined>;
  page: MaybePromise<
    Awaited<ReturnType<typeof getPackageWikiPage>> | undefined
  >;
  communityId: string;
  namespaceId: string;
  packageId: string;
  permissions: MaybePromise<
    Awaited<ReturnType<typeof getPackagePermissions>> | undefined
  >;
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
      const [wiki, page] = await Promise.all([
        dapper.getPackageWiki(params.namespaceId, params.packageId),
        dapper.getPackageWikiPage(params.slug),
      ]);

      return {
        wiki,
        page,
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

    const permissionsPromise = dapper
      .getPackagePermissions(
        params.communityId,
        params.namespaceId,
        params.packageId
      )
      .catch((error) => {
        if (isApiError(error) && error.response.status === 404) {
          return undefined;
        }
        return handleLoaderError(error, { mappings: wikiPageErrorMappings });
      });

    const wikiPromise = dapper
      .getPackageWiki(params.namespaceId, params.packageId)
      .catch((error) => {
        if (isApiError(error) && error.response.status === 404) {
          return undefined;
        }
        return handleLoaderError(error, { mappings: wikiPageErrorMappings });
      });

    const pagePromise = dapper
      .getPackageWikiPage(params.slug)
      .catch((error) => {
        if (isApiError(error) && error.response.status === 404) {
          return undefined;
        }
        return handleLoaderError(error, { mappings: wikiPageErrorMappings });
      });

    return {
      wiki: wikiPromise,
      page: pagePromise,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      permissions: permissionsPromise,
    } satisfies ResultType;
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

/**
 * Displays a specific wiki page and navigational context using Suspense.
 */
export default function WikiPage() {
  const { wiki, page, communityId, namespaceId, packageId, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();

  const resolvedDataPromise = useMemo(() => {
    return Promise.all([
      Promise.resolve(wiki),
      Promise.resolve(page),
      Promise.resolve(permissions),
    ]).then(([resolvedWiki, resolvedPage, resolvedPermissions]) => {
      return {
        wiki: resolvedWiki,
        page: resolvedPage,
        permissions: resolvedPermissions,
      };
    });
  }, [wiki, page, permissions]);

  return (
    <Suspense fallback={<SkeletonBox className="package-wiki__skeleton" />}>
      <Await
        resolve={resolvedDataPromise}
        errorElement={<WikiPageAwaitError />}
      >
        {({ wiki: resolvedWiki, page: resolvedPage, permissions: resolvedPermissions }) => {
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

          return (
            <NewAlert csVariant="info">Wiki page not found.</NewAlert>
          );
        }}
      </Await>
    </Suspense>
  );
}

/**
 * Displays a friendly message when the Suspense promise rejects.
 */
function WikiPageAwaitError() {
  return (
    <NewAlert csVariant="danger">
      We could not load the wiki page. Please try again.
    </NewAlert>
  );
}

/**
 * Maps loader errors to user-facing alerts for the wiki page route.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <NewAlert csVariant="danger">
      <strong>{payload.headline}</strong>
      {payload.description ? ` ${payload.description}` : ""}
    </NewAlert>
  );
}
