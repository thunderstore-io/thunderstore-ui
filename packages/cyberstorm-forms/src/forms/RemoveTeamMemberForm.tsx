"use client";

import styles from "./RemoveTeamMemberForm.module.css";
import { teamRemoveMember } from "@thunderstore/thunderstore-api";
import { ApiForm } from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";

import { z } from "zod";
import { UserLink } from "@thunderstore/cyberstorm";

export function RemoveTeamMemberForm(props: {
  dialogOnChange: (v: boolean) => void;
  userName: string;
  teamName: string;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `User ${"TODO"} removed from team ${"TODO"}`,
  });

  return (
    <ApiForm
      onSubmitSuccess={() => {
        onSubmitSuccess();
        props.dialogOnChange(false);
      }}
      onSubmitError={onSubmitError}
      schema={z.object({})}
      endpoint={teamRemoveMember}
      formProps={{ className: styles.root }}
      metaData={{ teamIdentifier: props.teamName, user: props.userName }}
    >
      <div className={styles.dialog}>
        <div className={styles.dialogText}>
          You are about to kick member{" "}
          <UserLink user={props.userName}>
            <span className={styles.kickDescriptionUserName}>
              {props.userName}
            </span>
          </UserLink>
        </div>
      </div>
      <div className={styles.footer}>
        <FormSubmitButton text="Kick member" colorScheme="danger" />
      </div>
    </ApiForm>
  );
}

RemoveTeamMemberForm.displayName = "RemoveTeamMemberForm";
