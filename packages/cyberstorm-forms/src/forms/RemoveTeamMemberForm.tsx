import styles from "./RemoveTeamMemberForm.module.css";
import { teamRemoveMember } from "@thunderstore/thunderstore-api";
import { ApiForm } from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";

import { z } from "zod";
import { CyberstormLink } from "@thunderstore/cyberstorm";

export function RemoveTeamMemberForm(props: {
  userName: string;
  teamName: string;
  updateTrigger: () => Promise<void>;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `User ${"TODO"} removed from team ${"TODO"}`,
  });

  return (
    <ApiForm
      onSubmitSuccess={() => {
        onSubmitSuccess();
        props.updateTrigger();
      }}
      onSubmitError={onSubmitError}
      schema={z.object({})}
      endpoint={teamRemoveMember}
      formProps={{ className: styles.root }}
      meta={{ teamIdentifier: props.teamName, username: props.userName }}
    >
      <div className={styles.dialog}>
        <div className={styles.dialogText}>
          You are about to kick member{" "}
          <CyberstormLink linkId="User" user={props.userName}>
            <span className={styles.kickDescriptionUserName}>
              {props.userName}
            </span>
          </CyberstormLink>
        </div>
      </div>
      <div className={styles.footer}>
        <FormSubmitButton text="Kick member" colorScheme="danger" />
      </div>
    </ApiForm>
  );
}

RemoveTeamMemberForm.displayName = "RemoveTeamMemberForm";
