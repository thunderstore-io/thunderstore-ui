import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { canViewPackageAnalytics } from "app/p/listingUtils";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getQueryServiceHost } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";

import { Heading, SkeletonBox, formatInteger } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import type { PackageDownloadHistory } from "@thunderstore/dapper/types";

import type { Route } from "./+types/Analytics";
import "./Analytics.css";
import { DownloadsChart } from "./DownloadsChart";

export function loader({ params }: Route.LoaderArgs) {
  return {
    history: undefined,
    permissions: undefined,
    seo: createSeo({
      descriptors: [
        {
          title: `${params.namespaceId}-${params.packageId} Analytics | Thunderstore`,
        },
      ],
    }),
  };
}

export { noStoreHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!params.namespaceId || !params.packageId) {
    throw new Response("Not Found", { status: 404 });
  }

  const tools = getSessionTools();
  const dapper = new DapperTs(() => ({
    apiHost: tools.getConfig().apiHost,
    sessionId: tools.getConfig().sessionId,
    queryServiceHost: getQueryServiceHost(),
  }));

  return {
    history: dapper.getPackageDownloadHistory(
      params.namespaceId,
      params.packageId
    ),
    permissions: dapper.getPackagePermissions(
      params.communityId,
      params.namespaceId,
      params.packageId
    ),
  };
}

clientLoader.hydrate = true;

export default function Analytics() {
  const { history, permissions } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <SkeletonBox className="package-analytics__skeleton" />;
  }

  return (
    <Suspense
      fallback={<SkeletonBox className="package-analytics__skeleton" />}
    >
      <Await
        resolve={permissions}
        errorElement={
          <TabFetchState
            variant="warning"
            message="Download analytics are unavailable right now."
          />
        }
      >
        {(resolvedPermissions) =>
          canViewPackageAnalytics(resolvedPermissions) ? (
            <div className="package-analytics">
              <div className="package-analytics__header">
                <Heading csLevel="2" csSize="3">
                  Downloads
                </Heading>
                <p className="package-analytics__subtitle">
                  Hourly downloads over the last 7 days.
                </p>
              </div>

              <Suspense
                fallback={
                  <SkeletonBox className="package-analytics__skeleton" />
                }
              >
                <Await
                  resolve={history}
                  errorElement={
                    <TabFetchState
                      variant="warning"
                      message="Download analytics are unavailable right now."
                    />
                  }
                >
                  {(resolvedHistory) => (
                    <DownloadsSection history={resolvedHistory} />
                  )}
                </Await>
              </Suspense>
            </div>
          ) : (
            <TabFetchState
              variant="info"
              message="Download analytics are only available to members of the team that owns this package."
            />
          )
        }
      </Await>
    </Suspense>
  );
}

function DownloadsSection({
  history,
}: {
  history: PackageDownloadHistory | undefined;
}) {
  if (!history || history.length === 0) {
    return (
      <TabFetchState variant="info" message="No download data available yet." />
    );
  }

  const total = history.reduce((sum, point) => sum + point.downloads, 0);
  const peak = history.reduce(
    (highest, point) => (point.downloads > highest.downloads ? point : highest),
    history[0]
  );

  return (
    <>
      <dl className="package-analytics__stats">
        <Stat label="Total" value={formatInteger(total, "standard")} />
        <Stat
          label="Busiest hour"
          value={formatInteger(peak.downloads, "standard")}
          detail={
            peak.downloads > 0 ? formatHour(peak.hour) : "No downloads yet"
          }
        />
        <Stat
          label="Daily average"
          value={formatInteger(Math.round(total / 7), "standard")}
        />
      </dl>

      <DownloadsChart history={history} />
      <details className="package-analytics__table-view">
        <summary>View as table</summary>
        <div className="package-analytics__table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Hour</th>
                <th scope="col">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {history.map((point) => (
                <tr key={point.hour}>
                  <td>{formatHour(point.hour)}</td>
                  <td>{formatInteger(point.downloads, "standard")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="package-analytics__stat">
      <dt className="package-analytics__stat-label">{label}</dt>
      <dd className="package-analytics__stat-value">{value}</dd>
      {detail ? (
        <dd className="package-analytics__stat-detail">{detail}</dd>
      ) : null}
    </div>
  );
}

const hourFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function formatHour(hour: string): string {
  return hourFormatter.format(new Date(hour));
}
