import styles from "./TeamServiceAccounts.module.css";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import * as Button from "../../../../Button/";
import { ServiceAccountList } from "./ServiceAccountList/ServiceAccountList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { UserLink } from "../../../../Links/Links";
import { TextInput } from "../../../../TextInput/TextInput";
import { useState } from "react";
import { CopyButton } from "../../../../CopyButton/CopyButton";
import { Alert } from "../../../../Alert/Alert";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { Dialog } from "../../../../../index";

interface Props {
  teamName: string;
}

export function TeamServiceAccounts(props: Props) {
  const { teamName } = props;

  const [serviceAccountAdded, setServiceAccountAdded] = useState(false);
  const [addedServiceAccountName, setAddedServiceAccountName] = useState("");

  const dapper = useDapper();
  const serviceAccounts = usePromise(dapper.getTeamServiceAccounts, [teamName]);

  return (
    <div>
      <SettingItem
        title="Service accounts"
        description="Your loyal servants"
        additionalLeftColumnContent={
          <div>
            <Dialog.Root
              title="Add Service Account"
              trigger={
                <Button.Root paddingSize="large" colorScheme="primary">
                  <Button.ButtonLabel>Add Service Account</Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button.ButtonIcon>
                </Button.Root>
              }
            >
              <>
                {serviceAccountAdded ? (
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
                      icon={<FontAwesomeIcon icon={faCircleExclamation} />}
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
                      <span className={styles.dialogTeamName}>{teamName}</span>
                    </p>
                    <TextInput
                      onChange={(e) =>
                        setAddedServiceAccountName(e.target.value)
                      }
                      value={addedServiceAccountName}
                      placeHolder="Username"
                    />
                  </div>
                )}
                <div className={styles.addServiceAccountDialogFooter}>
                  {serviceAccountAdded ? (
                    <Dialog.Close asChild>
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
                    </Dialog.Close>
                  ) : (
                    <Button.Root
                      colorScheme="success"
                      onClick={() =>
                        setServiceAccountAdded(!serviceAccountAdded)
                      }
                    >
                      <Button.ButtonLabel>
                        Add Service Account
                      </Button.ButtonLabel>
                    </Button.Root>
                  )}
                </div>
              </>
            </Dialog.Root>
          </div>
        }
        content={
          <div className={styles.content}>
            <ServiceAccountList serviceAccounts={serviceAccounts} />
          </div>
        }
      />
    </div>
  );
}

TeamServiceAccounts.displayName = "TeamServiceAccounts";
