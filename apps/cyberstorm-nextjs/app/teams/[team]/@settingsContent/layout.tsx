"use client";
import styles from "./SettingsContent.module.css";
import React, { ReactNode } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Icon } from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUsers,
  faUserCog,
  faCog,
} from "@fortawesome/pro-regular-svg-icons";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

export default function TeamsLayout(props: {
  children: ReactNode;
  params: { team: string };
}) {
  const selectedTab = useSelectedLayoutSegment();
  return (
    <>
      <nav className={styles.root}>
        <Link
          href={`/teams/${props.params.team}/profile`}
          className={classnames(
            styles.tab,
            selectedTab === "profile" ? styles.tab_selected : undefined
          )}
        >
          <Icon inline wrapperClasses={styles.icon}>
            <FontAwesomeIcon icon={faEdit} />
          </Icon>
          Profile
        </Link>
        <Link
          href={`/teams/${props.params.team}/members`}
          className={classnames(
            styles.tab,
            selectedTab === "members" ? styles.tab_selected : undefined
          )}
        >
          <Icon inline wrapperClasses={styles.icon}>
            <FontAwesomeIcon icon={faUsers} />
          </Icon>
          Members
        </Link>
        <Link
          href={`/teams/${props.params.team}/service-accounts`}
          className={classnames(
            styles.tab,
            selectedTab === "service-accounts" ? styles.tab_selected : undefined
          )}
        >
          <Icon inline wrapperClasses={styles.icon}>
            <FontAwesomeIcon icon={faUserCog} />
          </Icon>
          Service Accounts
        </Link>
        <Link
          href={`/teams/${props.params.team}/settings`}
          className={classnames(
            styles.tab,
            selectedTab === "settings" ? styles.tab_selected : undefined
          )}
        >
          <Icon inline wrapperClasses={styles.icon}>
            <FontAwesomeIcon icon={faCog} />
          </Icon>
          Settings
        </Link>
      </nav>
      {props.children}
    </>
  );
}
