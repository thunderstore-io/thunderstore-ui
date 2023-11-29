import { faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TeamMember } from "@thunderstore/dapper/types";

import styles from "./TeamMembers.module.css";
import { Avatar } from "../../../../Avatar/Avatar";
import * as Button from "../../../../Button/";
import { Dialog } from "../../../../../index";
import { UserLink } from "../../../../Links/Links";
import { Select } from "../../../../Select/Select";
import { Table, Sort } from "../../../../Table/Table";
import { RemoveTeamMemberForm } from "@thunderstore/cyberstorm-forms";

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
  teamName: string;
}

export function TeamMemberList(props: Props) {
  const { members } = props;

  const tableData = members.map((member, index) => [
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
        <Dialog.Root
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
            teamName={props.teamName}
            userName={member.username}
          />
        </Dialog.Root>
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
