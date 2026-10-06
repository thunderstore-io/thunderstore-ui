import ago from "s-ago";

interface Props {
  /** Text to be shown before the time value */
  prefix?: string;
  /** Time value to display */
  time: Date | string;
  /** Suppress hydration warning */
  suppressHydrationWarning?: boolean;
  /** Disable title attribute */
  disableTitle?: boolean;
}

/**
 * Display date as human readable relative time
 *
 * E.g. "now" or "1 hour ago".
 */
export const RelativeTime = (props: Props) => {
  const {
    time,
    prefix = "",
    suppressHydrationWarning = false,
    disableTitle = false,
  } = props;
  const dt = typeof time === "string" ? new Date(time) : time;
  // Guarded: an unparseable input makes toISOString throw.
  const machineReadable = Number.isNaN(dt.getTime())
    ? undefined
    : dt.toISOString();

  return (
    <time
      dateTime={machineReadable}
      suppressHydrationWarning={suppressHydrationWarning}
      title={disableTitle ? undefined : dt.toString()}
    >
      {prefix ?? null} {ago(dt)}
    </time>
  );
};
