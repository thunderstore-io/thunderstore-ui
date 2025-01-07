import { Avatar, Heading, NewIcon, NewLink } from "@thunderstore/cyberstorm";
import { faCaretRight, faCrown } from "@fortawesome/free-solid-svg-icons";
import "../../packageListing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./TeamMembers.module.css";
import { PackageListingDetails, TeamMember } from "@thunderstore/dapper/types";

export default function TeamMembers(props: { listing: PackageListingDetails }) {
  const mappedPackageTeamList = props.listing.team.members
    .sort(compare)
    .map((teamMember, index) => {
      return <PackageTeamListItem key={index} teamMember={teamMember} />;
    });

  return (
    <div className="nimbus-packagelisting__sidebar__wrapper">
      <div className="nimbus-packagelisting__sidebar__wrapper__header">
        <Heading
          csLevel="4"
          csSize="4"
          className="nimbus-packagelisting__sidebar__wrapper__title"
        >
          Team
        </Heading>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Team"
          community={props.listing.community_identifier}
          team={props.listing.team.name}
          rootClasses={styles.teamLink}
        >
          See team
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faCaretRight} />
          </NewIcon>
        </NewLink>
      </div>
      <div className="nimbus-packagelisting__sidebar__wrapper__team_list">
        {mappedPackageTeamList}
      </div>
    </div>
  );
}

interface PackageTeamListItemProps {
  key: number;
  teamMember: TeamMember;
}

function PackageTeamListItem(props: PackageTeamListItemProps) {
  const { key, teamMember } = props;

  return (
    <NewLink
      key={key}
      primitiveType="cyberstormLink"
      linkId="User"
      user={teamMember.username}
      rootClasses={styles.item}
    >
      <Avatar username={teamMember.username} src={teamMember.avatar} />
      <div className={styles.itemTitleWrapper}>
        <div className={styles.itemTitle}>
          <span className={styles.itemTitleUsername}>
            {teamMember.username}
          </span>
          {teamMember.role === "owner" ? (
            <NewIcon csMode="inline" noWrapper rootClasses={styles.crown}>
              <FontAwesomeIcon icon={faCrown} />
            </NewIcon>
          ) : null}
        </div>
        <div className={styles.itemDescription}>{teamMember.role}</div>
      </div>
    </NewLink>
  );
}

function compare(a: TeamMember, b: TeamMember) {
  if (a.role === b.role) {
    return a.username.localeCompare(b.username);
  }

  return a.role === "owner" ? -1 : 1;
}
