import "./Required.css";
import { Heading } from "@thunderstore/cyberstorm";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ApiError } from "@thunderstore/thunderstore-api";
import { useLoaderData } from "@remix-run/react";
import { ListingDependency } from "~/commonComponents/ListingDependency/ListingDependency";
import { DapperTs } from "@thunderstore/dapper-ts";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const dapper = new DapperTs({
        apiHost: process.env.PUBLIC_API_URL,
        sessionId: undefined,
        csrfToken: undefined,
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

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    try {
      const dapper = window.Dapper;
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

  return (
    <div className="nimbus-packagelisting__tabs__required">
      <div className="nimbus-packagelisting__tabs__required__title">
        <Heading
          csLevel="3"
          csSize="3"
          rootClasses="nimbus-packagelisting__tabs__required__title__heading"
        >
          Required mods ({listing.dependencies.length})
        </Heading>
        <span className="nimbus-packagelisting__tabs__required__title__description">
          This package requires the following packages to work.
        </span>
      </div>
      <div className="nimbus-packagelisting__tabs__required__body">
        {listing.dependencies.map((dep, key) => {
          return <ListingDependency key={key} dependency={dep} />;
        })}
      </div>
    </div>
  );
}
