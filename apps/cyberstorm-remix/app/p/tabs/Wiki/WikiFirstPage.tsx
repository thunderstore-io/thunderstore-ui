import "./Wiki.css";

import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { WikiContent } from "./WikiContent";
import { isApiError } from "../../../../../../packages/thunderstore-api/src";
import {
  getPackagePermissions,
  getPackageWiki,
  getPackageWikiPage,
} from "@thunderstore/dapper-ts/src/methods/package";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import { useMemo, Suspense } from "react";

type ResultType = {
  wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
  firstPage: ReturnType<typeof getPackageWikiPage> | undefined;
  communityId: string;
  namespaceId: string;
  packageId: string;
  permissions: ReturnType<typeof getPackagePermissions> | undefined;
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    let result: ResultType = {
      wiki: undefined,
      firstPage: undefined,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      permissions: undefined,
    };

    try {
      const wiki = await dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );
      if (wiki.pages && wiki.pages.length > 0) {
        const firstPage = dapper.getPackageWikiPage(wiki.pages[0].id);
        result = {
          wiki: wiki,
          firstPage: firstPage,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions: undefined,
        };
      } else {
        result = {
          wiki: wiki,
          firstPage: undefined,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions: undefined,
        };
      }
    } catch (error) {
      if (isApiError(error)) {
        // There is no wiki or the User does not have permission to view the wiki, return empty wiki and undefined firstPage
        if (error.response.status === 404) {
          result = {
            wiki: undefined,
            firstPage: undefined,
            communityId: params.communityId,
            namespaceId: params.namespaceId,
            packageId: params.packageId,
            permissions: undefined,
          };
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    return result;
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

    let result: ResultType = {
      wiki: undefined,
      firstPage: undefined,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      permissions: permissions,
    };

    try {
      const wiki = await dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );
      if (wiki.pages && wiki.pages.length > 0) {
        const firstPage = dapper.getPackageWikiPage(wiki.pages[0].id);
        result = {
          wiki: wiki,
          firstPage: firstPage,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions: permissions,
        };
      } else {
        result = {
          wiki: wiki,
          firstPage: undefined,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions: permissions,
        };
      }
    } catch (error) {
      if (isApiError(error)) {
        // There is no wiki or the User does not have permission to view the wiki, return empty wiki and undefined firstPage
        if (error.response.status === 404) {
          result = {
            wiki: undefined,
            firstPage: undefined,
            communityId: params.communityId,
            namespaceId: params.namespaceId,
            packageId: params.packageId,
            permissions: permissions,
          };
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    return result;
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function WikiFirstPage() {
  const { wiki, firstPage, communityId, namespaceId, packageId, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();

  const wikiAndFirstPageMemo = useMemo(
    () => Promise.all([Promise.resolve(wiki), firstPage]),
    [wiki, firstPage]
  );

  return (
    <Suspense fallback={<SkeletonBox className="package-wiki__skeleton" />}>
      <Await resolve={wikiAndFirstPageMemo}>
        {(resolvedValue) => {
          const [wiki, firstPage] = resolvedValue;
          if (wiki && firstPage) {
            return (
              <WikiContent
                page={firstPage}
                communityId={communityId}
                namespaceId={namespaceId}
                packageId={packageId}
                previousPage={undefined}
                nextPage={
                  wiki.pages.length > 1 ? wiki.pages[1].slug : undefined
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
