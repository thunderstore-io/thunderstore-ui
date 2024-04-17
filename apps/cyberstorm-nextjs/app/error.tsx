"use client";
import rootStyles from "./RootLayout.module.css";
import errorStyles from "./Error.module.css";
import { Button } from "@thunderstore/cyberstorm";

export default function Error({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // TODO: Unify and improve errors into a single component
  return (
    <div className={errorStyles.root}>
      <div className={errorStyles.glitch} data-text={500}>
        <span>{500}</span>
      </div>
      <div className={errorStyles.description}>Internal server error</div>
      <div className={errorStyles.flavor}>
        Beep boop. Server something error happens.
      </div>
      <Button.Root onClick={() => reset()}>
        <Button.ButtonLabel>Try again</Button.ButtonLabel>
      </Button.Root>
    </div>
  );
}
