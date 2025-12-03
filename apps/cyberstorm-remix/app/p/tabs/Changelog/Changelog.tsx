import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import { type LoaderFunctionArgs } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import "./Changelog.css";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { createNotFoundMapping } from "cyberstorm/utils/errors/loaderMappings";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();
    try {
      const changelog = await dapper.getPackageChangelog(
        params.namespaceId,
        params.packageId
      );

      return {
        changelog,
      };
    } catch (error) {
      handleLoaderError(error, {
        mappings: [
          createNotFoundMapping(
            "Changelog not available.",
            "We could not find a changelog for this package."
          ),
        ],
      });
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Changelog not available.",
    description: "We could not find a changelog for this package.",
    category: "not_found",
    status: 404,
  });
}

export function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();
    return {
      changelog: dapper.getPackageChangelog(
        params.namespaceId,
        params.packageId
      ),
    };
  }
  throwUserFacingPayloadResponse({
    headline: "Changelog not available.",
    description: "We could not find a changelog for this package.",
    category: "not_found",
    status: 404,
  });
}

export default function Changelog() {
  const { changelog } = useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <Suspense
      fallback={<SkeletonBox className="package-changelog__skeleton" />}
    >
      <Await resolve={changelog} errorElement={<NimbusAwaitErrorElement />}>
        {(resolvedValue) => (
          <>
            <div className="markdown-wrapper">
              <div
                dangerouslySetInnerHTML={{ __html: resolvedValue.html }}
                className="markdown"
              />
            </div>
          </>
        )}
      </Await>
    </Suspense>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
