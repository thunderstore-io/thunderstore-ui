import styles from "./ErrorLayout.module.css";
import { BaseLayout } from "../BaseLayout/BaseLayout";

export interface ErrorLayoutProps {
  error: 404 | 500;
}

/**
 * Cyberstorm NotFound Layout
 */
export function ErrorLayout(props: ErrorLayoutProps) {
  const { error } = props;

  let errorCode = "Error";
  let errorDescription = "Unknown";
  let errorFlavorText = "An error with an unknown error code happened";

  if (error === 404) {
    errorCode = "404";
    errorDescription = "Page not found";
    errorDescription = "Page not found";
    errorFlavorText = "Oops! You found a glitch in the matrix.";
  } else if (error === 500) {
    errorCode = "500";
    errorDescription = "Internal server error";
    errorFlavorText = "Beep boop. Server something error happens.";
  }

  return (
    <BaseLayout
      mainContent={
        <div className={styles.root}>
          <div className={styles.glitch} data-text={errorCode}>
            <span>{errorCode}</span>
          </div>
          <div className={styles.description}>{errorDescription}</div>
          <div className={styles.flavor}>{errorFlavorText}</div>
        </div>
      }
    />
  );
}

ErrorLayout.displayName = "ErrorLayout";
