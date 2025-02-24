import { Avatar, Heading, NewIcon, NewLink } from "@thunderstore/cyberstorm";
import { faCaretRight, faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./TeamMembers.css";
import { PackageListingDetails, TeamMember } from "@thunderstore/dapper/types";

export default function TeamMembers(props: {
  listing: PackageListingDetails;
  domain: string;
}) {
  const mappedPackageTeamList = props.listing.team.members
    .sort(compare)
    .map((teamMember, index) => {
      return <PackageTeamListItem key={index} teamMember={teamMember} />;
    });

  return (
    <div className="team-members">
      <div className="team-members__header">
        <Heading csLevel="4" csSize="4" rootClasses="team-members__title">
          Team
        </Heading>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Team"
          community={props.listing.community_identifier}
          team={props.listing.team.name}
          csVariant="cyber"
          rootClasses="team-members__link"
        >
          See team
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faCaretRight} />
          </NewIcon>
        </NewLink>
      </div>
      <div className="team-members__body">{mappedPackageTeamList}</div>
    </div>
  );
}

interface PackageTeamListItemProps {
  key: number;
  teamMember: TeamMember;
}

function PackageTeamListItem(props: PackageTeamListItemProps) {
  const { teamMember } = props;

  return (
    <div className="package-team-list-item">
      <Avatar username={teamMember.username} src={teamMember.avatar} />
      <div className="package-team-list-item__wrapper">
        <div className="package-team-list-item__title">
          <span className="package-team-list-item__username">
            {teamMember.username}
          </span>
          {teamMember.role === "owner" ? (
            <NewIcon
              csMode="inline"
              noWrapper
              rootClasses="package-team-list-item__crown"
            >
              <FontAwesomeIcon icon={faCrown} />
            </NewIcon>
          ) : null}
        </div>
        <div className="package-team-list-item__description">
          {teamMember.role}
        </div>
      </div>
    </div>
  );

  // TODO: Enable when user page is available
  // return (
  //   <NewLink
  //     primitiveType="cyberstormLink"
  //     linkId="User"
  //     user={teamMember.username}
  //     rootClasses={styles.item}
  //   >
  //     <Avatar username={teamMember.username} src={teamMember.avatar} />
  //     <div className={styles.itemTitleWrapper}>
  //       <div className={styles.itemTitle}>
  //         <span className={styles.itemTitleUsername}>
  //           {teamMember.username}
  //         </span>
  //         {teamMember.role === "owner" ? (
  //           <NewIcon csMode="inline" noWrapper rootClasses={styles.crown}>
  //             <FontAwesomeIcon icon={faCrown} />
  //           </NewIcon>
  //         ) : null}
  //       </div>
  //       <div className={styles.itemDescription}>{teamMember.role}</div>
  //     </div>
  //   </NewLink>
  // );
}

function compare(a: TeamMember, b: TeamMember) {
  if (a.role === b.role) {
    return a.username.localeCompare(b.username);
  }

  return a.role === "owner" ? -1 : 1;
}
