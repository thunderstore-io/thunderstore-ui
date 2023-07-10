"use client";
import styles from "./TeamLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { TeamLink } from "../../Links/Links";
import { getTeamDummyData } from "../../../dummyData";
import { Team } from "../../../schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";

export interface TeamLayoutProps {
  teamId: string;
}

/**
 * Cyberstorm team's landing page Layout
 */
export function TeamLayout(props: TeamLayoutProps) {
  const { teamId } = props;

  const teamData: Team = getTeamData(teamId);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <TeamLink team={teamData.name}>{teamData.name}</TeamLink>
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          {"Mods uploaded by " + teamData.name}
        </div>
      }
      mainContent={<PackageSearchLayout teamId={teamData.name} />}
    />
  );
}

TeamLayout.displayName = "TeamLayout";

function getTeamData(teamId: string) {
  return getTeamDummyData(teamId);
}
