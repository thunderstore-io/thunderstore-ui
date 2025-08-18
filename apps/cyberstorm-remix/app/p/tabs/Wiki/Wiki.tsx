import "./Wiki.css";

import { LoaderFunctionArgs, Outlet, useOutletContext } from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "~/middlewares";
import { NewButton, NewIcon } from "@thunderstore/cyberstorm";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OutletContextShape } from "~/root";

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
    return {
      wiki: wiki,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      slug: params.slug,
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
    return {
      wiki: wiki,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      slug: params.slug,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function Wiki() {
  const { wiki, communityId, namespaceId, packageId, slug } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <div className="wiki">
      <div className="wiki-nav">
        <div className="wiki-nav__header">
          <NewButton
            primitiveType="cyberstormLink"
            linkId="PackageWikiNewPage"
            community={communityId}
            namespace={namespaceId}
            package={packageId}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faPlus} />
            </NewIcon>
            New Page
          </NewButton>
        </div>
        <div className="wiki-nav__section">
          <div className="wiki-nav__list">
            {wiki.pages.map((page) => {
              if (!slug) {
                return (
                  <NewButton
                    key={page.id}
                    csSize="small"
                    csVariant="secondary"
                    primitiveType="cyberstormLink"
                    linkId="PackageWikiPage"
                    community={communityId}
                    namespace={namespaceId}
                    package={packageId}
                    wikipageslug={page.slug}
                  >
                    {page.title}
                  </NewButton>
                );
              }
              if (page.slug === slug) {
                return (
                  <NewButton
                    key={page.id}
                    csSize="small"
                    csVariant="secondary"
                    primitiveType="cyberstormLink"
                    linkId="PackageWikiPage"
                    community={communityId}
                    namespace={namespaceId}
                    package={packageId}
                    wikipageslug={page.slug}
                  >
                    {page.title}
                  </NewButton>
                );
              }
              return (
                <NewButton
                  key={page.id}
                  csSize="small"
                  csVariant="secondary"
                  primitiveType="cyberstormLink"
                  linkId="PackageWikiPage"
                  community={communityId}
                  namespace={namespaceId}
                  package={packageId}
                  wikipageslug={page.slug}
                  csModifiers={["ghost"]}
                  rootClasses="wiki-nav__unselected"
                >
                  {page.title}
                </NewButton>
              );
            })}
          </div>
        </div>
      </div>
      <div className="wiki-content">
        <Outlet context={outletContext} />
      </div>
    </div>
  );
}
