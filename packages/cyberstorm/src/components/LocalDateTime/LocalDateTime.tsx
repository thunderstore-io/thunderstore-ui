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
  timeStyle: Props["timeStyle"],
  timeZone?: string
): string {
  return dt.toLocaleString(locales, {
    dateStyle,
    ...(timeStyle ? { timeStyle } : {}),
    ...(timeZone ? { timeZone } : {}),
  });
}

/**
 * Display an absolute timestamp in the visitor's own locale and timezone.
 *
 * The server has no knowledge of the visitor's locale or timezone, so the first
 * render (SSR + initial hydration) is pinned to a fixed "en-US" locale *and*
 * UTC timezone to stay deterministic — without the fixed timezone the string
 * would otherwise vary with the server's TZ and diverge from the client's first
 * render, causing a hydration mismatch/flicker. After mount we re-render with
 * `navigator.languages` and the visitor's local timezone. `suppressHydrationWarning`
 * lets that post-mount value replace the server's string without a warning.
 */
export const LocalDateTime = (props: Props) => {
  const { time, dateStyle = "medium", timeStyle = "short" } = props;
  const dt = typeof time === "string" ? new Date(time) : time;

  const [text, setText] = useState(() =>
    format(dt, "en-US", dateStyle, timeStyle, "UTC")
  );

  useEffect(() => {
    const d = typeof time === "string" ? new Date(time) : time;
    const locales =
      navigator.languages && navigator.languages.length > 0
        ? [...navigator.languages]
        : [navigator.language || "en-US"];
    setText(format(d, locales, dateStyle, timeStyle));
  }, [time, dateStyle, timeStyle]);

  // dir="auto" lets the browser infer the reading direction from the rendered
  // text, so localized timestamps display correctly under RTL locales.
  return (
    <span suppressHydrationWarning dir="auto" title={text}>
      {text}
    </span>
  );
};

LocalDateTime.displayName = "LocalDateTime";
