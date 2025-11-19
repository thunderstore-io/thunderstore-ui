import { faClock, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { createNotFoundMapping } from "cyberstorm/utils/errors/loaderMappings";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";
import { Suspense } from "react";
import {
  Await,
  type LoaderFunctionArgs,
  useLoaderData,
  useOutletContext,
} from "react-router";
import ago from "s-ago";
import { CodeBoxHTML } from "~/commonComponents/CodeBoxHTML/CodeBoxHTML";
import type { OutletContextShape } from "~/root";

import {
  Heading,
  NewAlert,
  NewButton,
  NewIcon,
  SkeletonBox,
  TooltipWrapper,
} from "@thunderstore/cyberstorm";

import "./Source.css";

type PackageListingOutletContext = OutletContextShape & {
  packageDownloadUrl?: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const { dapper } = getLoaderTools();
    try {
      const source = await dapper.getPackageSource(
        params.namespaceId,
        params.packageId
      );

      return {
        source,
      };
    } catch (error) {
      handleLoaderError(error, {
        mappings: [
          createNotFoundMapping(
            "Source not available.",
            "We could not find the requested package source."
          ),
        ],
      });
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
    const { dapper } = getLoaderTools();
    const source = dapper.getPackageSource(
      params.namespaceId,
      params.packageId
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
  const { source } = useLoaderData<typeof loader | typeof clientLoader>();
  const outletContext = useOutletContext() as PackageListingOutletContext;

  return (
    <Suspense fallback={<SkeletonBox className="package-source__skeleton" />}>
      <Await resolve={source} errorElement={<NimbusAwaitErrorElement />}>
        {(resolvedValue) => {
          const decompilations = resolvedValue?.decompilations ?? [];
          const lastDecompilationDate = resolvedValue?.last_decompilation_date;
          if (decompilations.length === 0) {
            return (
              <NewAlert csVariant="info">
                Decompiled source not available.
              </NewAlert>
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
                  <NewAlert csVariant="warning">
                    The result has been truncated due to the large size,
                    download it to view the full contents!
                  </NewAlert>
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
  return <NimbusDefaultRouteErrorBoundary />;
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
