import { Await, useLoaderData, useRouteError } from "react-router";
import { type LoaderFunctionArgs } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import { Suspense } from "react";
import "./Changelog.css";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  createNotFoundMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import { Heading } from "@thunderstore/cyberstorm";

const changelogErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  createNotFoundMapping(
    "Changelog not available.",
    "We could not find a changelog for this package."
  ),
];

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    try {
      const changelog = await dapper.getPackageChangelog(
        params.namespaceId,
        params.packageId
      );

      return {
        changelog,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: changelogErrorMappings });
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
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
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
  const { changelog } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <Suspense
      fallback={<SkeletonBox className="package-changelog__skeleton" />}
    >
      <Await resolve={changelog}>
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
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <div className="package-changelog__error">
      <Heading csLevel="3" csSize="3" csVariant="primary" mode="display">
        {payload.headline}
      </Heading>
      {payload.description ? (
        <p className="package-changelog__error-description">
          {payload.description}
        </p>
      ) : null}
    </div>
  );
}
