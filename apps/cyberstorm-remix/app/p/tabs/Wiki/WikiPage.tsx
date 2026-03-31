import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { useEffect, useState } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router";

import {
  DapperTs,
  getPackagePermissions,
  getPackageWiki,
  getPackageWikiPage,
} from "@thunderstore/dapper-ts";

import { isApiError } from "../../../../../../packages/thunderstore-api/src";
import type { Route } from "./+types/WikiPage";
import "./Wiki.css";
import { WikiContent } from "./WikiContent";

type ResultType = {
  wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
  page: Awaited<ReturnType<typeof getPackageWikiPage>> | undefined;
  communityId: string;
  namespaceId: string;
  packageId: string;
  seo?: ReturnType<typeof createSeo>;
};

export async function loader({ params }: Route.LoaderArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.slug
  ) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
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
          seo: createSeo({
            descriptors: [
              { title: `${params.slug} | Wiki Not Found | Thunderstore` },
            ],
          }),
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
        seo: createSeo({
          descriptors: [
            {
              title: `${page.title} - ${params.namespaceId}-${params.packageId} | Thunderstore`,
            },
            {
              name: "description",
              content: `Wiki page for ${params.namespaceId}-${params.packageId}`,
            },
          ],
        }),
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
            seo: createSeo({
              descriptors: [{ title: "Wiki Not Found | Thunderstore" }],
            }),
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

export async function clientLoader({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
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

    const serverData = await serverLoader();

    let result: ResultType = {
      wiki: undefined,
      page: undefined,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      seo: serverData.seo,
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
          seo: serverData.seo,
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
        seo: serverData.seo,
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
            seo: serverData.seo,
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
        .can_manage_wiki;
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

  const notFoundElement = (
    <TabFetchState variant="info" message="Wiki page not found." />
  );

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
