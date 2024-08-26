"use client";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TeamMember } from "@thunderstore/dapper/types";

import styles from "./TeamMembers.module.css";
import {
  RemoveTeamMemberForm,
  TeamMemberChangeRoleAction,
} from "@thunderstore/cyberstorm-forms";
import { useState } from "react";
import {
  CyberstormLink,
  Dialog,
  Button,
  Avatar,
  Sort,
  Table,
} from "@thunderstore/cyberstorm";
import { useRevalidator } from "@remix-run/react";

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

  const revalidator = useRevalidator();

  // REMIX TODO: Move current user to stand-alone loader and revalidate only currentUser
  async function teamMemberRevalidate() {
    revalidator.revalidate();
  }

  const tableData = members.map((member, index) => {
    return [
      {
        value: (
          <CyberstormLink
            linkId="User"
            key={`user_${index}`}
            user={member.username}
          >
            <div className={styles.userInfo}>
              <Avatar
                src={member.avatar}
                username={member.username}
                size="small"
              />
              <span className={styles.userInfoName}>{member.username}</span>
            </div>
          </CyberstormLink>
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
              updateTrigger={teamMemberRevalidate}
            />
          </div>
        ),
        sortValue: member.role,
      },
      {
        value: (
          <Dialog.Root
            key={`action_${index}`}
            title="Confirm member removal"
            trigger={
              <Button.Root
                colorScheme="danger"
                paddingSize="large"
                key={`action_button_${index}`}
              >
                <Button.ButtonIcon>
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button.ButtonIcon>
                <Button.ButtonLabel>Kick</Button.ButtonLabel>
              </Button.Root>
            }
          >
            <RemoveTeamMemberForm
              teamName={props.teamName}
              userName={member.username}
              updateTrigger={teamMemberRevalidate}
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
