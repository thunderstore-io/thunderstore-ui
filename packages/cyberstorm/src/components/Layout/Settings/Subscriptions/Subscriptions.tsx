import styles from "./Subscriptions.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";

export function Subscriptions() {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Subscription Status"
          description="You can update your subscription status any time."
          content={<div>TODO</div>}
        />
      </div>
      <div className={styles.line} />
      <div className={styles.section}>
        <SettingItem
          title="Billing information"
          description="This is how we take your monies."
          content={<div>TODO</div>}
        />
      </div>
      <div className={styles.line} />
      <div className={styles.section}>
        <SettingItem
          title="Get Boost"
          description="Get access to premium features, including no ads, unique cosmetics, and more!"
          content={<div>TODO</div>}
        />
      </div>
    </div>
  );
}

Subscriptions.displayName = "Subscriptions";
Subscriptions.defaultProps = {};
