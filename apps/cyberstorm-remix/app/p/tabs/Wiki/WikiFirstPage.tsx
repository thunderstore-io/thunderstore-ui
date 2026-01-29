import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteLoaderData } from "react-router";

import {
  DapperTs,
  getPackagePermissions,
  getPackageWiki,
  getPackageWikiPage,
} from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";

import "./Wiki.css";
import { WikiContent } from "./WikiContent";

type ResultType = {
  wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
  firstPage: Awaited<ReturnType<typeof getPackageWikiPage>> | undefined;
  communityId: string;
  namespaceId: string;
  packageId: string;
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
    return result;
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

clientLoader.hydrate = true as const;

export default function WikiFirstPage() {
  const { wiki, firstPage, communityId, namespaceId, packageId } =
    useLoaderData<typeof loader | typeof clientLoader>();

  const wikiLayoutData = useRouteLoaderData("wikiLayout") as {
    permissions: ReturnType<typeof getPackagePermissions> | undefined;
  };
  const permissions = wikiLayoutData?.permissions;

  if (wiki && firstPage) {
    return (
      <WikiContent
        page={firstPage}
        communityId={communityId}
        namespaceId={namespaceId}
        packageId={packageId}
        previousPage={undefined}
        nextPage={wiki.pages.length > 1 ? wiki.pages[1].slug : undefined}
        canManage={permissions?.then((perms) =>
          typeof perms === "undefined" ? false : perms.permissions.can_manage
        )}
      />
    );
  }
  return <>There are no wiki pages available.</>;
}
