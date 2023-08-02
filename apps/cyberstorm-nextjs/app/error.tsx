"use client";

import { useEffect } from "react";
import { ErrorLayout } from "@thunderstore/cyberstorm";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorLayout error={error} />;
}
