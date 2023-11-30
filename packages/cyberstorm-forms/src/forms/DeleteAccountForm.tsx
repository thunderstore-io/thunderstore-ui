"use client";

import styles from "./DeleteAccountForm.module.css";
import { userDelete } from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  userDeleteFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";

import { Alert } from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faWarning } from "@fortawesome/pro-solid-svg-icons";

export function DeleteAccountForm(props: { userName: string }) {
  const toast = useFormToaster({
    successMessage: `User ${props.userName} deleted`,
  });

  return (
    <ApiForm
      {...toast}
      schema={userDeleteFormSchema}
      endpoint={userDelete}
      formProps={{ className: styles.root }}
      metaData={{ username: props.userName }}
    >
      <Alert
        icon={<FontAwesomeIcon icon={faWarning} />}
        content={
          "You are about to delete your account. Once deleted, it will be gone forever. Please be certain."
        }
        variant="warning"
      />
      <p className={styles.instructionText}>
        The mods that have been uploaded on this account will remain public on
        the site even after deletion. If you need them to be taken down as well,
        please contact an administrator on the community Discord server.
      </p>
      <p className={styles.instructionText}>
        As a precaution, to delete your account, please input{" "}
        <span className={styles.username}>{props.userName}</span> into the field
        below.
      </p>
      <div className={styles.verificationInput}>
        <FormTextInput
          schema={userDeleteFormSchema}
          name={"verification"}
          placeholder={"Verification..."}
        />
      </div>
      <div>
        <FormSubmitButton
          text="I understand this action is irrevocable and want to continue"
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          colorScheme="danger"
        />
      </div>
    </ApiForm>
  );
}

DeleteAccountForm.displayName = "DeleteAccountForm";
