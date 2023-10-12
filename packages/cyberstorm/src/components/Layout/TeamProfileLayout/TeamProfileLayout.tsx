import styles from "./TeamProfileLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { TeamLink } from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

interface Props {
  teamId: string;
}

/**
 * Team's public profile view.
 */
export function TeamProfileLayout(props: Props) {
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

TeamProfileLayout.displayName = "TeamProfileLayout";
