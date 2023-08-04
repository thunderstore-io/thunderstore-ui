import styles from "./ErrorLayout.module.css";
import { BaseLayout } from "../BaseLayout/BaseLayout";

export interface ErrorLayoutProps {
  error: 404 | 500;
}

interface ErrorLayoutInfo {
  code: string;
  description: string;
  flavorText: string;
}

/**
 * Cyberstorm Error Layout
 */
export function ErrorLayout(props: ErrorLayoutProps) {
  const { error } = props;

  const errorInfo = getErrorInfo(error);

  return (
    <BaseLayout
      mainContent={
        <div className={styles.root}>
          <div className={styles.glitch} data-text={errorInfo.code}>
            <span>{errorInfo.code}</span>
          </div>
          <div className={styles.description}>{errorInfo.description}</div>
          <div className={styles.flavor}>{errorInfo.flavorText}</div>
        </div>
      }
    />
  );
}

ErrorLayout.displayName = "ErrorLayout";

function getErrorInfo(error: 404 | 500): ErrorLayoutInfo {
  return {
    404: {
      code: "404",
      description: "Page not found",
      flavorText: "Oops! You found a glitch in the matrix.",
    },
    500: {
      code: "500",
      description: "Internal server error",
      flavorText: "Beep boop. Server something error happens.",
    },
  }[error];
}
