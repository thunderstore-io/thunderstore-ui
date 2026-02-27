import { faClock, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { type SeoReturn, createSeo } from "cyberstorm/utils/meta";
import { Await, useOutletContext } from "react-router";
import { useLoaderData } from "react-router";
import ago from "s-ago";
import { ClientSuspense } from "~/commonComponents/ClientSuspense/ClientSuspense";
import { type OutletContextShape } from "~/root";

import {
  NewAlert as Alert,
  Heading,
  NewButton,
  NewIcon,
  SkeletonBox,
  TooltipWrapper,
} from "@thunderstore/cyberstorm";
import { DapperTs, getPackageSource } from "@thunderstore/dapper-ts";
import { isApiError } from "@thunderstore/thunderstore-api";

import { CodeBoxHTML } from "../../../commonComponents/CodeBoxHTML/CodeBoxHTML";
import type { Route } from "./+types/Source";
import "./Source.css";

type PackageListingOutletContext = OutletContextShape & {
  packageDownloadUrl?: string;
};

type ResultType = {
  status: string | null;
  message?: string;
  source?:
    | Awaited<ReturnType<typeof getPackageSource>>
    | ReturnType<typeof getPackageSource>;
  seo?: SeoReturn;
};

export async function loader({ params }: Route.LoaderArgs) {
  if (params.namespaceId && params.packageId) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
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
        seo: createSeo({
          descriptors: [
            {
              title: `${params.namespaceId}-${params.packageId} Source | Thunderstore`,
            },
            {
              name: "description",
              content: `Source code for ${params.namespaceId}-${params.packageId}`,
            },
          ],
        }),
      };
    } catch (error) {
      if (isApiError(error)) {
        if (error.response.status > 400) {
          result = {
            status: "error",
            source: undefined,
            message: `Failed to load source: ${error.message}`,
            seo: createSeo({ descriptors: [{ title: "Source Not Found" }] }),
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
    seo: createSeo({ descriptors: [{ title: "Source Not Found" }] }),
  };
}

export async function clientLoader({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) {
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
        seo: (await serverLoader()).seo,
      };
    } catch (error) {
      result = {
        status: "error",
        source: undefined,
        message: "Failed to load source",
        seo: (await serverLoader()).seo,
      };
      throw error;
    }
    return result;
  }
  return {
    status: "error",
    message: "Failed to load source",
    source: undefined,
    seo: (await serverLoader()).seo,
  };
}

export default function Source() {
  const { status, message, source } = useLoaderData<
    typeof loader | typeof clientLoader
  >();
  const outletContext = useOutletContext() as PackageListingOutletContext;

  if (status === "error") {
    return <TabFetchState variant="danger" message={message} />;
  }
  return (
    <ClientSuspense
      fallback={<SkeletonBox className="package-source__skeleton" />}
    >
      <Await
        resolve={source}
        errorElement={
          <TabFetchState
            variant="danger"
            message="Error occurred while loading source"
          />
        }
      >
        {(resolvedValue) => {
          const decompilations = resolvedValue?.decompilations ?? [];
          if (decompilations.length === 0) {
            return (
              <TabFetchState
                variant="info"
                message="Decompiled source not available."
              />
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
                        lastDecompilationDate={decompilation.datetime_created}
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
                  <CodeBoxHTML
                    value={decompilation.result}
                    language={"csharp"}
                  />
                </div>
              </div>
            );
          });
        }}
      </Await>
    </ClientSuspense>
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
