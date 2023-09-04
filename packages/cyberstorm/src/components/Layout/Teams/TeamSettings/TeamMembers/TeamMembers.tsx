import styles from "./TeamMembers.module.css";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import { Button } from "../../../../Button/Button";
import { Dialog } from "../../../../Dialog/Dialog";
import { TextInput } from "../../../../TextInput/TextInput";
import { Select } from "../../../../Select/Select";
import { Team, TeamMember } from "@thunderstore/dapper/types";
import { TeamLink, UserLink } from "../../../../Links/Links";
import { Avatar } from "../../../../Avatar/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";
import {
  DataTable,
  DataTableRows,
  Sort,
} from "../../../../DataTable/DataTable";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

export interface TeamMembersProps {
  teamData: Team;
}

export interface TeamMemberListProps {
  teamMemberData?: TeamMember[];
}

export function TeamMemberList(props: TeamMemberListProps) {
  const { teamMemberData = [] } = props;

  const tableData: DataTableRows = [];
  teamMemberData?.forEach((teamMember: TeamMember, index) => {
    tableData.push([
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
              <Button
                label="Kick"
                leftIcon={<FontAwesomeIcon icon={faTrash} fixedWidth />}
                colorScheme="danger"
                paddingSize="large"
              />
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
              <Button
                colorScheme="danger"
                paddingSize="large"
                label="Kick member"
              />
            }
            cancelButton="default"
            showFooterBorder
            title="Confirm member removal"
          />
        ),
        sortValue: 0,
      },
    ]);
  });

  return (
    <DataTable
      headers={teamMemberColumns}
      rows={tableData}
      sortByHeader={1}
      sortDirection={Sort.ASC}
    />
  );
}

export function TeamMembers(props: TeamMembersProps) {
  const { teamData } = props;

  const dialog = (
    <Dialog
      title="Add Member"
      trigger={
        <Button
          label="Add Member"
          colorScheme="primary"
          paddingSize="large"
          rightIcon={<FontAwesomeIcon icon={faPlus} fixedWidth />}
        />
      }
      showFooterBorder
      cancelButton="default"
      content={
        <div className={styles.dialogContent}>
          <p className={styles.description}>
            Enter the username of the user you wish to add to the team{" "}
            <TeamLink team={teamData.name}>
              <span className={styles.dialogTeamName}>{teamData.name}</span>
            </TeamLink>
          </p>
          <div
            style={{ alignItems: "flex-end" }}
            className={styles.dialogInput}
          >
            <div className={styles.textInput}>
              <TextInput placeHolder="Username" />
            </div>
            <Select options={userRoles} value={"Member"} />
          </div>
        </div>
      }
      acceptButton={<Button label="Add Member" colorScheme="success" />}
    />
  );

  return (
    <div>
      <SettingItem
        title="Members"
        description="Your best buddies"
        additionalLeftColumnContent={<div>{dialog}</div>}
        content={<TeamMemberList teamMemberData={teamData.members} />}
      />
    </div>
  );
}

TeamMemberList.displayName = "TeamMemberList";
TeamMembers.displayName = "TeamMembers";

const teamMemberColumns = [
  { value: "User", disableSort: false },
  { value: "Role", disableSort: false },
  { value: "Actions", disableSort: true },
];

const userRoles = [
  { value: "Member", label: "Member" },
  { value: "Owner", label: "Owner" },
];
