import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { useEffect, useState } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router";

import {
  DapperTs,
  getPackagePermissions,
  getPackageWiki,
  getPackageWikiPage,
} from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";

import type { Route } from "./+types/WikiFirstPage";
import "./Wiki.css";
import { WikiContent } from "./WikiContent";

type ResultType = {
  wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
  firstPage: Awaited<ReturnType<typeof getPackageWikiPage>> | undefined;
  communityId: string;
  namespaceId: string;
  packageId: string;
  seo?: ReturnType<typeof createSeo>;
};

// Shared by both loaders. clientLoader.hydrate replaces the SSR match data the
// <Seo> head reads, so a tag only the SSR loader emits is gone after hydration.
function wikiFirstPageSeo(result: ResultType) {
  if (!result.wiki) {
    // 200 so team members can reach the create-wiki state.
    return createSeo({
      descriptors: [
        { title: "Wiki Not Found" },
        { name: "robots", content: "noindex, follow" },
      ],
    });
  }
  const packageName = `${result.namespaceId}-${result.packageId}`;
  if (result.firstPage) {
    return createSeo({
      descriptors: [
        { title: `${result.firstPage.title} - ${packageName} | Thunderstore` },
        { name: "description", content: `Wiki page for ${packageName}` },
      ],
    });
  }
  return createSeo({ descriptors: [{ title: `${packageName} Wiki` }] });
}

export const loader = ssrLoader(
  async ({ params }: Route.LoaderArgs) => {
    if (params.communityId && params.namespaceId && params.packageId) {
      const dapper = new DapperTs(() => {
        return {
          apiHost: getApiHostForSsr(),
          sessionId: undefined,
        };
      });
      let result: ResultType = {
        wiki: undefined,
        firstPage: undefined,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
      };

      try {
        const wiki = await dapper.getPackageWiki(
          params.namespaceId,
          params.packageId
        );
        if (wiki.pages && wiki.pages.length > 0) {
          const firstPage = await dapper.getPackageWikiPage(wiki.pages[0].id);
          result = {
            wiki: wiki,
            firstPage: firstPage,
            communityId: params.communityId,
            namespaceId: params.namespaceId,
            packageId: params.packageId,
          };
        } else {
          result = {
            wiki: wiki,
            firstPage: undefined,
            communityId: params.communityId,
            namespaceId: params.namespaceId,
            packageId: params.packageId,
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
            };
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
      return { ...result, seo: wikiFirstPageSeo(result) };
    }
    throw new Error("Namespace ID or Package ID is missing");
  },
  { cache: true }
);

export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });

    let result: ResultType = {
      wiki: undefined,
      firstPage: undefined,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
    };

    try {
      const wiki = await dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );
      if (wiki.pages && wiki.pages.length > 0) {
        const firstPage = await dapper.getPackageWikiPage(wiki.pages[0].id);
        result = {
          wiki: wiki,
          firstPage: firstPage,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
        };
      } else {
        result = {
          wiki: wiki,
          firstPage: undefined,
          communityId: params.communityId,
          namespaceId: params.namespaceId,
          packageId: params.packageId,
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
          };
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    return { ...result, seo: wikiFirstPageSeo(result) };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

clientLoader.hydrate = true as const;

export default function WikiFirstPage() {
  const { wiki, firstPage, communityId, namespaceId, packageId } =
    useLoaderData<typeof loader | typeof clientLoader>();

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

  if (wiki && firstPage) {
    return (
      <WikiContent
        page={firstPage}
        communityId={communityId}
        namespaceId={namespaceId}
        packageId={packageId}
        previousPage={undefined}
        nextPage={wiki.pages.length > 1 ? wiki.pages[1].slug : undefined}
        canManage={canManage}
      />
    );
  }
  return (
    <TabFetchState
      variant="info"
      message="There are no wiki pages available."
    />
  );
}
