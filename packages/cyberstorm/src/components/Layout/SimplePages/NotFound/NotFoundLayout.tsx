import styles from "./NotFoundLayout.module.css";
import { BaseLayout } from "../../BaseLayout/BaseLayout";

/**
 * Cyberstorm NotFound Layout
 */
export function NotFoundLayout() {
  return <BaseLayout mainContent={<div className={styles.root}></div>} />;
}

NotFoundLayout.displayName = "NotFoundLayout";
NotFoundLayout.defaultProps = {};
