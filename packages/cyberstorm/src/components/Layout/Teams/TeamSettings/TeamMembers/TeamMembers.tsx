import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import styles from "./TeamMembers.module.css";
import { TeamMemberList } from "./TeamMemberList";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import * as Button from "../../../../Button/";
import { Dialog } from "../../../../Dialog/Dialog";
import { TextInput } from "../../../../TextInput/TextInput";
import { Select } from "../../../../Select/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

const userRoles = [
  { value: "member", label: "Member" },
  { value: "owner", label: "Owner" },
];

interface Props {
  teamName: string;
}

export function TeamMembers(props: Props) {
  const { teamName } = props;

  const dapper = useDapper();
  const members = usePromise(dapper.getTeamMembers, [teamName]);

  const dialog = (
    <Dialog
      title="Add Member"
      trigger={
        <Button.Root colorScheme="primary" paddingSize="large">
          <Button.ButtonLabel>Add Member</Button.ButtonLabel>
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faPlus} />
          </Button.ButtonIcon>
        </Button.Root>
      }
      showFooterBorder
      cancelButton="default"
      content={
        <div className={styles.dialogContent}>
          <p className={styles.description}>
            Enter the username of the user you wish to add to the team{" "}
            <span className={styles.dialogTeamName}>{teamName}</span>
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
        content={<TeamMemberList members={members} />}
      />
    </div>
  );
}

TeamMembers.displayName = "TeamMembers";
