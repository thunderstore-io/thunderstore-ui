import styles from "./TeamMembers.module.css";
import { TeamMemberList } from "./TeamMemberList";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import * as Button from "../../../../Button/";
import { Dialog } from "../../../../Dialog/Dialog";
import { TextInput } from "../../../../TextInput/TextInput";
import { Select } from "../../../../Select/Select";
import { Team } from "@thunderstore/dapper/types";
import { TeamLink } from "../../../../Links/Links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { Icon } from "../../../../Icon/Icon";

const userRoles = [
  { value: "Member", label: "Member" },
  { value: "Owner", label: "Owner" },
];

interface Props {
  teamData: Team;
}

export function TeamMembers(props: Props) {
  const { teamData } = props;

  const dialog = (
    <Dialog
      title="Add Member"
      trigger={
        <Button.Root colorScheme="primary" paddingSize="large">
          <Button.ButtonLabel>Add Member</Button.ButtonLabel>
          <Button.ButtonIcon>
            <Icon>
              <FontAwesomeIcon icon={faPlus} />
            </Icon>
          </Button.ButtonIcon>
        </Button.Root>
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
          <div className={styles.dialogInput}>
            <div className={styles.textInput}>
              <TextInput placeHolder="Username" />
            </div>
            <Select options={userRoles} value={"Member"} />
          </div>
        </div>
      }
      acceptButton={
        <Button.Root colorScheme="success">
          <Button.ButtonLabel>Add Member</Button.ButtonLabel>
        </Button.Root>
      }
    />
  );

  return (
    <div>
      <SettingItem
        title="Members"
        description="Your best buddies"
        additionalLeftColumnContent={dialog}
        content={<TeamMemberList teamMemberData={teamData.members} />}
      />
    </div>
  );
}

TeamMembers.displayName = "TeamMembers";
