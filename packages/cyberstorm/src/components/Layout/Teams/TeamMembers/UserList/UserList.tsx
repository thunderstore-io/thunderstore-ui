import React from "react";
import styles from "./UserList.module.css";
import { UserListItem } from "./UserListItem";

export interface UserDataItem {
  userName: string;
  role: "1" | "2";
  userImageSrc?: string;
}

export interface UserListProps {
  userData?: Array<UserDataItem>;
}

export const UserList: React.FC<UserListProps> = (props) => {
  const { userData } = props;

  const mappedUserList = userData?.map((user: UserDataItem, index: number) => {
    return (
      <div key={index}>
        <UserListItem
          userName={user.userName}
          userImageSrc={user.userImageSrc}
          role={user.role}
        />
      </div>
    );
  });

  return <div className={styles.root}>{mappedUserList}</div>;
};

UserList.displayName = "UserList";
UserList.defaultProps = { userData: [] };
