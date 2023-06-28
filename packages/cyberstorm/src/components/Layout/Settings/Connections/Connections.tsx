import styles from "./Connections.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { Connection, UserSettings } from "../../../../schema";
import { PrivacyPolicyLink } from "../../../Links/Links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

export interface ConnectionsProps {
  userData: UserSettings;
}

export interface ConnectionsItemProps {
  connection: Connection;
}

//TODO: Use Switch component
export function ConnectionsItem(props: ConnectionsItemProps) {
  const { connection } = props;

  const [enabled, setEnabled] = useState(connection.enabled);

  return (
    <div
      className={`${styles.itemWrapper} ${
        enabled ? styles.enabled : styles.disabled
      }`}
    >
      <div className={styles.item}>
        <div className={styles.connectionTypeInfo}>
          {connection.name === "Github" ? (
            <FontAwesomeIcon icon={faGithub} fixedWidth />
          ) : null}
          {connection.name === "Discord" ? (
            <FontAwesomeIcon icon={faDiscord} fixedWidth />
          ) : null}
          <div className={styles.connectionTypeInfoName}>{connection.name}</div>
        </div>
        <div className={styles.rightSection}>
          {enabled ? (
            <div className={styles.connectedAs}>
              <div className={styles.connectedAsDescription}>Connected as</div>
              <div className={styles.connectedAsUsername}>
                {connection.connectedUsername}
              </div>
            </div>
          ) : null}
          <input
            type="checkbox"
            checked={enabled}
            onClick={() => setEnabled(!enabled)}
          />
        </div>
      </div>
    </div>
  );
}

export function Connections(props: ConnectionsProps) {
  const { userData } = props;

  const connectionRows = userData.connections ? (
    userData.connections.map((connection, index) => (
      <ConnectionsItem connection={connection} key={index} />
    ))
  ) : (
    <></>
  );

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Connections"
          description={
            <>
              This information will not be shared outside of Thunderstore. Read
              more on our{" "}
              <span className={styles.privacyPolicyLink}>
                <PrivacyPolicyLink>Privacy Policy</PrivacyPolicyLink>
              </span>
              .
            </>
          }
          content={
            <div className={styles.connectionList}>{connectionRows}</div>
          }
        />
      </div>
    </div>
  );
}

Connections.displayName = "Connections";
ConnectionsItem.displayName = "ConnectionsItem";
