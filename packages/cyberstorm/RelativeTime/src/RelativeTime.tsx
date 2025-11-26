import ago from "s-ago";

interface Props {
  /** Text to be shown before the time value */
  prefix?: string;
  /** Time value to display */
  time: Date | string;
  suppressHydrationWarning?: boolean;
}

/**
 * Display date as human readable relative time
 *
 * E.g. "now" or "1 hour ago".
 */
export const RelativeTime = (props: Props) => {
  const { time, prefix = "", suppressHydrationWarning = false } = props;
  const dt = typeof time === "string" ? new Date(time) : time;

  return (
    <span
      suppressHydrationWarning={suppressHydrationWarning}
      title={dt.toString()}
    >
      {prefix ?? null} {ago(dt)}
    </span>
  );
};
