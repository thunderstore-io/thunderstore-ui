import styles from "./PackageTeamMemberList.module.css";
import { TeamMember } from "../../../../schema";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight, faCrown } from "@fortawesome/pro-solid-svg-icons";
import { TeamLink, UserLink } from "../../../Links/Links";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

export interface PackageTeamListProps {
  teamMembers?: TeamMember[];
  teamName?: string;
}

export interface PackageTeamListItemProps {
  teamMember: TeamMember;
}

function PackageTeamListItem(props: PackageTeamListItemProps) {
  const { teamMember } = props;

  return (
    <UserLink user={teamMember.user}>
      <div className={styles.item}>
        <img
          src={
            teamMember.imageSource ? teamMember.imageSource : defaultImageSrc
          }
          className={styles.itemImage}
          alt={teamMember.user}
        />
        <div>
          <div className={styles.itemTitle}>
            {teamMember.user}
            {teamMember.role === "Owner" ? (
              <span className={styles.crown}>
                <FontAwesomeIcon icon={faCrown} fixedWidth />
              </span>
            ) : null}
          </div>
          <div className={styles.itemDescription}>{teamMember.role}</div>
        </div>
      </div>
    </UserLink>
  );
}

function compare(a: TeamMember, b: TeamMember) {
  if (a.role === "Owner" || b.role === "Owner") {
    console.log(a, b);
    if (a.role === "Owner" && b.role === "Owner") {
      if (a.user > b.user) {
        return 1;
      }
      if (a.user < b.user) {
        return -1;
      }
      return 0;
    }
    if (a.role === "Owner") {
      return -1;
    }
    return 1;
  }
  if (a.user > b.user) {
    return 1;
  }
  if (a.user < b.user) {
    return -1;
  }
  return 0;
}

export function PackageTeamMemberList(props: PackageTeamListProps) {
  const { teamMembers = [], teamName = null } = props;

  const mappedPackageTeamList = teamMembers
    ?.sort(compare)
    .map((teamMember: TeamMember, index: number) => {
      return (
        <div key={index}>
          <PackageTeamListItem teamMember={teamMember} />
        </div>
      );
    });

  return (
    <>
      <WrapperCard
        title="Team"
        content={<div className={styles.list}>{mappedPackageTeamList}</div>}
        headerIcon={<FontAwesomeIcon icon={faUsers} fixedWidth />}
        headerRightContent={
          teamName ? (
            <TeamLink team={teamName}>
              <div className={styles.teamLink}>
                <div>See team</div>
                <FontAwesomeIcon icon={faCaretRight} fixedWidth />
              </div>
            </TeamLink>
          ) : null
        }
      />
    </>
  );
}

PackageTeamMemberList.displayName = "PackageTeamMemberList";
