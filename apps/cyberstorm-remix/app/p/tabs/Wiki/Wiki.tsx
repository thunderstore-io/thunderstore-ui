import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Suspense } from "react";
import {
  Await,
  Outlet,
  type ShouldRevalidateFunction,
  useOutletContext,
  useParams,
} from "react-router";
import { useLoaderData } from "react-router";
import { type OutletContextShape } from "~/root";

import { NewButton, NewIcon, SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getPackageWiki } from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";

import type { Route } from "./+types/Wiki";
import "./Wiki.css";

export const loader = ssrLoader(async ({ params }: Route.LoaderArgs) => {
  if (params.communityId && params.namespaceId && params.packageId) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
        sessionId: undefined,
      };
    });

    let wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;

    try {
      wiki = await dapper.getPackageWiki(params.namespaceId, params.packageId);
    } catch (error) {
      if (isApiError(error)) {
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
      seo: createSeo({
        descriptors: [
          {
            title: `${params.namespaceId}-${params.packageId} Wiki | Thunderstore`,
          },
          {
            name: "description",
            content: `Wiki for ${params.namespaceId}-${params.packageId}`,
          },
        ],
      }),
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
});

export async function clientLoader({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
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
      seo: (await serverLoader()).seo,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

clientLoader.hydrate = true as const;

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
  currentUrl,
  nextUrl,
}) => {
  if (defaultShouldRevalidate) {
    return true;
  }

  // Reload when navigating away from edit/new pages to reflect changes in the sidebar
  if (
    (currentUrl.pathname.endsWith("/edit") &&
      !nextUrl.pathname.endsWith("/edit")) ||
    (currentUrl.pathname.endsWith("/new") && !nextUrl.pathname.endsWith("/new"))
  ) {
    return true;
  }

  return (
    currentParams.communityId !== nextParams.communityId ||
    currentParams.namespaceId !== nextParams.namespaceId ||
    currentParams.packageId !== nextParams.packageId
  );
};

export default function Wiki() {
  const { wiki, communityId, namespaceId, packageId, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();
  const { slug } = useParams();

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
