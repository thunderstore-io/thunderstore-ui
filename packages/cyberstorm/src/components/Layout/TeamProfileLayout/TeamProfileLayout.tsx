import styles from "./TeamProfileLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { TeamLink } from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";

interface Props {
  teamName: string;
}

/**
 * Team's public profile view.
 */
export function TeamProfileLayout(props: Props) {
  const { teamName } = props;

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <TeamLink team={teamName}>{teamName}</TeamLink>
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          Mods uploaded by <TeamLink team={teamName}>{teamName}</TeamLink>
        </div>
      }
      mainContent={<PackageSearchLayout teamId={teamName} />}
    />
  );
}

TeamProfileLayout.displayName = "TeamProfileLayout";
