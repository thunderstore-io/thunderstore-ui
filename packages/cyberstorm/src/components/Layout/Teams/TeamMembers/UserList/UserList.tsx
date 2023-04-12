import React from "react";
import styles from "./UserList.module.css";
import { UserListItem } from "./UserListItem";
import { TeamMember, User } from "../../../../../schema";
import { getUserDummyData } from "../../../../../dummyData";

export interface UserListProps {
  teamMemberData?: TeamMember[];
}

export const UserList: React.FC<UserListProps> = (props) => {
  const { teamMemberData } = props;

  const mappedUserList = teamMemberData?.map(
    (teamMember: TeamMember, index: number) => {
      const user: User = getUserDummyData(teamMember.user);
      return (
        <div key={index}>
          <UserListItem
            userName={user.name}
            userImageSrc={user.imageSource}
            role={teamMember.role}
          />
        </div>
      );
    }
  );

  return <div className={styles.root}>{mappedUserList}</div>;
};

UserList.displayName = "UserList";
UserList.defaultProps = { teamMemberData: [] };
