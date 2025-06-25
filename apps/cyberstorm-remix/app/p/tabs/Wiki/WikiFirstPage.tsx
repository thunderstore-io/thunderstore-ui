import "./Wiki.css";

import { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "~/middlewares";
import { WikiContent } from "./WikiContent";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: import.meta.env.VITE_API_URL,
        sessionId: undefined,
      };
    });
    const wiki = await dapper.getPackageWiki(
      params.namespaceId,
      params.packageId
    );
    const firstPage = await dapper.getPackageWikiPage(wiki.pages[0].id);
    return {
      wiki: wiki,
      firstPage: firstPage,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export async function clientLoader({ context, params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const tools = getSessionTools(context);
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
    const firstPage = await dapper.getPackageWikiPage(wiki.pages[0].id);
    return {
      wiki: wiki,
      firstPage: firstPage,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function Wiki() {
  const { wiki, firstPage, communityId, namespaceId, packageId } =
    useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <WikiContent
      page={firstPage}
      communityId={communityId}
      namespaceId={namespaceId}
      packageId={packageId}
      previousPage={undefined}
      nextPage={wiki.pages[1]?.slug}
    />
  );
}
