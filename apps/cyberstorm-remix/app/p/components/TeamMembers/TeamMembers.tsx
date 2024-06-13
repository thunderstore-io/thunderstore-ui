import { Avatar, Icon, CyberstormLink } from "@thunderstore/cyberstorm";
import {
  faUsers,
  faCaretRight,
  faCrown,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./TeamMembers.module.css";
import { WrapperCard } from "@thunderstore/cyberstorm/src/components/WrapperCard/WrapperCard";
import { PackageListingDetails, TeamMember } from "@thunderstore/dapper/types";

export default function TeamMembers(props: { listing: PackageListingDetails }) {
  const mappedPackageTeamList = props.listing.team.members
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
          props.listing.team ? (
            <CyberstormLink
              linkId="Team"
              community={props.listing.community_identifier}
              team={props.listing.team.name}
            >
              <div className={styles.teamLink}>
                See team
                <Icon inline wrapperClasses={styles.teamLinkIcon}>
                  <FontAwesomeIcon icon={faCaretRight} />
                </Icon>
              </div>
            </CyberstormLink>
          ) : null
        }
      />
    </>
  );
}

interface PackageTeamListItemProps {
  teamMember: TeamMember;
}

function PackageTeamListItem(props: PackageTeamListItemProps) {
  const { teamMember } = props;

  return (
    <CyberstormLink linkId="User" user={teamMember.username}>
      <div className={styles.item}>
        <Avatar username={teamMember.username} src={teamMember.avatar} />
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
    </CyberstormLink>
  );
}

function compare(a: TeamMember, b: TeamMember) {
  if (a.role === b.role) {
    return a.username.localeCompare(b.username);
  }

  return a.role === "owner" ? -1 : 1;
}
