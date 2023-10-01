"use client";

import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OAuthConnection } from "@thunderstore/dapper/types";

import styles from "./Connections.module.css";
import { PrivacyPolicyLink } from "../../../Links/Links";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { Switch } from "../../../Switch/Switch";
import { Icon } from "../../../Icon/Icon";

const PROVIDERS = [
  { name: "Discord", icon: faDiscord },
  { name: "GitHub", icon: faGithub },
  { name: "Overwolf", icon: faGithub }, // TODO: icon
];

interface ConnectionsProps {
  connections: OAuthConnection[];
}

/**
 * Status of user's OAuth connections for each available provider.
 */
export function Connections(props: ConnectionsProps) {
  const { connections } = props;

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
            <div className={styles.connectionList}>
              {PROVIDERS.map((p) => (
                <Connection
                  key={p.name}
                  provider={p}
                  connection={connections?.find(
                    (c) => c.name.toLowerCase() === p.name.toLowerCase()
                  )}
                />
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
}

Connections.displayName = "Connections";

interface ConnectionProps {
  // TODO: IDE disagrees with what precommit prettier wants, fix config.
  // eslint-disable-next-line prettier/prettier
  provider: typeof PROVIDERS[number];
  connection?: OAuthConnection;
}

// TODO: clicking the switch should start OAuth account (un)linking.
function Connection(props: ConnectionProps) {
  const { connection, provider } = props;

  return (
    <div
      className={`${styles.itemWrapper} ${
        connection ? styles.enabled : styles.disabled
      }`}
    >
      <div className={styles.item}>
        <div className={styles.connectionTypeInfo}>
          <Icon>
            <FontAwesomeIcon icon={provider.icon} fixedWidth />
          </Icon>
          <div className={styles.connectionTypeInfoName}>{provider.name}</div>
        </div>
        <div className={styles.rightSection}>
          {connection ? (
            <div className={styles.connectedAs}>
              <div className={styles.connectedAsDescription}>Connected as</div>
              <div className={styles.connectedAsUsername}>
                {connection.connectedUsername}
              </div>
            </div>
          ) : null}
          <Switch state={connection !== undefined} />
        </div>
      </div>
    </div>
  );
}

Connection.displayName = "ConnectionsItem";
