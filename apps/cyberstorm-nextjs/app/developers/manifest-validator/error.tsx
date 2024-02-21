"use client";
import errorStyles from "../../Error.module.css";
import { Button } from "@thunderstore/cyberstorm";

export default function Error({
  // TODO: Remove this disable, when sentry logging is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // TODO: Add error logging to sentry
  // TODO: Unify and improve errors into a single component
  return (
    <div className={errorStyles.root}>
      <div className={errorStyles.flavor}>
        Beep boop. Server something error happens.
      </div>
      <Button.Root onClick={() => reset()}>
        <Button.ButtonLabel>Try again</Button.ButtonLabel>
      </Button.Root>
    </div>
  );
}
