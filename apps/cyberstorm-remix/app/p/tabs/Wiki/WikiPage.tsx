import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { useEffect, useState } from "react";
import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteLoaderData } from "react-router";

import {
  DapperTs,
  getPackagePermissions,
  getPackageWiki,
  getPackageWikiPage,
} from "@thunderstore/dapper-ts";

import { isApiError } from "../../../../../../packages/thunderstore-api/src";
import "./Wiki.css";
import { WikiContent } from "./WikiContent";

type ResultType = {
  wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
  page: Awaited<ReturnType<typeof getPackageWikiPage>> | undefined;
  communityId: string;
  namespaceId: string;
  packageId: string;
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
        };
        return result;
      }
      const page = await dapper.getPackageWikiPage(pageId);
      result = {
        wiki: wiki,
        page: page,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
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

    let result: ResultType = {
      wiki: undefined,
      page: undefined,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
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
        };
        return result;
      }
      const page = await dapper.getPackageWikiPage(pageId);
      result = {
        wiki: wiki,
        page: page,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
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

clientLoader.hydrate = true as const;

export default function WikiPage() {
  const { wiki, page, communityId, namespaceId, packageId } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const wikiLayoutData = useRouteLoaderData("wikiLayout") as
    | {
        permissions: ReturnType<typeof getPackagePermissions> | undefined;
      }
    | undefined;

  const [canManage, setCanManage] = useState<boolean>(false);

  useEffect(() => {
    async function resolveCanManage() {
      setCanManage(false);
      const result = (await wikiLayoutData?.permissions)?.permissions
        .can_manage;
      if (!ignore) {
        setCanManage(result ?? false);
      }
    }

    let ignore = false;
    resolveCanManage();
    return () => {
      ignore = true;
    };
  }, [wikiLayoutData]);

  const notFoundElement = <div>Wiki page not found.</div>;

  if (wiki && page) {
    const currentPageIndex = wiki.pages.findIndex((p) => p.id === page.id);

    if (currentPageIndex < 0) {
      return notFoundElement;
    }

    const previousPage =
      currentPageIndex > 0 ? wiki.pages[currentPageIndex - 1]?.slug : undefined;
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
        canManage={canManage}
      />
    );
  }
  return notFoundElement;
}
