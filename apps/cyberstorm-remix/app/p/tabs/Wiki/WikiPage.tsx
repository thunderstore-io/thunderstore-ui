import "./Wiki.css";

import { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { WikiContent } from "./WikiContent";

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
    const wiki = await dapper.getPackageWiki(
      params.namespaceId,
      params.packageId
    );
    const pageId = wiki.pages.find((p) => p.slug === params.slug)?.id;
    if (!pageId) {
      throw new Error("Page not found");
    }
    const page = await dapper.getPackageWikiPage(pageId);
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

    return {
      page: page,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      previousPage: previousPage,
      nextPage: nextPage,
    };
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
    const wiki = await dapper.getPackageWiki(
      params.namespaceId,
      params.packageId
    );
    const pageId = wiki.pages.find((p) => p.slug === params.slug)?.id;
    if (!pageId) {
      throw new Error("Page not found");
    }
    const page = await dapper.getPackageWikiPage(pageId);
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

    return {
      page: page,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      previousPage: previousPage,
      nextPage: nextPage,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function Wiki() {
  const { page, communityId, namespaceId, packageId, previousPage, nextPage } =
    useLoaderData<typeof loader | typeof clientLoader>();

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
