import styles from "./PackageTeamMemberList.module.css";
import { TempTeamMember } from "@thunderstore/dapper/types";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight, faCrown } from "@fortawesome/pro-solid-svg-icons";
import { TeamLink, UserLink } from "../../../Links/Links";
import { Icon } from "../../../Icon/Icon";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

export interface PackageTeamListProps {
  teamMembers?: TempTeamMember[];
  teamName?: string;
}

export interface PackageTeamListItemProps {
  teamMember: TempTeamMember;
}

function PackageTeamListItem(props: PackageTeamListItemProps) {
  const { teamMember } = props;

  return (
    <UserLink user={teamMember.username}>
      <div className={styles.item}>
        <img
          src={teamMember.avatar ?? defaultImageSrc}
          className={styles.itemImage}
          alt={teamMember.username}
        />
        <div>
          <div className={styles.itemTitle}>
            {teamMember.username}
            {teamMember.role === "owner" ? (
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

function compare(a: TempTeamMember, b: TempTeamMember) {
  if (a.role === b.role) {
    return a.username.localeCompare(b.username);
  }

  return a.role === "owner" ? -1 : 1;
}

export function PackageTeamMemberList(props: PackageTeamListProps) {
  const { teamMembers = [], teamName = null } = props;

  const mappedPackageTeamList = teamMembers
    .sort(compare)
    .map((teamMember, index) => {
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
