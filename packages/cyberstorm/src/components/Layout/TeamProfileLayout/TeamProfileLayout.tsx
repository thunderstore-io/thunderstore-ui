import styles from "./TeamProfileLayout.module.css";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { TeamLink } from "../../Links/Links";
import { PackageSearch } from "../../PackageSearch/PackageSearch";

interface Props {
  teamName: string;
}

/**
 * Team's public profile view.
 *
 * TODO: use Dapper to fetch package categories.
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
      mainContent={<PackageSearch teamId={teamName} packageCategories={[]} />}
    />
  );
}

TeamProfileLayout.displayName = "TeamProfileLayout";
