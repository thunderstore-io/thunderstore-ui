"use client";

import { useFormToaster } from "@thunderstore/cyberstorm-forms";
import { Select } from "@thunderstore/cyberstorm";
import { teamEditMemberFormSchema } from "@thunderstore/ts-api-react-forms";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import { teamEditMember } from "@thunderstore/thunderstore-api";

export function TeamMemberChangeRoleAction(props: {
  teamName: string;
  userName: string;
  currentRole: "member" | "owner";
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `Changed the role of ${props.userName} to TODO`,
  });

  const roleOptions = [
    { value: "member", label: "Member" },
    { value: "owner", label: "Owner" },
  ];

  const onSubmit = ApiAction({
    schema: teamEditMemberFormSchema,
    meta: { teamIdentifier: props.teamName },
    endpoint: teamEditMember,
    onSubmitSuccess: onSubmitSuccess,
    onSubmitError: onSubmitError,
  });

  function onChange(value: string) {
    onSubmit({ user: props.userName, role: value });
  }

  return (
    <Select
      triggerFontSize="medium"
      options={roleOptions}
      value={props.currentRole}
      onChange={onChange}
    />
  );
}

TeamMemberChangeRoleAction.displayName = "TeamMemberChangeRoleAction";
