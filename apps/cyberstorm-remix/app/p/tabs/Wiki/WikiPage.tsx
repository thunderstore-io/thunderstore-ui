import "./Wiki.css";

import { LoaderFunctionArgs } from "react-router";
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

type ResultType = {
  wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;
  page: Awaited<ReturnType<typeof getPackageWikiPage>> | undefined;
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
      const page = await dapper.getPackageWikiPage(params.slug);
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
      const page = await dapper.getPackageWikiPage(params.slug);
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
  const { wiki, page, communityId, namespaceId, packageId } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (wiki && page) {
    const currentPageIndex = wiki.pages.findIndex((p) => p.id === page.id);

    let previousPage = undefined;
    let nextPage = undefined;

    if (currentPageIndex === 0) {
      previousPage = undefined;
    } else {
      previousPage = wiki.pages[currentPageIndex - 1]?.slug;
    }

    if (currentPageIndex === wiki.pages.length) {
      nextPage = undefined;
    } else {
      nextPage = wiki.pages[currentPageIndex + 1]?.slug;
    }

    return (
      <WikiContent
        page={page}
        communityId={communityId}
        namespaceId={namespaceId}
        packageId={packageId}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    );
  }
  return <>Wiki Page Not Found</>;
}
