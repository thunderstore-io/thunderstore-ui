import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatInteger } from "@thunderstore/cyberstorm";
import type {
  PackageDownloadHistory,
  PackageDownloadHistoryPoint,
} from "@thunderstore/dapper/types";

import "./DownloadsChart.css";

const dayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const hourFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function DownloadsChart({
  history,
}: {
  history: PackageDownloadHistory;
}) {
  const ticks = useMemo(
    () =>
      history
        .filter((point) => new Date(point.hour).getHours() === 0)
        .map((point) => point.hour),
    [history]
  );

  return (
    <div className="downloads-chart">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={history}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hour"
            ticks={ticks}
            tickFormatter={(hour: string) => dayFormat.format(new Date(hour))}
            tickLine={false}
            minTickGap={16}
          />
          <YAxis
            width={56}
            allowDecimals={false}
            tickFormatter={(downloads: number) => formatInteger(downloads)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip isAnimationActive={false} content={<DownloadsTooltip />} />
          <Area
            type="linear"
            dataKey="downloads"
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

DownloadsChart.displayName = "Downloads Chart";

function DownloadsTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: PackageDownloadHistoryPoint }[];
}) {
  const point = payload?.[0]?.payload;

  if (!active || !point) {
    return null;
  }

  return (
    <div className="downloads-chart__tooltip">
      <span className="downloads-chart__tooltip-label">
        {hourFormat.format(new Date(point.hour))}
      </span>
      <span className="downloads-chart__tooltip-value">
        {formatInteger(point.downloads, "standard")}
        {point.downloads === 1 ? " download" : " downloads"}
      </span>
    </div>
  );
}
