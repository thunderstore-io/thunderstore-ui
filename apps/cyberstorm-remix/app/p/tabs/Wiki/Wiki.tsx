import "./Wiki.css";

import {
  Await,
  type LoaderFunctionArgs,
  Outlet,
  useLoaderData,
  useOutletContext,
  useRouteError,
} from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { NewAlert, NewButton, NewIcon, SkeletonBox } from "@thunderstore/cyberstorm";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type OutletContextShape } from "~/root";
import { Suspense } from "react";
import { getPackageWiki } from "@thunderstore/dapper-ts/src/methods/package";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  createNotFoundMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";

export const wikiErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  createNotFoundMapping(
    "Wiki not available.",
    "We could not find the requested wiki."
  ),
];

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    try {
      const wiki = await dapper.getPackageWiki(
        params.namespaceId,
        params.packageId
      );

      return {
        wiki,
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        slug: params.slug,
        permissions: undefined,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: wikiErrorMappings });
    }
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

    const wikiPromise = dapper
      .getPackageWiki(params.namespaceId, params.packageId)
      .catch((error) => handleLoaderError(error, { mappings: wikiErrorMappings }));

    const permissionsPromise = dapper
      .getPackagePermissions(
        params.communityId,
        params.namespaceId,
        params.packageId
      )
      .catch((error) => handleLoaderError(error, { mappings: wikiErrorMappings }));

    return {
      wiki: wikiPromise,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      slug: params.slug,
      permissions: permissionsPromise,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

/**
 * Displays the package wiki navigation and nested routes, relying on Suspense for data.
 */
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

/**
 * Maps loader errors to a user-facing alert when wiki data fails to resolve.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <div className="package-wiki">
      <NewAlert csVariant="danger">
        <strong>{payload.headline}</strong>
        {payload.description ? ` ${payload.description}` : ""}
      </NewAlert>
    </div>
  );
}
