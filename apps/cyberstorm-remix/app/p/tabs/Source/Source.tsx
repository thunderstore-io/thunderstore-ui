import "./Source.css";

import { Await, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Suspense } from "react";
import ago from "s-ago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDownload } from "@fortawesome/free-solid-svg-icons";

import { SkeletonBox, Heading, NewIcon, NewButton, Tooltip } from "@thunderstore/cyberstorm";
import { packageSourceSchema } from "@thunderstore/thunderstore-api";
import { DapperFake } from "@thunderstore/dapper-fake";
import { TooltipWrapper } from "@thunderstore/cyberstorm/src/primitiveComponents/utils/utils";

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
                              <TooltipWrapper tooltipText={new Date(resolvedValue.last_decompilation_date).toLocaleString()}>
                                <span className="package-source__header-meta-date-time">{ago(new Date(resolvedValue.last_decompilation_date))}</span>
                              </TooltipWrapper>
                            </p>
                        </div>
                    </div>
                </div>

                <NewButton csVariant="secondary" csSize="medium" primitiveType="link" href="TODO: download url">
                    <NewIcon csMode="inline" noWrapper>
                        <FontAwesomeIcon icon={faDownload} />
                    </NewIcon>
                    Download (TODO: size)
                </NewButton>
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
