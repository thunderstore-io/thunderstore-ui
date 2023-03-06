import React from "react";
import styles from "./TeamMembers.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { UserDataItem, UserList } from "./UserList/UserList";
import { Button } from "../../../Button/Button";
import { Dialog } from "../../../Dialog/Dialog";
import { TextInput } from "../../../TextInput/TextInput";
import { Select } from "../../../Select/Select";

export interface TeamMembersProps {
  teamName?: string;
  userData?: Array<UserDataItem>;
}

export const TeamMembers: React.FC<TeamMembersProps> = (props) => {
  const { userData, teamName } = props;

  const dialog = (
    <Dialog
      title="Add Member"
      trigger={<Button label="Add Member" />}
      content={
        <div className={styles.dialogContent}>
          <p>
            Enter the username of the user you wish to add to the team{" "}
            <strong className={styles.dialogTeamName}>{teamName}</strong>
          </p>
          <div className={styles.dialogInput}>
            <div className={styles.textInput}>
              <TextInput placeHolder="Username" />
            </div>
            <Select options={userRoles} value={"1"} />
          </div>
        </div>
      }
      acceptButton={<Button colorScheme="primary" label="Add Member" />}
    />
  );

  return (
    <div>
      <SettingItem
        title="Members"
        description="Your best buddies"
        additionalLeftColumnContent={<div>{dialog}</div>}
        content={<UserList userData={userData} />}
      />
    </div>
  );
};

TeamMembers.displayName = "TeamMembers";
TeamMembers.defaultProps = { userData: [], teamName: "" };

const userRoles = [
  { value: "1", label: "Member" },
  { value: "2", label: "Owner" },
];
