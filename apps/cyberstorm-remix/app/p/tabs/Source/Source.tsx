import "./Source.css";

import {
  Await,
  type LoaderFunctionArgs,
  useOutletContext,
  useRouteError,
} from "react-router";
import { useLoaderData } from "react-router";
import { Suspense } from "react";
import ago from "s-ago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDownload } from "@fortawesome/free-solid-svg-icons";

import {
  SkeletonBox,
  Heading,
  NewIcon,
  NewButton,
} from "@thunderstore/cyberstorm";
import { TooltipWrapper } from "@thunderstore/cyberstorm/src/primitiveComponents/utils/utils";
import { type OutletContextShape } from "~/root";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { DapperTs } from "@thunderstore/dapper-ts";
import { Alert } from "@thunderstore/cyberstorm/src/newComponents/Alert/Alert";
import { getPackageSource } from "@thunderstore/dapper-ts/src/methods/package";
import { CodeBoxHTML } from "../../../commonComponents/CodeBoxHTML/CodeBoxHTML";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
  createNotFoundMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";

type PackageListingOutletContext = OutletContextShape & {
  packageDownloadUrl?: string;
};

const sourceErrorMappings = [
  SIGN_IN_REQUIRED_MAPPING,
  FORBIDDEN_MAPPING,
  createNotFoundMapping(
    "Source not available.",
    "We could not find the requested package source."
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
      const source = await dapper.getPackageSource(
        params.namespaceId,
        params.packageId
      );

      return {
        source,
      };
    } catch (error) {
      handleLoaderError(error, { mappings: sourceErrorMappings });
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Source not available.",
    description: "We could not find the requested package source.",
    category: "not_found",
    status: 404,
  });
}

export function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools.getConfig().apiHost,
        sessionId: tools.getConfig().sessionId,
      };
    });
    const source = dapper
      .getPackageSource(params.namespaceId, params.packageId)
      .catch((error) =>
        handleLoaderError(error, { mappings: sourceErrorMappings })
      );

    return {
      source,
    };
  }
  throwUserFacingPayloadResponse({
    headline: "Source not available.",
    description: "We could not find the requested package source.",
    category: "not_found",
    status: 404,
  });
}

export default function Source() {
  const { source } = useLoaderData<
    typeof loader | typeof clientLoader
  >();
  const outletContext = useOutletContext() as PackageListingOutletContext;

  return (
    <Suspense fallback={<SkeletonBox className="package-source__skeleton" />}>
      <Await resolve={source}>
        {(resolvedValue) => {
          const decompilations = resolvedValue?.decompilations ?? [];
          const lastDecompilationDate = resolvedValue?.last_decompilation_date;
          if (decompilations.length === 0) {
            return (
              <Alert csVariant="info">Decompiled source not available.</Alert>
            );
          }
          return decompilations.map((decompilation) => {
            return (
              <div
                className="package-source"
                key={decompilation.source_file_name}
              >
                <div className="package-source__header">
                  <div className="package-source__header-info">
                    <Heading csLevel="2">
                      {decompilation.source_file_name}
                    </Heading>
                    <div className="package-source__header-meta">
                      <DecompilationDateDisplay
                        lastDecompilationDate={lastDecompilationDate}
                      />
                    </div>
                  </div>
                  <DownloadButton
                    download_url={outletContext.packageDownloadUrl}
                    packageSize={decompilation.result_size}
                  />
                </div>
                {decompilation.is_truncated && (
                  <Alert csVariant="warning">
                    The result has been truncated due to the large size,
                    download it to view the full contents!
                  </Alert>
                )}
                <div
                  className="package-source__decompilations-file"
                  key={decompilation.source_file_name}
                >
                  <CodeBoxHTML value={decompilation.result} />
                </div>
              </div>
            );
          });
        }}
      </Await>
    </Suspense>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <div className="package-listing__error">
      <Heading csLevel="3" csSize="3" csVariant="primary" mode="display">
        {payload.headline}
      </Heading>
      {payload.description ? (
        <p className="package-listing__error-description">
          {payload.description}
        </p>
      ) : null}
    </div>
  );
}

const DecompilationDateDisplay = (props: {
  lastDecompilationDate: string | null | undefined;
}) => {
  if (!props.lastDecompilationDate) {
    return null;
  }

  return (
    <div className="package-source__header-meta-date">
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={faClock} />
      </NewIcon>

      <p>
        <span>Decompiled: </span>
        <TooltipWrapper
          tooltipText={new Date(props.lastDecompilationDate).toLocaleString()}
        >
          <span className="package-source__header-meta-date-time">
            {ago(new Date(props.lastDecompilationDate))}
          </span>
        </TooltipWrapper>
      </p>
    </div>
  );
};

const DownloadButton = (props: {
  download_url: string | undefined;
  packageSize: string | undefined;
}) => {
  return props.download_url ? (
    <NewButton
      csVariant="secondary"
      csSize="medium"
      primitiveType="link"
      href={props.download_url}
    >
      <NewIcon noWrapper csMode="inline">
        <FontAwesomeIcon icon={faDownload} />
      </NewIcon>
      Download
      {props.packageSize ? ` (${props.packageSize})` : ""}
    </NewButton>
  ) : null;
};
