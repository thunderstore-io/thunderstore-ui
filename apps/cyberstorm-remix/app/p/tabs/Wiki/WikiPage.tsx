import "./Wiki.css";

import { Await, type LoaderFunctionArgs, useParams } from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { WikiContent } from "./WikiContent";
import {
  getPackageWiki,
  getPackageWikiPage,
  getPackagePermissions,
} from "@thunderstore/dapper-ts/src/methods/package";
import { isApiError } from "../../../../../../packages/thunderstore-api/src";
import { Suspense } from "react";
import { SkeletonBox } from "@thunderstore/cyberstorm";

type ResultType = {
  wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
  page: ReturnType<typeof getPackageWikiPage> | undefined;
  communityId: string;
  namespaceId: string;
  packageId: string;
  permissions: ReturnType<typeof getPackagePermissions> | undefined;
};

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

    let result: ResultType = {
      wiki: undefined,
      page: undefined,
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
      const pageId = wiki.pages?.find((p) => p.slug === params.slug)?.id;
      if (!pageId) {
        result = {
          wiki,
          page: undefined,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions: result.permissions,
        };
        return result;
      }
      const page = dapper.getPackageWikiPage(pageId);
      result = {
        wiki: wiki,
        page: page,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        permissions: undefined,
      };
    } catch (error) {
      if (isApiError(error)) {
        // There is no wiki or the User does not have permission to view the wiki, return empty wiki and undefined firstPage
        if (error.response.status === 404) {
          result = {
            wiki: undefined,
            page: undefined,
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

    let result: ResultType = {
      wiki: undefined,
      page: undefined,
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
      const pageId = wiki.pages?.find((p) => p.slug === params.slug)?.id;
      if (!pageId) {
        result = {
          wiki,
          page: undefined,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          permissions: result.permissions,
        };
        return result;
      }
      const page = dapper.getPackageWikiPage(pageId);
      result = {
        wiki: wiki,
        page: page,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        permissions: permissions,
      };
    } catch (error) {
      if (isApiError(error)) {
        // There is no wiki or the User does not have permission to view the wiki, return empty wiki and undefined firstPage
        if (error.response.status === 404) {
          result = {
            wiki: undefined,
            page: undefined,
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

export default function WikiPage() {
  const { wiki, page, communityId, namespaceId, packageId, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();
  const params = useParams();

  const wikiAndPagePromise = Promise.all([wiki, page]);

  const notFoundElement = <div>Wiki page not found.</div>;

  return (
    <Suspense fallback={<SkeletonBox className="package-wiki__skeleton" />}>
      <Await
        key={params.slug}
        resolve={wikiAndPagePromise}
        errorElement={<div>Error occurred while loading wiki page</div>}
      >
        {(resolvedValue) => {
          const [wiki, page] = resolvedValue;
          if (wiki && page) {
            const currentPageIndex = wiki.pages.findIndex(
              (p) => p.id === page.id
            );

            if (currentPageIndex < 0) {
              return notFoundElement;
            }

            const previousPage =
              currentPageIndex > 0
                ? wiki.pages[currentPageIndex - 1]?.slug
                : undefined;
            const nextPage =
              currentPageIndex < wiki.pages.length - 1
                ? wiki.pages[currentPageIndex + 1]?.slug
                : undefined;

            return (
              <WikiContent
                page={page}
                communityId={communityId}
                namespaceId={namespaceId}
                packageId={packageId}
                previousPage={previousPage}
                nextPage={nextPage}
                canManage={permissions?.then((perms) =>
                  typeof perms === "undefined"
                    ? false
                    : perms.permissions.can_manage
                )}
              />
            );
          }
          return notFoundElement;
        }}
      </Await>
    </Suspense>
  );
}
