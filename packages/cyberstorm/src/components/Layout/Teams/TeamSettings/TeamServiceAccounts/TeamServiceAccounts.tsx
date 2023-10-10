import styles from "./TeamServiceAccounts.module.css";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import * as Button from "../../../../Button/";
import { ServiceAccountList } from "./ServiceAccountList/ServiceAccountList";
import { Dialog } from "../../../../Dialog/Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { TeamLink, UserLink } from "../../../../Links/Links";
import { TextInput } from "../../../../TextInput/TextInput";
import { useState } from "react";
import { CopyButton } from "../../../../CopyButton/CopyButton";
import { Alert } from "../../../../Alert/Alert";
import { useDapper } from "@thunderstore/dapper";
import { Team } from "@thunderstore/dapper/types";
import { usePromise } from "@thunderstore/use-promise";
import { Icon } from "../../../../Icon/Icon";

interface Props {
  teamData: Team;
}

export function TeamServiceAccounts(props: Props) {
  const { teamData } = props;

  const [serviceAccountAdded, setServiceAccountAdded] = useState(false);
  const [addedServiceAccountName, setAddedServiceAccountName] = useState("");

  const dapper = useDapper();
  const serviceAccountList = usePromise(dapper.getServiceAccountList, [
    teamData.name,
  ]);

  return (
    <div>
      <SettingItem
        title="Service accounts"
        description="Your loyal servants"
        additionalLeftColumnContent={
          <div>
            <Dialog
              title="Add Service Account"
              showFooterBorder
              trigger={
                <Button.Root paddingSize="large" colorScheme="primary">
                  <Button.ButtonLabel>Add Service Account</Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <Icon>
                      <FontAwesomeIcon icon={faPlus} />
                    </Icon>
                  </Button.ButtonIcon>
                </Button.Root>
              }
              content={
                serviceAccountAdded ? (
                  <div className={styles.dialogContent}>
                    <p className={styles.description}>
                      New service account{" "}
                      <UserLink user={addedServiceAccountName}>
                        <span className={styles.dialogAddedServiceAccountName}>
                          {addedServiceAccountName}
                        </span>
                      </UserLink>{" "}
                      was created successfully. It can be used with this API
                      token:
                    </p>
                    <div className={styles.token}>
                      <div className={styles.tokenText}>
                        <TextInput value="TODO: value" />
                      </div>
                      <CopyButton
                        colorScheme="default"
                        paddingSize="large"
                        text="TODO: value"
                      />
                    </div>
                    <Alert
                      icon={
                        <Icon>
                          <FontAwesomeIcon icon={faCircleExclamation} />
                        </Icon>
                      }
                      content={
                        "Store this token securely, as it can't be retrieved later, and treat it as you would treat an important password."
                      }
                      variant="info"
                    />
                  </div>
                ) : (
                  <div className={styles.dialogContent}>
                    <p className={styles.description}>
                      Enter the nickname of the service account you wish to add
                      to the team{" "}
                      <TeamLink team={teamData.name}>
                        <span className={styles.dialogTeamName}>
                          {teamData.name}
                        </span>
                      </TeamLink>
                    </p>
                    <TextInput
                      setValue={setAddedServiceAccountName}
                      value={addedServiceAccountName}
                      placeHolder="Username"
                    />
                  </div>
                )
              }
              cancelButton={serviceAccountAdded ? null : "default"}
              closeOnAccept={serviceAccountAdded}
              acceptButton={
                serviceAccountAdded ? (
                  <Button.Root
                    colorScheme="default"
                    paddingSize="large"
                    onClick={() => {
                      setAddedServiceAccountName("");
                      setServiceAccountAdded(false);
                    }}
                  >
                    <Button.ButtonLabel>Close</Button.ButtonLabel>
                  </Button.Root>
                ) : (
                  <Button.Root
                    colorScheme="success"
                    onClick={() => setServiceAccountAdded(!serviceAccountAdded)}
                  >
                    <Button.ButtonLabel>Add Service Account</Button.ButtonLabel>
                  </Button.Root>
                )
              }
            />
          </div>
        }
        content={
          <div className={styles.content}>
            <ServiceAccountList serviceAccountData={serviceAccountList} />
          </div>
        }
      />
    </div>
  );
}

TeamServiceAccounts.displayName = "TeamServiceAccounts";
