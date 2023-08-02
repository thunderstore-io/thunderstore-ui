import { ErrorLayout } from "@thunderstore/cyberstorm";

export default function NotFound() {
  return <ErrorLayout error={new Error("404")} />;
}
