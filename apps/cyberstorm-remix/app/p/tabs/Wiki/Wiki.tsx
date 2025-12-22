import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import {
  Await,
  type LoaderFunctionArgs,
  Outlet,
  useOutletContext,
} from "react-router";
import { useLoaderData } from "react-router";
import { type OutletContextShape } from "~/root";

import { NewButton, NewIcon, SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getPackageWiki } from "@thunderstore/dapper-ts";
import { ApiError } from "@thunderstore/thunderstore-api";

import "./Wiki.css";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });

    let wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;

    try {
      wiki = await dapper.getPackageWiki(params.namespaceId, params.packageId);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.response.status === 404) {
          wiki = undefined;
        } else {
          wiki = undefined;
          console.error("Error fetching package wiki:", error);
        }
      }
    }

    return {
      wiki: wiki,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      slug: params.slug,
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

    const wiki = dapper.getPackageWiki(params.namespaceId, params.packageId);

    const permissions = dapper.getPackagePermissions(
      params.communityId,
      params.namespaceId,
      params.packageId
    );

    return {
      wiki: wiki,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      slug: params.slug,
      permissions: permissions,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function Wiki() {
  const { wiki, communityId, namespaceId, packageId, slug, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();

  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <div className="package-wiki">
      <div className="package-wiki-nav">
        <Suspense>
          <Await resolve={permissions}>
            {(resolvedValue) =>
              resolvedValue?.permissions.can_manage ? (
                <div className="package-wiki-nav__header">
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
              ) : null
            }
          </Await>
        </Suspense>
        <div className="package-wiki-nav__section">
          <div className="package-wiki-nav__list">
            <Suspense
              fallback={<SkeletonBox className="package-wiki-nav__skeleton" />}
            >
              <Await resolve={wiki} errorElement={<></>}>
                {(resolvedValue) =>
                  resolvedValue &&
                  resolvedValue.pages.map((page, index) => {
                    if (!slug && index === 0) {
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
                        rootClasses="package-wiki-nav__unselected"
                      >
                        {page.title}
                      </NewButton>
                    );
                  })
                }
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
      <div className="package-wiki-content">
        <Outlet context={outletContext} />
      </div>
    </div>
  );
}
