"use client";

import styles from "./AddServiceAccountForm.module.css";
import { teamAddServiceAccount } from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamAddServiceAccountFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { useState } from "react";
import { Alert, Button, CopyButton, Dialog } from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { isRecord } from "@thunderstore/cyberstorm/src/utils/type_guards";

interface ServiceAccountSuccessResponse {
  service_account_token: string;
  service_account_nickname: string;
}

function isServiceAccountSuccessResponse(
  responseBodyJson: unknown
): responseBodyJson is ServiceAccountSuccessResponse {
  return (
    isRecord(responseBodyJson) &&
    typeof responseBodyJson.service_account_token === "string" &&
    typeof responseBodyJson.service_account_nickname === "string"
  );
}

export function AddServiceAccountForm(props: { teamName: string }) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: "Service account created",
  });

  const [serviceAccountAdded, setServiceAccountAdded] = useState(false);
  const [addedServiceAccountToken, setAddedServiceAccountToken] = useState("");
  const [addedServiceAccountNickname, setAddedServiceAccountNickname] =
    useState("");

  function onSubmitSuccessExtra(responseBodyString: object) {
    // TODO: Fix the Result type resolving in the whole chain of ApiForm
    // It's now just assumed all results are objects
    if (typeof responseBodyString === "string") {
      const responseJson = JSON.parse(responseBodyString);
      if (isServiceAccountSuccessResponse(responseJson)) {
        setServiceAccountAdded(true);
        setAddedServiceAccountToken(responseJson.service_account_token);
        setAddedServiceAccountNickname(responseJson.service_account_nickname);
        onSubmitSuccess();
      } else {
        onSubmitError();
      }
    } else {
      onSubmitError();
    }
  }

  if (serviceAccountAdded) {
    return (
      <>
        <div className={styles.dialog}>
          <p className={styles.dialogText}>
            New service account{" "}
            <span className={styles.dialogAddedServiceAccountName}>
              {addedServiceAccountNickname}
            </span>{" "}
            was created successfully. It can be used with this API token:
          </p>
          <div className={styles.token}>
            <pre className={styles.tokenField}>{addedServiceAccountToken}</pre>
            <CopyButton
              colorScheme="default"
              paddingSize="mediumSquare"
              text={addedServiceAccountToken}
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
        <div className={styles.footer}>
          <Dialog.Close asChild>
            <Button.Root
              colorScheme="default"
              paddingSize="large"
              onClick={() => {
                setAddedServiceAccountToken("");
                setServiceAccountAdded(false);
              }}
            >
              <Button.ButtonLabel>Close</Button.ButtonLabel>
            </Button.Root>
          </Dialog.Close>
        </div>
      </>
    );
  } else {
    return (
      <ApiForm
        onSubmitSuccess={onSubmitSuccessExtra}
        onSubmitError={onSubmitError}
        schema={teamAddServiceAccountFormSchema}
        meta={{ teamIdentifier: props.teamName }}
        endpoint={teamAddServiceAccount}
        formProps={{ className: styles.root }}
      >
        <div className={styles.dialog}>
          <div className={styles.dialogText}>
            Enter the nickname of the service account you wish to add to the
            team <span className={styles.dialogTeamName}>{props.teamName}</span>
          </div>
          <div>
            <FormTextInput
              schema={teamAddServiceAccountFormSchema}
              name={"nickname"}
              placeholder={"ExampleName"}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <FormSubmitButton text="Add Service Account" />
        </div>
      </ApiForm>
    );
  }
}

AddServiceAccountForm.displayName = "AddServiceAccountForm";
