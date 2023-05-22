import styles from "./TermsOfServiceLayout.module.css";
import { BaseLayout } from "../../BaseLayout/BaseLayout";

/**
 * Cyberstorm TermsOfService Layout
 */
export function TermsOfServiceLayout() {
  return <BaseLayout mainContent={<div className={styles.root}></div>} />;
}

TermsOfServiceLayout.displayName = "TermsOfServiceLayout";
