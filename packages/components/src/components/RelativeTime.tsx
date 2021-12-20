import { Text, TextProps } from "@chakra-ui/react";
import React from "react";
import ago from "s-ago";

interface RelativeTimeProps extends TextProps {
  /** Text to be shown before the time value */
  prefix?: string;
  /** Time value to display */
  time: Date | string;
}

/**
 * Display date as human readable relative time
 *
 * E.g. "now" or "1 hour ago".
 */
export const RelativeTime: React.FC<RelativeTimeProps> = (props) => {
  const { children, time, prefix, ...textProps } = props;
  const dt = typeof time === "string" ? new Date(time) : time;

  return (
    <Text title={dt.toLocaleString()} {...textProps}>
      {prefix ?? null} {ago(dt)}
    </Text>
  );
};
