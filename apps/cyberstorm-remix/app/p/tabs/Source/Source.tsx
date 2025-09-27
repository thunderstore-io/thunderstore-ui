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
} from "@thunderstore/cyberstorm";
import { packageSourceSchema } from "@thunderstore/thunderstore-api";
import { DapperFake } from "@thunderstore/dapper-fake";
import { TooltipWrapper } from "@thunderstore/cyberstorm/src/primitiveComponents/utils/utils";
import { formatFileSize } from "@thunderstore/cyberstorm/src/utils/utils";
import { OutletContextShape } from "~/root";

type PackageListingOutletContext = OutletContextShape & {
  packageSize?: number;
  packageDownloadUrl?: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const dapper = new DapperFake();
    return {
      source: dapper.getPackageSource(params.namespaceId, params.packageId),
    };
  }
  return {
    status: "error",
    message: "Failed to load source",
    source: packageSourceSchema.parse({}),
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const dapper = new DapperFake();
    return {
      source: dapper.getPackageSource(params.namespaceId, params.packageId),
    };
  }
  return {
    status: "error",
    message: "Failed to load source",
    source: packageSourceSchema.parse({}),
  };
}

export default function Source() {
  const { status, message, source } = useLoaderData<
    typeof loader | typeof clientLoader
  >();
  const outletContext = useOutletContext() as PackageListingOutletContext;
  const packageSize = outletContext.packageSize;

  if (status === "error") {
    return <div>{message}</div>;
  }

  return (
    <Suspense fallback={<SkeletonBox className="package-source__skeleton" />}>
      <Await resolve={source}>
        {(resolvedValue) => (
          <div className="package-source">
            <div className="package-source__header">
              <div className="package-source__header-info">
                <Heading csLevel="2">Package Source</Heading>
                <div className="package-source__header-meta">
                  <div className="package-source__header-meta-date">
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faClock} />
                    </NewIcon>

                    <p>
                      <span>Decompiled: </span>
                      <TooltipWrapper
                        tooltipText={new Date(
                          resolvedValue.last_decompilation_date
                        ).toLocaleString()}
                      >
                        <span className="package-source__header-meta-date-time">
                          {ago(new Date(resolvedValue.last_decompilation_date))}
                        </span>
                      </TooltipWrapper>
                    </p>
                  </div>
                </div>
              </div>

              <DownloadButton
                download_url={outletContext.packageDownloadUrl}
                packageSize={packageSize}
              />
            </div>

            <div className="package-source__decompilations">
              TODO: Add CodeBox
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

const DownloadButton = (props: {
  download_url: string | undefined;
  packageSize: number | undefined;
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
      {props.packageSize ? ` (${formatFileSize(props.packageSize)})` : ""}
    </NewButton>
  ) : null;
};
