"use client";
import { faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TeamMember } from "@thunderstore/dapper/types";

import styles from "./TeamMembers.module.css";
import {
  RemoveTeamMemberForm,
  TeamMemberChangeRoleAction,
} from "@thunderstore/cyberstorm-forms";
import { useState } from "react";
import {
  UserLink,
  Dialog,
  Button,
  Avatar,
  Sort,
  Table,
} from "@thunderstore/cyberstorm";

const teamMemberColumns = [
  { value: "User", disableSort: false },
  { value: "Role", disableSort: false },
  { value: "Actions", disableSort: true },
];

interface Props {
  members: TeamMember[];
  teamName: string;
}

export function TeamMemberList(props: Props) {
  const { members } = props;

  const [dialogOpen, setOpenDialog] = useState(false);
  const tableData = members.map((member, index) => {
    return [
      {
        value: (
          <UserLink key={`user_${index}`} user={member.username}>
            <div className={styles.userInfo}>
              <Avatar
                src={member.avatar}
                username={member.username}
                size="small"
              />
              <span className={styles.userInfoName}>{member.username}</span>
            </div>
          </UserLink>
        ),
        sortValue: member.username,
      },
      {
        value: (
          <div key={`role_${index}`} className={styles.roleSelect}>
            <TeamMemberChangeRoleAction
              teamName={props.teamName}
              userName={member.username}
              currentRole={member.role}
            />
          </div>
        ),
        sortValue: member.role,
      },
      {
        value: (
          <Dialog.Root
            open={dialogOpen}
            onOpenChange={setOpenDialog}
            key={`action_${index}`}
            title="Confirm member removal"
            trigger={
              <Button.Root colorScheme="danger" paddingSize="large">
                <Button.ButtonIcon>
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button.ButtonIcon>
                <Button.ButtonLabel>Kick</Button.ButtonLabel>
              </Button.Root>
            }
          >
            <RemoveTeamMemberForm
              dialogOnChange={setOpenDialog}
              teamName={props.teamName}
              userName={member.username}
            />
          </Dialog.Root>
        ),
        sortValue: 0,
      },
    ];
  });

  return (
    <Table
      headers={teamMemberColumns}
      rows={tableData}
      sortByHeader={1}
      sortDirection={Sort.ASC}
      variant="itemList"
    />
  );
}

TeamMemberList.displayName = "TeamMemberList";
