import React from "react";
import styles from "./TeamMembers.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { UserList } from "./UserList/UserList";
import { Button } from "../../../Button/Button";
import { Dialog } from "../../../Dialog/Dialog";
import { TextInput } from "../../../TextInput/TextInput";
import { Select } from "../../../Select/Select";
import { getTeamMemberDummyData } from "../../../../dummyData";
import { TeamMember } from "../../../../schema";

export interface TeamMembersProps {
  teamName?: string;
  membersData: string[];
}

export const TeamMembers: React.FC<TeamMembersProps> = (props) => {
  const { membersData, teamName } = props;

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
        content={
          <UserList teamMemberData={getTeamMemberListData(membersData)} />
        }
      />
    </div>
  );
};

TeamMembers.displayName = "TeamMembers";
TeamMembers.defaultProps = { membersData: [], teamName: "" };

const userRoles = [
  { value: "1", label: "Member" },
  { value: "2", label: "Owner" },
];

function getTeamMemberListData(teamMemberIds: string[]): TeamMember[] {
  const teamMemberArray: TeamMember[] = [];
  teamMemberIds.forEach((teamMemberId) => {
    teamMemberArray.push(getTeamMemberDummyData(teamMemberId));
  });
  return teamMemberArray;
}
