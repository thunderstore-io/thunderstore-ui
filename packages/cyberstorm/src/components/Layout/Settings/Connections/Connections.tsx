import styles from "./Connections.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { UserSettings } from "../../../../schema";
import { Link } from "../../../Link/Link";

export interface ConnectionsProps {
  userData: UserSettings;
}

export function Connections(props: ConnectionsProps) {
  const { userData } = props;

  const connectionRows = userData.connections ? (
    userData.connections.map((connection, key) => (
      <div key={key}>
        <div>{connection.name}</div>
        <div>{connection.connectedUsername}</div>
        <div>{connection.imageSource}</div>
        <div>{connection.enabled}</div>
      </div>
    ))
  ) : (
    <></>
  );

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Connections"
          additionalLeftColumnContent={<Link label="Privacy policy" />}
          description="This information will not be shared outside of Thunderstore. Read more on our Privacy policy:"
          content={<div>{connectionRows}</div>}
        />
      </div>
    </div>
  );
}

Connections.displayName = "Connections";
