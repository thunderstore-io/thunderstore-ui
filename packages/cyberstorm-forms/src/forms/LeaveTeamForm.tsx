"use client";

import styles from "./LeaveTeamForm.module.css";
import { teamRemoveMember } from "@thunderstore/thunderstore-api";
import { ApiForm } from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";

import { z } from "zod";
import { TeamLink } from "@thunderstore/cyberstorm";

export function LeaveTeamForm(props: {
  dialogOnChange: (v: boolean) => void;
  userName: string;
  teamName: string;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `${props.userName} left team ${props.teamName}`,
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
      meta={{ teamIdentifier: props.teamName, user: props.userName }}
    >
      <div className={styles.dialog}>
        <div className={styles.dialogText}>
          You are about to leave the team{" "}
          <TeamLink team={props.teamName}>
            <span className={styles.leaveDescriptionTeamName}>
              {props.userName}
            </span>
          </TeamLink>
        </div>
      </div>
      <div className={styles.footer}>
        <FormSubmitButton text="Leave team" colorScheme="danger" />
      </div>
    </ApiForm>
  );
}

LeaveTeamForm.displayName = "LeaveTeamForm";
