import { ErrorLayout } from "@thunderstore/cyberstorm";

export default function Error({}: { error: Error; reset: () => void }) {
  return <ErrorLayout error={500} />;
}
