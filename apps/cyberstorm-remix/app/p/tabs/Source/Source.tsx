import { faClock, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { type SeoReturn, createSeo } from "cyberstorm/utils/meta";
import { Suspense } from "react";
import { Await } from "react-router";
import { useLoaderData } from "react-router";
import ago from "s-ago";

import {
  NewAlert as Alert,
  Heading,
  NewButton,
  NewIcon,
  SkeletonBox,
  TooltipWrapper,
} from "@thunderstore/cyberstorm";
import { DapperTs, getPackageSource } from "@thunderstore/dapper-ts";

import { CodeBoxHTML } from "../../../commonComponents/CodeBoxHTML/CodeBoxHTML";
import type { Route } from "./+types/Source";
import "./Source.css";

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
    return {
      status: null,
      source: undefined,
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
  }
  return {
    status: "error",
    message: "Analysis not available",
    source: undefined,
    seo: createSeo({ descriptors: [{ title: "Source Not Found" }] }),
  };
}

export { noStoreHeaders as headers } from "cyberstorm/utils/ssrLoader";

clientLoader.hydrate = true;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
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
        message: "Analysis not available",
      };
      throw error;
    }
    return result;
  }
  return {
    status: "error",
    message: "Analysis not available",
    source: undefined,
  };
}

export default function Source() {
  const { status, message, source } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "error") {
    return <TabFetchState variant="info" message={message} />;
  }
  return (
    <Suspense fallback={<SkeletonBox className="package-source__skeleton" />}>
      <Await
        resolve={source}
        errorElement={
          <TabFetchState variant="info" message="Analysis not available" />
        }
      >
        {(resolvedValue) => {
          const decompilations = resolvedValue?.decompilations ?? [];
          if (decompilations.length === 0) {
            return (
              <TabFetchState variant="info" message="Analysis not available" />
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
                  {decompilation.url ? (
                    <div className="package-source__header-actions">
                      <DownloadButton
                        url={decompilation.url}
                        size={decompilation.result_size}
                      />
                    </div>
                  ) : null}
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
    </Suspense>
  );
}

/** Derive a leading-dot file ending (e.g. ".blob") from a download URL. */
function fileEndingFromUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const segment = new URL(url, "https://localhost").pathname.split("/").pop();
    const dot = segment ? segment.lastIndexOf(".") : -1;
    return dot > 0 ? (segment as string).slice(dot) : null;
  } catch {
    return null;
  }
}

/** Download link for a decompiled file, labelled "<ending> (<size>)". */
const DownloadButton = (props: { url: string; size?: string }) => {
  const fileEnding = fileEndingFromUrl(props.url);
  let label = "Download";
  if (fileEnding) {
    label = props.size ? `${fileEnding} (${props.size})` : fileEnding;
  }

  return (
    <NewButton
      csVariant="secondary"
      csSize="small"
      primitiveType="link"
      href={props.url}
      tooltipText="Download"
      aria-label="Download file"
    >
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={faDownload} />
      </NewIcon>
      {label}
    </NewButton>
  );
};

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
