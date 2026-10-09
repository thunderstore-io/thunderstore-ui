import { faGhost } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr, getCanonicalUrl } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { isWikiEditorPath } from "cyberstorm/utils/wikiPaths";
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

import { packageTabSeo } from "../tabSeo";
import type { Route } from "./+types/Wiki";
import "./Wiki.css";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

/**
 * Shared by both loaders, since clientLoader.hydrate replaces the SSR match
 * data the <Seo> head reads.
 *
 * The canonical is the wiki page's own URL. packageListing, the layout above
 * this one, points og:url at the package listing so its tabs consolidate
 * there; a wiki page is the one thing under it with substantial content of its
 * own, so it keeps its own canonical rather than being folded away.
 */
function wikiSeo(
  params: { namespaceId: string; packageId: string; slug?: string },
  request: Request
) {
  return createSeo({
    descriptors: [
      // The wiki is a package tab, so it names itself the way the others do.
      ...packageTabSeo("Wiki", params.packageId).descriptors,
      { property: "og:url", content: getCanonicalUrl(request) },
      // The editors answer 200 to anyone, so a crawler reaches the "create a
      // wiki page" and "edit this page" forms as readily as a reader does.
      // They are UI, not content.
      ...(isWikiEditorPath(new URL(request.url).pathname, params.slug)
        ? [{ name: "robots", content: "noindex, follow" }]
        : []),
    ],
  });
}

export const loader = ssrLoader(
  async ({ params, request }: Route.LoaderArgs) => {
    if (params.communityId && params.namespaceId && params.packageId) {
      const dapper = new DapperTs(() => {
        return {
          apiHost: getApiHostForSsr(),
          sessionId: undefined,
        };
      });

      let wiki: Awaited<ReturnType<typeof getPackageWiki>> | undefined;

      try {
        wiki = await dapper.getPackageWiki(
          params.namespaceId,
          params.packageId
        );
      } catch (error) {
        if (isApiError(error) && error.response.status === 404) {
          wiki = undefined;
        } else {
          throw error;
        }
      }

      return {
        wiki: wiki,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        slug: params.slug,
        permissions: undefined,
        seo: wikiSeo(
          {
            namespaceId: params.namespaceId,
            packageId: params.packageId,
            slug: params.slug,
          },
          request
        ),
      };
    } else {
      throw new Error("Namespace ID or Package ID is missing");
    }
  },
  { cache: true }
);

export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({
  request,
  params,
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
      seo: wikiSeo(
        {
          namespaceId: params.namespaceId,
          packageId: params.packageId,
          slug: params.slug,
        },
        request
      ),
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

clientLoader.hydrate = true as const;

/**
 * Reload whenever the path changes.
 *
 * This route's data decides what the page says it is — its canonical is the
 * requested URL, and the editors are told apart from the pages by that URL too
 * — so data loaded for one path cannot describe another. Moving between a page
 * and its editor keeps every param, which is not a revalidation by default, and
 * left the editor claiming the page's canonical and missing its noindex.
 *
 * A path comparison also covers what the two rules it replaces were for: every
 * param is a path segment, so a param change is a path change, and leaving an
 * editor for the page it edited is one too, which is what refreshed the sidebar
 * after a wiki page was created or renamed.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  defaultShouldRevalidate,
  currentUrl,
  nextUrl,
}) => {
  if (defaultShouldRevalidate) {
    return true;
  }

  return currentUrl.pathname !== nextUrl.pathname;
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
              <Suspense>
                <Await resolve={permissions}>
                  {(resolvedPermissions) => {
                    const canManageWiki =
                      !!resolvedPermissions?.permissions.can_manage_wiki;
                    const shouldShowWikiNav = canManageWiki || hasPages;

                    return shouldShowWikiNav ? (
                      <WikiNav
                        communityId={communityId}
                        namespaceId={namespaceId}
                        packageId={packageId}
                        slug={slug}
                        wiki={resolvedWiki}
                        permissions={permissions}
                      />
                    ) : null;
                  }}
                </Await>
              </Suspense>

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
