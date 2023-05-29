import styles from "./TeamMembers.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { UserList } from "./UserList/UserList";
import { Button } from "../../../Button/Button";
import { Dialog } from "../../../Dialog/Dialog";
import { TextInput } from "../../../TextInput/TextInput";
import { Select } from "../../../Select/Select";
import { Team } from "../../../../schema";

export interface TeamMembersProps {
  teamData: Team;
}

export function TeamMembers(props: TeamMembersProps) {
  const { teamData } = props;

  const dialog = (
    <Dialog
      title="Add Member"
      trigger={<Button label="Add Member" />}
      content={
        <div className={styles.dialogContent}>
          <p>
            Enter the username of the user you wish to add to the team{" "}
            <strong className={styles.dialogTeamName}>{teamData.name}</strong>
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
        content={<UserList teamMemberData={teamData.members} />}
      />
    </div>
  );
}

TeamMembers.displayName = "TeamMembers";

const userRoles = [
  { value: "1", label: "Member" },
  { value: "2", label: "Owner" },
];
