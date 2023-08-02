import styles from "./ErrorLayout.module.css";
import { BaseLayout } from "../BaseLayout/BaseLayout";

export interface ErrorLayoutProps {
  error: Error;
}

/**
 * Cyberstorm NotFound Layout
 */
export function ErrorLayout(props: ErrorLayoutProps) {
  const { error } = props;
  return (
    <BaseLayout
      mainContent={
        <div className={styles.root}>
          <div className={styles.glitch} data-text={error.message}>
            <span>{error.message}</span>
          </div>
          <div className={styles.description}>
            {getErrorDescription(error.message) || "Unknown"}
          </div>
          <div className={styles.flavor}>
            {getErrorFlavor(error.message) ||
              "An error with an unknown error code happened"}
          </div>
        </div>
      }
    />
  );
}

ErrorLayout.displayName = "ErrorLayout";

function getErrorDescription(errorCode: string) {
  return {
    "404": "Page not found",
    "500": "Internal server error",
  }[errorCode];
}

function getErrorFlavor(errorCode: string) {
  return {
    "404": "Oops! You found a glitch in the matrix.",
    "500": "Beep boop. Server something error happens.",
  }[errorCode];
}
