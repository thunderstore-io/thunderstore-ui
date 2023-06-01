import styles from "./UserListItem.module.css";
import { useState } from "react";
import { Avatar } from "../../../../../Avatar/Avatar";
import { Select } from "../../../../../Select/Select";
import { Button } from "../../../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface UserListItemProps {
  userName: string;
  userImageSrc: string;
  role?: string;
}

export function UserListItem(props: UserListItemProps) {
  const { userName = "", userImageSrc = "", role = "1" } = props;

  const [userRole, setUserRole] = useState(role);

  return (
    <div className={styles.root}>
      <div className={styles.basicInfo}>
        <Avatar src={userImageSrc} />
        <div className={styles.userName}>{userName}</div>
      </div>
      <div className={styles.role}>
        <Select options={userRoles} value={userRole} onChange={setUserRole} />
      </div>
      <div className={styles.actions}>
        <Button
          colorScheme="danger"
          label="Kick"
          leftIcon={<FontAwesomeIcon icon={faTrash} fixedWidth />}
        />
      </div>
    </div>
  );
}

UserListItem.displayName = "UserListItem";

const userRoles = [
  { value: "1", label: "Member" },
  { value: "2", label: "Owner" },
];
