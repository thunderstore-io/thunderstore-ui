"use client";

import styles from "./AddTeamMemberForm.module.css";
import { teamAddMember } from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamAddMemberFormSchema,
} from "@thunderstore/ts-api-react-forms";
import { GhostInput, useFormToaster } from "@thunderstore/cyberstorm-forms";
import { FormSelect } from "../components/FormSelect";

export function AddTeamMemberForm(props: {
  teamName: string;
  userName: string;
  userCurrentRole: "member" | "owner";
}) {
  const toaster = useFormToaster({
    successMessage: `Changed the role of ${props.userName} to TODO`,
  });

  const roleOptions = [
    { value: "member", label: "Member" },
    { value: "owner", label: "Owner" },
  ];

  return (
    <ApiForm
      {...toaster}
      schema={teamAddMemberFormSchema}
      metaData={{ identifier: props.teamName }}
      endpoint={teamAddMember}
      formProps={{ className: styles.root }}
    >
      <GhostInput
        schema={teamAddMemberFormSchema}
        name={"user"}
        value={props.userName}
      />
      <FormSelect
        schema={teamAddMemberFormSchema}
        name={"role"}
        options={roleOptions}
        defaultValue={props.userCurrentRole}
        placeholder="Select role..."
        ariaLabel={"role"}
      />
    </ApiForm>
  );
}

AddTeamMemberForm.displayName = "AddTeamMemberForm";
