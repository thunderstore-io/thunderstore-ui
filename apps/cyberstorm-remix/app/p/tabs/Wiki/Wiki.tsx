import { faGhost } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { Suspense } from "react";
import {
  Await,
  Outlet,
  type ShouldRevalidateFunction,
  useOutletContext,
  useParams,
} from "react-router";
import { useLoaderData, useLocation } from "react-router";
import { type OutletContextShape } from "~/root";

import {
  EmptyState,
  NewButton,
  NewIcon,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getPackageWiki } from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";

import type { Route } from "./+types/Wiki";
import "./Wiki.css";

export async function loader({ params }: Route.LoaderArgs) {
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
}

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

    const wiki = dapper
      .getPackageWiki(params.namespaceId, params.packageId)
      .catch((error: unknown) => {
        if (isApiError(error) && error.response.status === 404) {
          return undefined;
        }
        throw error;
      });

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

function WikiEmptyState() {
  return (
    <EmptyState.Root>
      <EmptyState.Icon>
        <FontAwesomeIcon icon={faGhost} />
      </EmptyState.Icon>
      <EmptyState.Title>No wiki pages</EmptyState.Title>
      <EmptyState.Message>
        This package does not have any wiki pages yet.
      </EmptyState.Message>
    </EmptyState.Root>
  );
}

function WikiNav({
  communityId,
  namespaceId,
  packageId,
  slug,
  wiki,
  permissions,
}: {
  communityId: string;
  namespaceId: string;
  packageId: string;
  slug: string | undefined;
  wiki: ReturnType<
    typeof useLoaderData<typeof loader | typeof clientLoader>
  >["wiki"];
  permissions: ReturnType<
    typeof useLoaderData<typeof loader | typeof clientLoader>
  >["permissions"];
}) {
  return (
    <div className="package-wiki-nav">
      <Suspense>
        <Await resolve={permissions}>
          {(resolvedValue) =>
            resolvedValue?.permissions.can_manage_wiki ? (
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
            <Await resolve={wiki}>
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
                        <span>{page.title}</span>
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
                        <span>{page.title}</span>
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
                      <span>{page.title}</span>
                    </NewButton>
                  );
                })
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function Wiki() {
  const { wiki, communityId, namespaceId, packageId, permissions } =
    useLoaderData<typeof loader | typeof clientLoader>();
  const { slug } = useParams();
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  const isEditorRoute =
    location.pathname.endsWith("/new") || location.pathname.endsWith("/edit");

  return (
    <Suspense
      fallback={
        <div className="package-wiki">
          <div className="package-wiki-nav">
            <div className="package-wiki-nav__section">
              <div className="package-wiki-nav__list">
                <SkeletonBox className="package-wiki-nav__skeleton" />
              </div>
            </div>
          </div>
          <div className="package-wiki-content">
            <SkeletonBox className="package-wiki__skeleton" />
          </div>
        </div>
      }
    >
      <Await resolve={wiki} errorElement={<></>}>
        {(resolvedWiki) => {
          const hasPages = !!resolvedWiki?.pages?.length;
          const shouldRenderOutlet = hasPages || isEditorRoute || !!slug;

          return (
            <div className="package-wiki">
              {(hasPages || !hasPages) && (
                <Suspense>
                  <Await resolve={permissions}>
                    {(resolvedPermissions) =>
                      resolvedPermissions?.permissions.can_manage_wiki ||
                      hasPages ? (
                        <WikiNav
                          communityId={communityId}
                          namespaceId={namespaceId}
                          packageId={packageId}
                          slug={slug}
                          wiki={resolvedWiki}
                          permissions={permissions}
                        />
                      ) : null
                    }
                  </Await>
                </Suspense>
              )}
              <div className="package-wiki-content">
                {shouldRenderOutlet ? (
                  <Outlet context={outletContext} />
                ) : (
                  <WikiEmptyState />
                )}
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
