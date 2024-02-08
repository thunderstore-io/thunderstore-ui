"use client";

import styles from "./AddTeamMemberForm.module.css";
import { teamAddMember } from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamAddMemberFormSchema,
} from "@thunderstore/ts-api-react-forms";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { FormSelect } from "../components/FormSelect";

export function AddTeamMemberForm(props: {
  dialogOnChange: (v: boolean) => void;
  teamName: string;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `Member TODO added to ${props.teamName}`,
  });

  const roleOptions = [
    { value: "member", label: "Member" },
    { value: "owner", label: "Owner" },
  ];

  return (
    <ApiForm
      onSubmitSuccess={() => {
        onSubmitSuccess();
        props.dialogOnChange(false);
      }}
      onSubmitError={onSubmitError}
      schema={teamAddMemberFormSchema}
      meta={{ teamIdentifier: props.teamName }}
      endpoint={teamAddMember}
      formProps={{ className: styles.root }}
    >
      <div className={styles.dialog}>
        <div className={styles.dialogText}>
          Enter the username of the user you wish to add to the team{" "}
          <span className={styles.teamNameText}>{props.teamName}</span>
        </div>
        <div className={styles.fields}>
          <div className={styles.usernameWrapper}>
            <FormTextInput
              schema={teamAddMemberFormSchema}
              name={"user"}
              placeholder={"Enter username..."}
            />
          </div>
          <FormSelect
            schema={teamAddMemberFormSchema}
            name={"role"}
            options={roleOptions}
            defaultValue="member"
            placeholder="Select role..."
            ariaLabel={"role"}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <FormSubmitButton text="Add member" />
      </div>
    </ApiForm>
  );
}

AddTeamMemberForm.displayName = "AddTeamMemberForm";
