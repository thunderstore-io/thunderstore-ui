import "./Required.css";
import { Heading } from "@thunderstore/cyberstorm";
import { LoaderFunctionArgs } from "react-router";
import { ApiError } from "@thunderstore/thunderstore-api";
import { useLoaderData, useOutletContext } from "react-router";
import { ListingDependency } from "~/commonComponents/ListingDependency/ListingDependency";
import { DapperTs } from "@thunderstore/dapper-ts";
import { OutletContextShape } from "~/root";
import { getSessionTools } from "~/middlewares";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const dapper = new DapperTs(() => {
        return {
          apiHost: process.env.VITE_API_URL,
          sessionId: undefined,
        };
      });
      return {
        listing: await dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Listing dependencies not found", { status: 404 });
      } else {
        throw error;
      }
    }
  }
  throw new Response("Listing dependencies not found", { status: 404 });
}

export async function clientLoader({ context, params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const tools = getSessionTools(context);
      const dapper = new DapperTs(() => {
        return {
          apiHost: tools?.getConfig().apiHost,
          sessionId: tools?.getConfig().sessionId,
        };
      });
      return {
        listing: await dapper.getPackageListingDetails(
          params.communityId,
          params.namespaceId,
          params.packageId
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Listing dependencies not found", { status: 404 });
      } else {
        throw error;
      }
    }
  }
  throw new Response("Listing dependencies not found", { status: 404 });
}

export default function Required() {
  const { listing } = useLoaderData<typeof loader | typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <div className="required">
      <div className="required__title">
        <Heading csLevel="3" csSize="3">
          Required mods ({listing.dependencies.length})
        </Heading>
        <span className="required__description">
          This package requires the following packages to work.
        </span>
      </div>
      <div className="required__body">
        {listing.dependencies.map((dep, key) => {
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
  );
}
