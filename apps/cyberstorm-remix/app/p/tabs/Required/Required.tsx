import "./Required.css";
import { Heading, SkeletonBox } from "@thunderstore/cyberstorm";
import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import { ListingDependency } from "~/commonComponents/ListingDependency/ListingDependency";
import { DapperTs } from "@thunderstore/dapper-ts";
import { type OutletContextShape } from "~/root";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    return {
      listing: dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
    };
  }
  throw new Response("Listing dependencies not found", { status: 404 });
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
    return {
      listing: dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
    };
  }
  throw new Response("Listing dependencies not found", { status: 404 });
}

export default function Required() {
  const { listing } = useLoaderData<typeof loader | typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <Suspense fallback={<SkeletonBox className="package-required__skeleton" />}>
      <Await
        resolve={listing}
        errorElement={
          <div>Error occurred while loading required dependencies</div>
        }
      >
        {(resolvedValue) => (
          <>
            <div className="required">
              <div className="required__title">
                <Heading csLevel="3" csSize="3">
                  Required mods ({resolvedValue.dependencies.length})
                </Heading>
                <span className="required__description">
                  This package requires the following packages to work.
                </span>
              </div>
              <div className="required__body">
                {resolvedValue.dependencies.map((dep, key) => {
                  return (
                    <ListingDependency
                      key={key}
                      dependency={dep}
                      // TODO: Remove when package versiond detail is available
                      domain={outletContext.domain}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </Await>
    </Suspense>
  );
}
