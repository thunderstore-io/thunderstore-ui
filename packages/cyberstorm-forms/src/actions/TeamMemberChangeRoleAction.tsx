"use client";

import { useFormToaster } from "@thunderstore/cyberstorm-forms";
import { Select } from "@thunderstore/cyberstorm";
import {
  ApiAction,
  teamEditMemberFormSchema,
} from "@thunderstore/ts-api-react-forms";
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
    metaData: { teamIdentifier: props.teamName },
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
