import styles from "./TeamServiceAccounts.module.css";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import { Button } from "../../../../Button/Button";
import { ServiceAccountList } from "./ServiceAccountList/ServiceAccountList";
import { Dialog } from "../../../../Dialog/Dialog";
import { ServiceAccount, TeamSettings } from "../../../../../schema";
import { getServiceAccountDummyData } from "../../../../../dummyData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { TeamLink, UserLink } from "../../../../Links/Links";
import { TextInput } from "../../../../TextInput/TextInput";
import { useState } from "react";
import { CopyButton } from "../../../../CopyButton/CopyButton";

export interface TeamServiceAccountsProps {
  serviceAccountData: string[];
  teamData: TeamSettings;
}

export function TeamServiceAccounts(props: TeamServiceAccountsProps) {
  const { serviceAccountData = [], teamData } = props;

  const [serviceAccountAdded, setServiceAccountAdded] = useState(false);
  const [addedServiceAccountName, setAddedServiceAccountName] = useState("");

  const serviceAccountAddedDialogContent = <div></div>;

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
                        colorScheme="secondary"
                        paddingSize="large"
                        text="TODO: value"
                      />
                    </div>
                    Todo: Alert
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
            <ServiceAccountList
              serviceAccountData={getServiceAccountListData(serviceAccountData)}
            />
          </div>
        }
      />
    </div>
  );
}

TeamServiceAccounts.displayName = "TeamServiceAccounts";

function getServiceAccountListData(
  serviceAccountIds: string[]
): ServiceAccount[] {
  const serviceAccountArray: ServiceAccount[] = [];
  serviceAccountIds.forEach((serviceAccountId) => {
    serviceAccountArray.push(getServiceAccountDummyData(serviceAccountId));
  });
  return serviceAccountArray;
}
