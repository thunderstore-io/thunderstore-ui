import "./Source.css";

import { Await, LoaderFunctionArgs, useOutletContext } from "react-router";
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
  CodeBoxHTML,
} from "@thunderstore/cyberstorm";
import { TooltipWrapper } from "@thunderstore/cyberstorm/src/primitiveComponents/utils/utils";
import { OutletContextShape } from "~/root";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { DapperTs } from "@thunderstore/dapper-ts";
import { Alert } from "@thunderstore/cyberstorm/src/newComponents/Alert/Alert";
import { isApiError } from "@thunderstore/thunderstore-api";
import { getPackageSource } from "@thunderstore/dapper-ts/src/methods/package";

type PackageListingOutletContext = OutletContextShape & {
  packageDownloadUrl?: string;
};

type ResultType = {
  status: string | null;
  message?: string;
  source?:
    | Awaited<ReturnType<typeof getPackageSource>>
    | ReturnType<typeof getPackageSource>;
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    let result: ResultType = {
      status: null,
      source: undefined,
      message: undefined,
    };
    try {
      const source = await dapper.getPackageSource(
        params.namespaceId,
        params.packageId
      );
      result = {
        status: null,
        source: source,
        message: undefined,
      };
    } catch (error) {
      if (isApiError(error)) {
        if (error.response.status > 400) {
          result = {
            status: "error",
            source: undefined,
            message: `Failed to load source: ${error.message}`,
          };
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    return result;
  }
  return {
    status: "error",
    message: "Failed to load source",
    source: undefined,
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools.getConfig().apiHost,
        sessionId: tools.getConfig().sessionId,
      };
    });
    let result: ResultType = {
      status: null,
      source: undefined,
      message: undefined,
    };
    try {
      const source = dapper.getPackageSource(
        params.namespaceId,
        params.packageId
      );
      result = {
        status: null,
        source: source,
        message: undefined,
      };
    } catch (error) {
      result = {
        status: "error",
        source: undefined,
        message: "Failed to load source",
      };
      throw error;
    }
    return result;
  }
  return {
    status: "error",
    message: "Failed to load source",
    source: undefined,
  };
}

export default function Source() {
  const { status, message, source } = useLoaderData<
    typeof loader | typeof clientLoader
  >();
  const outletContext = useOutletContext() as PackageListingOutletContext;

  if (status === "error") {
    return <div>{message}</div>;
  }
  return (
    <Suspense fallback={<SkeletonBox className="package-source__skeleton" />}>
      <Await
        resolve={source}
        errorElement={<div>Error occurred while loading source</div>}
      >
        {(resolvedValue) => {
          if (resolvedValue?.decompilations.length === 0) {
            return (
              <Alert csVariant="info">Decompiled source not available.</Alert>
            );
          }
          return resolvedValue?.decompilations.map((decompilation) => {
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
                        lastDecompilationDate={
                          resolvedValue.last_decompilation_date
                        }
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
