"use client";

import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OAuthConnection } from "@thunderstore/dapper/types";

import styles from "./Connections.module.css";
import { SettingItem, Switch } from "@thunderstore/cyberstorm";
import { Icon } from "@thunderstore/cyberstorm/src/components/Icon/Icon";
import { CyberstormLink } from "@thunderstore/cyberstorm/src/components/Links/Links";
import { OverwolfLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { currentUserSchema } from "@thunderstore/dapper-ts";
import { useLoaderData } from "@remix-run/react";

const PROVIDERS = [
  { name: "Discord", icon: <FontAwesomeIcon icon={faDiscord} /> },
  { name: "GitHub", icon: <FontAwesomeIcon icon={faGithub} /> },
  { name: "Overwolf", icon: OverwolfLogo() },
];

export async function loader() {
  const dapper = await getDapper();
  const currentUser = await dapper.getCurrentUser();
  return {
    currentUser: currentUser as typeof currentUserSchema._type,
  };
}

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader() {
  const dapper = await getDapper(true);
  const currentUser = await dapper.getCurrentUser();
  if (!currentUser.username) {
    throw new Response("Not logged in.", { status: 401 });
  }
  return {
    currentUser: currentUser as typeof currentUserSchema._type,
  };
}

clientLoader.hydrate = true;

export default function Connections() {
  const { currentUser } = useLoaderData<typeof loader | typeof clientLoader>();

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
                <CyberstormLink linkId="PrivacyPolicy">
                  Privacy Policy
                </CyberstormLink>
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
                  connection={currentUser.connections?.find(
                    (c) => c.provider.toLowerCase() === p.name.toLowerCase()
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
      className={classnames(
        styles.itemWrapper,
        connection ? styles.enabled : styles.disabled
      )}
    >
      <div className={styles.item}>
        <div className={styles.connectionTypeInfo}>
          <Icon wrapperClasses={styles.connectionTypeInfoIcon}>
            {provider.icon}
          </Icon>
          <div className={styles.connectionTypeInfoName}>{provider.name}</div>
        </div>
        <div className={styles.rightSection}>
          {connection ? (
            <div className={styles.connectedAs}>
              <div className={styles.connectedAsDescription}>Connected as</div>
              <div className={styles.connectedAsUsername}>
                {connection.username}
              </div>
            </div>
          ) : null}
          <Switch value={connection !== undefined} />
        </div>
      </div>
    </div>
  );
}

Connection.displayName = "ConnectionsItem";
