import styles from "./LeaveTeamForm.module.css";
import { teamRemoveMember } from "@thunderstore/thunderstore-api";
import { ApiForm } from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";

import { z } from "zod";
import { CyberstormLink } from "@thunderstore/cyberstorm";

export function LeaveTeamForm(props: { username: string; teamName: string }) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `${props.username} left team ${props.teamName}`,
  });

  return (
    <ApiForm
      onSubmitSuccess={() => {
        onSubmitSuccess();
      }}
      onSubmitError={onSubmitError}
      schema={z.object({})}
      endpoint={teamRemoveMember}
      formProps={{ className: styles.root }}
      meta={{ teamIdentifier: props.teamName, username: props.username }}
    >
      <div className={styles.dialog}>
        <div className={styles.dialogText}>
          You are about to leave the team{" "}
          <CyberstormLink linkId="Team" team={props.teamName}>
            <span className={styles.leaveDescriptionTeamName}>
              {props.username}
            </span>
          </CyberstormLink>
        </div>
      </div>
      <div className={styles.footer}>
        <FormSubmitButton text="Leave team" colorScheme="danger" />
      </div>
    </ApiForm>
  );
}

LeaveTeamForm.displayName = "LeaveTeamForm";
