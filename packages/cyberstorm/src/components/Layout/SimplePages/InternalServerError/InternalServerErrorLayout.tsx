import styles from "./InternalServerErrorLayout.module.css";
import { BaseLayout } from "../../BaseLayout/BaseLayout";

/**
 * Cyberstorm InternalServerError Layout
 */
export function InternalServerErrorLayout() {
  return <BaseLayout mainContent={<div className={styles.root}></div>} />;
}

InternalServerErrorLayout.displayName = "InternalServerErrorLayout";
