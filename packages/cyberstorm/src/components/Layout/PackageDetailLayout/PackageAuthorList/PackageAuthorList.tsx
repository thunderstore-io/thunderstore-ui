import styles from "./PackageAuthorList.module.css";
import { TeamMember } from "../../../../schema";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/pro-light-svg-icons";
import { faCaretRight } from "@fortawesome/pro-solid-svg-icons";
import { TeamLink, UserLink } from "../../../Links/Links";
import { Link } from "../../../Link/Link";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

export interface PackageAuthorListProps {
  teamMembers?: TeamMember[];
  teamName?: string;
}

export interface PackageAuthorListItemProps {
  teamMember: TeamMember;
}

function PackageAuthorListItem(props: PackageAuthorListItemProps) {
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
          <div className={styles.itemTitle}>{teamMember.user}</div>
          <div className={styles.itemDescription}>{teamMember.role}</div>
        </div>
      </div>
    </UserLink>
  );
}

export function PackageAuthorList(props: PackageAuthorListProps) {
  const { teamMembers = [], teamName = null } = props;

  const mappedPackageAuthorList = teamMembers?.map(
    (teamMember: TeamMember, index: number) => {
      return (
        <div key={index}>
          <PackageAuthorListItem teamMember={teamMember} />
        </div>
      );
    }
  );

  return (
    <>
      <WrapperCard
        title="Authors"
        content={
          <div className={styles.list}>
            {teamName ? (
              <div className={styles.listHeader}>{teamName}</div>
            ) : null}
            {mappedPackageAuthorList}
          </div>
        }
        headerIcon={<FontAwesomeIcon icon={faUserGroup} fixedWidth />}
        headerRightContent={
          teamName ? (
            <TeamLink team={teamName}>
              <Link
                label="See team"
                rightIcon={<FontAwesomeIcon icon={faCaretRight} fixedWidth />}
              />
            </TeamLink>
          ) : null
        }
      />
    </>
  );
}

PackageAuthorList.displayName = "PackageAuthorList";
