import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TeamMember } from "@thunderstore/dapper/types";

import styles from "./TeamMembers.module.css";
import { Avatar } from "../../../../Avatar/Avatar";
import * as Button from "../../../../Button/";
import { Dialog } from "../../../../Dialog/Dialog";
import { Icon } from "../../../../Icon/Icon";
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
  { value: "Member", label: "Member" },
  { value: "Owner", label: "Owner" },
];

interface Props {
  teamMemberData?: TeamMember[];
}

export function TeamMemberList(props: Props) {
  const { teamMemberData = [] } = props;

  const tableData = teamMemberData.map((teamMember, index) => [
    {
      value: (
        <UserLink key={`user_${index}`} user={teamMember.user}>
          <div className={styles.userInfo}>
            <Avatar
              src={
                teamMember.imageSource
                  ? teamMember.imageSource
                  : defaultImageSrc
              }
            />
            <span className={styles.userInfoName}>{teamMember.user}</span>
          </div>
        </UserLink>
      ),
      sortValue: teamMember.user,
    },
    {
      value: (
        <div key={`role_${index}`} className={styles.roleSelect}>
          <Select
            triggerFontSize="medium"
            options={userRoles}
            value={teamMember.role}
          />
        </div>
      ),
      sortValue: teamMember.role,
    },
    {
      value: (
        <Dialog
          key={`action_${index}`}
          trigger={
            <Button.Root colorScheme="danger" paddingSize="large">
              <Button.ButtonIcon>
                <Icon>
                  <FontAwesomeIcon icon={faTrash} />
                </Icon>
              </Button.ButtonIcon>
              <Button.ButtonLabel>Kick</Button.ButtonLabel>
            </Button.Root>
          }
          content={
            <div>
              You are about to kick member{" "}
              <UserLink user={teamMember.user}>
                <span className={styles.kickDescriptionUserName}>
                  {teamMember.user}
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
    />
  );
}

TeamMemberList.displayName = "TeamMemberList";
