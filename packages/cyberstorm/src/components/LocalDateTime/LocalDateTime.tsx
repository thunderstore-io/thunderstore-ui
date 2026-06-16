import { useEffect, useState } from "react";

interface Props {
  /** Time value to display (ISO string or Date). */
  time: Date | string;
  /** Intl date style; defaults to "medium" (e.g. "Jan 1, 2024"). */
  dateStyle?: "full" | "long" | "medium" | "short";
  /** Intl time style; defaults to "short". Pass null to render the date only. */
  timeStyle?: "full" | "long" | "medium" | "short" | null;
}

function format(
  dt: Date,
  locales: string | string[] | undefined,
  dateStyle: Props["dateStyle"],
  timeStyle: Props["timeStyle"]
): string {
  return dt.toLocaleString(locales, {
    dateStyle,
    ...(timeStyle ? { timeStyle } : {}),
  });
}

/**
 * Display an absolute timestamp in the visitor's own locale and timezone.
 *
 * The server has no knowledge of the visitor's timezone, so the first render
 * (SSR + initial hydration) uses a fixed "en-US" locale to stay deterministic;
 * after mount we re-render with `navigator.languages`, which localizes both the
 * format and the timezone. `suppressHydrationWarning` lets that post-mount value
 * replace the server's string without a hydration warning.
 */
export const LocalDateTime = (props: Props) => {
  const { time, dateStyle = "medium", timeStyle = "short" } = props;
  const dt = typeof time === "string" ? new Date(time) : time;

  const [text, setText] = useState(() =>
    format(dt, "en-US", dateStyle, timeStyle)
  );

  useEffect(() => {
    const d = typeof time === "string" ? new Date(time) : time;
    setText(format(d, [...navigator.languages], dateStyle, timeStyle));
  }, [time, dateStyle, timeStyle]);

  return (
    <span suppressHydrationWarning title={dt.toString()}>
      {text}
    </span>
  );
};

LocalDateTime.displayName = "LocalDateTime";
