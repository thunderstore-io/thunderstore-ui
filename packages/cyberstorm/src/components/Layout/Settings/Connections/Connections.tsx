import styles from "./Connections.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { UserSettings } from "../../../../schema";
import { PrivacyPolicyLink } from "../../../Links/Links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";

export interface ConnectionsProps {
  userData: UserSettings;
}

export function Connections(props: ConnectionsProps) {
  const { userData } = props;

  const connectionRows = userData.connections ? (
    userData.connections.map((connection, key) => (
      <div
        className={`${styles.item} ${
          connection.enabled ? styles.enabled : styles.disabled
        }`}
        key={key}
      >
        <div className={styles.connectionTypeInfo}>
          {connection.name === "Github" ? (
            <FontAwesomeIcon icon={faGithub} fixedWidth size="2x" />
          ) : null}
          {connection.name === "Discord" ? (
            <FontAwesomeIcon icon={faDiscord} fixedWidth size="2x" />
          ) : null}
          <div className={styles.connectionTypeInfoName}>{connection.name}</div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.connectedAs}>
            <div className={styles.connectedAsDescription}>Connected as</div>
            <div className={styles.connectedAsUsername}>
              {connection.connectedUsername}
            </div>
          </div>
          <div>Switch {connection.enabled.toString()}</div>
        </div>
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
