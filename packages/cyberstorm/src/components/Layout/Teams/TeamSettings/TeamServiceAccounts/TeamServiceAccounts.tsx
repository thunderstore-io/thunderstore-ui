import styles from "./TeamServiceAccounts.module.css";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import { Button } from "../../../../Button/Button";
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

export interface TeamServiceAccountsProps {
  teamData: Team;
}

export function TeamServiceAccounts(props: TeamServiceAccountsProps) {
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
                <Button
                  paddingSize="large"
                  colorScheme="primary"
                  rightIcon={<FontAwesomeIcon icon={faPlus} fixedWidth />}
                  label="Add Service Account"
                />
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
                        <FontAwesomeIcon
                          fixedWidth
                          icon={faCircleExclamation}
                        />
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
                  <Button
                    label="Close"
                    colorScheme="default"
                    paddingSize="large"
                    onClick={() => {
                      setAddedServiceAccountName("");
                      setServiceAccountAdded(false);
                    }}
                  />
                ) : (
                  <Button
                    label="Add Service Account"
                    colorScheme="success"
                    onClick={() => setServiceAccountAdded(!serviceAccountAdded)}
                  />
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
