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

type ResultType = {
  wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
  firstPage: ReturnType<typeof getPackageWikiPage> | undefined;
  communityId: string;
  namespaceId: string;
  packageId: string;
  permissions: ReturnType<typeof getPackagePermissions> | undefined;
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
      const firstPage = dapper.getPackageWikiPage(wiki.pages[0].id);
      return {
        wiki,
        firstPage,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        permissions: undefined,
      };
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

    const permissions = dapper.getPackagePermissions(
      params.communityId,
      params.namespaceId,
      params.packageId
    );

    try {
      const wiki = await dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );
      const firstPage = dapper.getPackageWikiPage(wiki.pages[0].id);
      return {
        wiki,
        firstPage,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        permissions,
      };
    } catch (error) {
      if (isApiError(error) && error.response.status === 404) {
        return {
          wiki: undefined,
          firstPage: undefined,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions,
        } satisfies ResultType;
      }

      handleLoaderError(error, { mappings: wikiFirstPageErrorMappings });
    }
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function WikiFirstPage() {
  const { wiki, firstPage, communityId, namespaceId, packageId, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();

  const wikiAndFirstPageMemo = useMemo(
    () => Promise.all([wiki, firstPage]),
    [wiki, firstPage]
  );

  return (
    <Suspense fallback={<SkeletonBox className="package-wiki__skeleton" />}>
      <Await resolve={wikiAndFirstPageMemo}>
        {(resolvedValue) => {
          const [resolvedWiki, resolvedFirstPage] = resolvedValue;

          if (resolvedWiki && resolvedFirstPage) {
            return (
              <WikiContent
                page={resolvedFirstPage}
                communityId={communityId}
                namespaceId={namespaceId}
                packageId={packageId}
                previousPage={undefined}
                nextPage={
                  resolvedWiki.pages.length > 1
                    ? resolvedWiki.pages[1].slug
                    : undefined
                }
                canManage={permissions?.then((perms) =>
                  typeof perms === "undefined"
                    ? false
                    : perms.permissions.can_manage
                )}
              />
            );
          }

          return <>There are no wiki pages available.</>;
        }}
      </Await>
    </Suspense>
  );
}
