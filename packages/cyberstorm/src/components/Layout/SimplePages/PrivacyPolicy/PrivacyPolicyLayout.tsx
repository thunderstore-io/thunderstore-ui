import styles from "./PrivacyPolicyLayout.module.css";
import { BaseLayout } from "../../BaseLayout/BaseLayout";

/**
 * Cyberstorm PrivacyPolicy Layout
 */
export function PrivacyPolicyLayout() {
  return <BaseLayout mainContent={<div className={styles.root}></div>} />;
}

PrivacyPolicyLayout.displayName = "PrivacyPolicyLayout";
PrivacyPolicyLayout.defaultProps = {};
