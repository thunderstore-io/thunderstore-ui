import styles from "./PackageTeamMemberList.module.css";
import { TeamMember } from "@thunderstore/dapper/types";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight, faCrown } from "@fortawesome/pro-solid-svg-icons";
import { TeamLink, UserLink } from "../../../Links/Links";
import { Icon } from "../../../Icon/Icon";
import { classnames } from "../../../../utils/utils";

export interface PackageTeamListProps {
  community: string;
  teamMembers?: TeamMember[];
  teamName?: string;
}

export interface PackageTeamListItemProps {
  teamMember: TeamMember;
}

function PackageTeamListItem(props: PackageTeamListItemProps) {
  const { teamMember } = props;

  return (
    <UserLink user={teamMember.username}>
      <div className={styles.item}>
        {teamMember.avatar ? (
          <img
            src={teamMember.avatar}
            className={styles.itemImage}
            alt={teamMember.username}
          />
        ) : (
          <div className={classnames(styles.itemImage, styles.placeholder)}>
            {teamMember.username.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className={styles.itemTitle}>
            {teamMember.username}
            {teamMember.role === "owner" ? (
              <Icon inline wrapperClasses={styles.crown}>
                <FontAwesomeIcon icon={faCrown} />
              </Icon>
            ) : null}
          </div>
          <div className={styles.itemDescription}>{teamMember.role}</div>
        </div>
      </div>
    </UserLink>
  );
}

function compare(a: TeamMember, b: TeamMember) {
  if (a.role === b.role) {
    return a.username.localeCompare(b.username);
  }

  return a.role === "owner" ? -1 : 1;
}

export function PackageTeamMemberList(props: PackageTeamListProps) {
  const { community, teamMembers = [], teamName = null } = props;

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
        headerIcon={<FontAwesomeIcon icon={faUsers} />}
        headerRightContent={
          teamName ? (
            <TeamLink community={community} team={teamName}>
              <div className={styles.teamLink}>
                See team
                <Icon inline wrapperClasses={styles.teamLinkIcon}>
                  <FontAwesomeIcon icon={faCaretRight} />
                </Icon>
              </div>
            </TeamLink>
          ) : null
        }
      />
    </>
  );
}

PackageTeamMemberList.displayName = "PackageTeamMemberList";
