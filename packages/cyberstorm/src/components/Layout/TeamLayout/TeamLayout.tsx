import styles from "./TeamLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { TeamLink } from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

export interface TeamLayoutProps {
  teamId: string;
}

/**
 * Cyberstorm team's landing page Layout
 */
export function TeamLayout(props: TeamLayoutProps) {
  const { teamId } = props;

  const dapper = useDapper();
  const teamData = usePromise(dapper.getTeam, [teamId]);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <TeamLink team={teamData.name}>{teamData.name}</TeamLink>
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          Mods uploaded by{" "}
          <TeamLink team={teamData.name}>{teamData.name}</TeamLink>
        </div>
      }
      mainContent={<PackageSearchLayout teamId={teamData.name} />}
    />
  );
}

TeamLayout.displayName = "TeamLayout";
