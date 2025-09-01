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
  if (params.communityId && params.namespaceId && params.packageId) {
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
    const firstPage = await dapper.getPackageWikiPage(wiki.pages[0].id);
    return {
      wiki: wiki,
      firstPage: firstPage,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      permissions: undefined,
    };
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

    const wiki = await dapper.getPackageWiki(
      params.namespaceId,
      params.packageId
    );
    const firstPage = await dapper.getPackageWikiPage(wiki.pages[0].id);

    const permissions = await dapper.getPackagePermissions(
      params.communityId,
      params.namespaceId,
      params.packageId
    );
    return {
      wiki: wiki,
      firstPage: firstPage,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      permissions: permissions,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function Wiki() {
  const { wiki, firstPage, communityId, namespaceId, packageId, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <WikiContent
      page={firstPage}
      communityId={communityId}
      namespaceId={namespaceId}
      packageId={packageId}
      previousPage={undefined}
      nextPage={wiki.pages[1]?.slug}
      canManage={permissions?.permissions.can_manage}
    />
  );
}
