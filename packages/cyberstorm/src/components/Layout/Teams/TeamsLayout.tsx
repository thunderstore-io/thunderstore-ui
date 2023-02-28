import React from "react";
import styles from "./TeamsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CommunityLink, CommunityPackagesLink } from "../../Links/Links";
import { Title } from "../../Title/Title";
import { TeamLeave } from "./TeamLeaveForm/TeamLeave";
import { TeamDisband } from "./TeamDisbandForm/TeamDisband";

export interface TeamsLayoutProps {
  teamName?: string;
}

/**
 * Cyberstorm Teams Layout
 */
export const TeamsLayout: React.FC<TeamsLayoutProps> = (props) => {
  const { teamName } = props;

  return (
    <div className={styles.root}>
      <BreadCrumbs>
        <CommunityLink community={"V-Rising"}>V Rising</CommunityLink>
        <CommunityPackagesLink community={"V-Rising"}>
          Packages
        </CommunityPackagesLink>
      </BreadCrumbs>

      <Title text={teamName} />

      <div>
        <div className={styles.tabContent}>
          <TeamLeave />
          <div className={styles.separator} />
          <TeamDisband teamName={teamName} />
        </div>
      </div>
    </div>
  );
};

TeamsLayout.displayName = "TeamsLayout";
TeamsLayout.defaultProps = { teamName: "" };
