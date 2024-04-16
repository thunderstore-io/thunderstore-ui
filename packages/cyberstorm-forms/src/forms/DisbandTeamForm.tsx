"use client";

import styles from "./DisbandTeamForm.module.css";
import { teamDisbandTeam } from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamDisbandFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";

import { CyberstormLink } from "@thunderstore/cyberstorm";

export function DisbandTeamForm(props: {
  dialogOnChange: (v: boolean) => void;
  teamName: string;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `Team ${props.teamName} disbanded`,
  });

  return (
    <ApiForm
      onSubmitSuccess={() => {
        onSubmitSuccess();
        props.dialogOnChange(false);
      }}
      onSubmitError={onSubmitError}
      schema={teamDisbandFormSchema}
      endpoint={teamDisbandTeam}
      formProps={{ className: styles.root }}
      meta={{ teamIdentifier: props.teamName }}
    >
      <div className={styles.dialog}>
        <p className={styles.description}>
          As a precaution, to disband your team, please input {props.teamName}{" "}
          into the field below.
        </p>
        <FormTextInput
          schema={teamDisbandFormSchema}
          name={"verification"}
          placeholder={"Verification"}
        />
        <div className={styles.dialogText}>
          You are about to disband the team{" "}
          <CyberstormLink linkId="Team" team={props.teamName}>
            <span className={styles.kickDescriptionUserName}>
              {props.teamName}
            </span>
          </CyberstormLink>
        </div>
      </div>
      <div className={styles.footer}>
        <FormSubmitButton text="Disband team" colorScheme="danger" />
      </div>
    </ApiForm>
  );
}

DisbandTeamForm.displayName = "DisbandTeamForm";
