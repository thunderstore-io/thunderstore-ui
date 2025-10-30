import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRouteError } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { Heading, SkeletonBox } from "@thunderstore/cyberstorm";
import "./Readme.css";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  createNotFoundMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";

const readmeErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  createNotFoundMapping(
    "Readme not available.",
    "We could not find a readme for this package."
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
      const readme = await dapper.getPackageReadme(
        params.namespaceId,
        params.packageId
      );

      return {
        readme,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: readmeErrorMappings });
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Readme not available.",
    description: "We could not find a readme for this package.",
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
    const readme = dapper
      .getPackageReadme(params.namespaceId, params.packageId)
      .catch((error) =>
        handleLoaderError(error, { mappings: readmeErrorMappings })
      );

    return {
      readme,
    };
  }
  throwUserFacingPayloadResponse({
    headline: "Readme not available.",
    description: "We could not find a readme for this package.",
    category: "not_found",
    status: 404,
  });
}

export default function Readme() {
  const { readme } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <Suspense fallback={<SkeletonBox className="package-readme__skeleton" />}>
      <Await resolve={readme}>
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
    <div className="package-readme__error">
      <Heading csLevel="3" csSize="3" csVariant="primary" mode="display">
        {payload.headline}
      </Heading>
      {payload.description ? (
        <p className="package-readme__error-description">
          {payload.description}
        </p>
      ) : null}
    </div>
  );
}
