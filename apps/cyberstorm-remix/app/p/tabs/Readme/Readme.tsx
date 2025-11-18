import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Suspense } from "react";
import { SkeletonBox } from "@thunderstore/cyberstorm";
import "./Readme.css";
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
      const readme = await dapper.getPackageReadme(
        params.namespaceId,
        params.packageId
      );

      return {
        readme,
      };
    } catch (error) {
      handleLoaderError(error, {
        mappings: [
          createNotFoundMapping(
            "Readme not available.",
            "We could not find a readme for this package."
          ),
        ],
      });
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
    const { dapper } = getLoaderTools();
    const readme = dapper.getPackageReadme(
      params.namespaceId,
      params.packageId
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
  const { readme } = useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <Suspense fallback={<SkeletonBox className="package-readme__skeleton" />}>
      <Await resolve={readme} errorElement={<NimbusAwaitErrorElement />}>
        {(resolvedValue) => (
          <div className="markdown-wrapper">
            <div
              dangerouslySetInnerHTML={{ __html: resolvedValue.html }}
              className="markdown"
            />
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
