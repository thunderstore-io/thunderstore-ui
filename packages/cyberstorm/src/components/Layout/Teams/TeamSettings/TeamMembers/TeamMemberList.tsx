import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TeamMember } from "@thunderstore/dapper/types";

import styles from "./TeamMembers.module.css";
import { Avatar } from "../../../../Avatar/Avatar";
import * as Button from "../../../../Button/";
import { Dialog } from "../../../../Dialog/Dialog";
import { UserLink } from "../../../../Links/Links";
import { Select } from "../../../../Select/Select";
import { Table, Sort } from "../../../../Table/Table";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

const teamMemberColumns = [
  { value: "User", disableSort: false },
  { value: "Role", disableSort: false },
  { value: "Actions", disableSort: true },
];

const userRoles = [
  { value: "member", label: "Member" },
  { value: "owner", label: "Owner" },
];

interface Props {
  members: TeamMember[];
}

export function TeamMemberList(props: Props) {
  const { members } = props;

  const tableData = members.map((member, index) => [
    {
      value: (
        <UserLink key={`user_${index}`} user={member.username}>
          <div className={styles.userInfo}>
            <Avatar src={member.avatar ?? defaultImageSrc} />
            <span className={styles.userInfoName}>{member.username}</span>
          </div>
        </UserLink>
      ),
      sortValue: member.username,
    },
    {
      value: (
        <div key={`role_${index}`} className={styles.roleSelect}>
          <Select
            triggerFontSize="medium"
            options={userRoles}
            value={member.role}
          />
        </div>
      ),
      sortValue: member.role,
    },
    {
      value: (
        <Dialog
          key={`action_${index}`}
          trigger={
            <Button.Root colorScheme="danger" paddingSize="large">
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faTrash} />
              </Button.ButtonIcon>
              <Button.ButtonLabel>Kick</Button.ButtonLabel>
            </Button.Root>
          }
          content={
            <div>
              You are about to kick member{" "}
              <UserLink user={member.username}>
                <span className={styles.kickDescriptionUserName}>
                  {member.username}
                </span>
                .
              </UserLink>
            </div>
          }
          acceptButton={
            <Button.Root colorScheme="danger" paddingSize="large">
              <Button.ButtonLabel>Kick member</Button.ButtonLabel>
            </Button.Root>
          }
          cancelButton="default"
          showFooterBorder
          title="Confirm member removal"
        />
      ),
      sortValue: 0,
    },
  ]);

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
