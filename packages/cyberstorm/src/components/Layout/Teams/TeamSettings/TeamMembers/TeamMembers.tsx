import styles from "./TeamMembers.module.css";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import { Button } from "../../../../Button/Button";
import { Dialog } from "../../../../Dialog/Dialog";
import { TextInput } from "../../../../TextInput/TextInput";
import { Select } from "../../../../Select/Select";
import { Team, TeamMember } from "../../../../../schema";
import { TeamLink, UserLink } from "../../../../Links/Links";
import { Avatar } from "../../../../Avatar/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { DataTable } from "../../../../DataTable/DataTable";
import { ReactElement } from "react";
import { TableColumn } from "react-data-table-component";

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

  const tableData: TeamMemberData[] = [];
  teamMemberData?.forEach((teamMember: TeamMember) => {
    tableData.push({
      name: (
        <UserLink user={teamMember.user}>
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
      nameRaw: teamMember.user,
      role: (
        <div className={styles.roleSelect}>
          <Select
            triggerFontSize="medium"
            options={userRoles}
            value={teamMember.role}
            onChange={() => console.log("asd")}
          />
        </div>
      ),
      roleRaw: teamMember.role,
      actions: (
        <Dialog
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
    });
  });

  return (
    <DataTable<TeamMemberData> columns={teamMemberColumns} data={tableData} />
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

type TeamMemberData = {
  name: ReactElement;
  nameRaw: string;
  role: ReactElement;
  roleRaw: string;
  actions: ReactElement;
};

const teamMemberColumns: TableColumn<TeamMemberData>[] = [
  {
    name: "User",
    style: {
      color: "var(--color-text--default)",
      fontWeight: 700,
    },
    sortable: true,
    cell: (row) => row.name,
    selector: (row) => row.nameRaw,
  },
  {
    name: "Role",
    right: true,
    sortable: true,
    cell: (row) => row.role,
    selector: (row) => row.roleRaw,
  },
  {
    name: "Actions",
    right: true,
    cell: (row) => row.actions,
  },
];

const userRoles = [
  { value: "Member", label: "Member" },
  { value: "Owner", label: "Owner" },
];
