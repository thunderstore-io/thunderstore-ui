import styles from "./PackageTeamMemberList.module.css";
import { TeamMember } from "@thunderstore/dapper/types";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight, faCrown } from "@fortawesome/pro-solid-svg-icons";
import { TeamLink, UserLink } from "../../../Links/Links";
import { Icon } from "../../../Icon/Icon";

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
                <Icon>
                  <FontAwesomeIcon icon={faCrown} />
                </Icon>
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
    if (a.role === "Owner" && b.role === "Owner") {
      if (a.user < b.user) {
        if (a.user > b.user) {
          return 1;
        }
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
        headerIcon={
          <Icon>
            <FontAwesomeIcon icon={faUsers} />
          </Icon>
        }
        headerRightContent={
          teamName ? (
            <TeamLink team={teamName}>
              <div className={styles.teamLink}>
                See team
                <div className={styles.teamLinkIcon}>
                  <Icon>
                    <FontAwesomeIcon icon={faCaretRight} />
                  </Icon>
                </div>
              </div>
            </TeamLink>
          ) : null
        }
      />
    </>
  );
}

PackageTeamMemberList.displayName = "PackageTeamMemberList";
