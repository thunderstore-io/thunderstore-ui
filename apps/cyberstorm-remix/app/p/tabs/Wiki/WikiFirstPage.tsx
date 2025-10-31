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
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  CONFLICT_MAPPING,
  RATE_LIMIT_MAPPING,
  createServerErrorMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import { wikiErrorMappings } from "./Wiki";
import { isApiError } from "../../../../../../packages/thunderstore-api/src";
import {
  getPackagePermissions,
  getPackageWiki,
  getPackageWikiPage,
} from "@thunderstore/dapper-ts/src/methods/package";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";

type MaybePromise<T> = T | Promise<T>;

type ResultType = {
  wiki: MaybePromise<Awaited<ReturnType<typeof getPackageWiki>> | undefined>;
  firstPage: MaybePromise<
    Awaited<ReturnType<typeof getPackageWikiPage>> | undefined
  >;
  communityId: string;
  namespaceId: string;
  packageId: string;
  permissions: MaybePromise<
    Awaited<ReturnType<typeof getPackagePermissions>> | undefined
  >;
};

const wikiFirstPageErrorMappings = [
  ...wikiErrorMappings,
  CONFLICT_MAPPING,
  RATE_LIMIT_MAPPING,
  createServerErrorMapping(),
];

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });

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
        wiki,
        firstPage,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        permissions: undefined,
      } satisfies ResultType;
    } catch (error) {
      if (isApiError(error) && error.response.status === 404) {
        return {
          wiki: undefined,
          firstPage: undefined,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions: undefined,
        } satisfies ResultType;
      }

      handleLoaderError(error, { mappings: wikiFirstPageErrorMappings });
    }
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
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
        return handleLoaderError(error, { mappings: wikiFirstPageErrorMappings });
      });

    const wikiPromise = dapper
      .getPackageWiki(params.namespaceId, params.packageId)
      .catch((error) => {
        if (isApiError(error) && error.response.status === 404) {
          return undefined;
        }
        return handleLoaderError(error, { mappings: wikiFirstPageErrorMappings });
      });

    const firstPagePromise = wikiPromise.then((resolvedWiki) => {
      if (!resolvedWiki || resolvedWiki.pages.length === 0) {
        return undefined;
      }
      return dapper
        .getPackageWikiPage(resolvedWiki.pages[0].id)
        .catch((error) => {
          if (isApiError(error) && error.response.status === 404) {
            return undefined;
          }
          return handleLoaderError(error, {
            mappings: wikiFirstPageErrorMappings,
          });
        });
    });

    return {
      wiki: wikiPromise,
      firstPage: firstPagePromise,
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
 * Renders the first wiki page, deferring data resolution to Suspense.
 */
export default function WikiFirstPage() {
  const { wiki, firstPage, communityId, namespaceId, packageId, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();

  const resolvedDataPromise = useMemo(() => {
    return Promise.all([
      Promise.resolve(wiki),
      Promise.resolve(firstPage),
      Promise.resolve(permissions),
    ]).then(([resolvedWiki, resolvedFirstPage, resolvedPermissions]) => {
      return {
        wiki: resolvedWiki,
        firstPage: resolvedFirstPage,
        permissions: resolvedPermissions,
      } satisfies {
        wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
        firstPage:
          | Awaited<ReturnType<typeof getPackageWikiPage>>
          | undefined;
        permissions:
          | Awaited<ReturnType<typeof getPackagePermissions>>
          | undefined;
      };
    });
  }, [wiki, firstPage, permissions]);

  return (
    <Suspense fallback={<SkeletonBox className="package-wiki__skeleton" />}>
      <Await
        resolve={resolvedDataPromise}
        errorElement={<WikiFirstPageAwaitError />}
      >
        {({ wiki: resolvedWiki, firstPage: resolvedFirstPage, permissions: resolvedPermissions }) => {
          if (resolvedWiki && resolvedFirstPage) {
            const nextPage =
              resolvedWiki.pages.length > 1
                ? resolvedWiki.pages[1].slug
                : undefined;

            return (
              <WikiContent
                page={resolvedFirstPage}
                communityId={communityId}
                namespaceId={namespaceId}
                packageId={packageId}
                previousPage={undefined}
                nextPage={nextPage}
                canManage={Promise.resolve(
                  resolvedPermissions?.permissions.can_manage ?? false
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

/**
 * Surfaces a friendly message when the wiki page promise rejects.
 */
function WikiFirstPageAwaitError() {
  return (
    <NewAlert csVariant="danger">
      We could not load the wiki page. Please try again.
    </NewAlert>
  );
}

/**
 * Maps loader errors to a user-facing alert for the wiki first page route.
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
