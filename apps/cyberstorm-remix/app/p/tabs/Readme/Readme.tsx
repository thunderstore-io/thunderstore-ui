import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import "./Readme.css";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  createNotFoundMapping,
} from "cyberstorm/utils/errors/loaderMappings";

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
      const readmePromise = dapper.getPackageReadme(
        params.namespaceId,
        params.packageId
      );
      await readmePromise;

      return {
        readme: readmePromise,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: readmeErrorMappings });
    }
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    try {
      const readmePromise = dapper.getPackageReadme(
        params.namespaceId,
        params.packageId
      );
      await readmePromise;

      return {
        readme: readmePromise,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: readmeErrorMappings });
    }
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
  };
}

export default function Readme() {
  const { status, message, readme } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "error") return <div>{message}</div>;
  return (
    <Suspense fallback={<SkeletonBox className="package-readme__skeleton" />}>
      <Await
        resolve={readme}
        errorElement={<div>Error occurred while loading description</div>}
      >
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
