"use client";

import styles from "./RemoveServiceAccountForm.module.css";
import { teamServiceAccountRemove } from "@thunderstore/thunderstore-api";
import { ApiForm } from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";

import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { Alert } from "@thunderstore/cyberstorm";

export function RemoveServiceAccountForm(props: {
  dialogOnChange: (v: boolean) => void;
  serviceAccountIdentifier: string;
  serviceAccountNickname: string;
  teamName: string;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `Service account ${props.serviceAccountNickname} removed from team ${props.teamName}`,
  });

  return (
    <ApiForm
      onSubmitSuccess={() => {
        onSubmitSuccess();
        props.dialogOnChange(false);
      }}
      onSubmitError={onSubmitError}
      schema={z.object({})}
      endpoint={teamServiceAccountRemove}
      formProps={{ className: styles.root }}
      meta={{
        serviceAccountIdentifier: props.serviceAccountIdentifier,
        teamName: props.teamName,
      }}
    >
      <div className={styles.dialog}>
        <Alert
          icon={<FontAwesomeIcon icon={faTriangleExclamation} />}
          content={
            "This cannot be undone! Related API token will stop working immediately if the service account is removed."
          }
          variant="warning"
        />
        <div className={styles.dialogText}>
          You are about to remove service account{" "}
          <span className={styles.removeDescriptionAccountName}>
            {props.serviceAccountNickname}
          </span>
          .
        </div>
      </div>
      <div className={styles.footer}>
        <FormSubmitButton text="Remove service account" colorScheme="danger" />
      </div>
    </ApiForm>
  );
}

RemoveServiceAccountForm.displayName = "RemoveServiceAccountForm";
