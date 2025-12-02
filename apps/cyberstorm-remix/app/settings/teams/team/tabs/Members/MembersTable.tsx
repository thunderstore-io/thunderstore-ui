import { faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useOutletContext } from "react-router";

import {
  Modal,
  NewAvatar,
  NewButton,
  NewIcon,
  NewLink,
  NewSelect,
  NewTable,
  useToast,
  type SelectOption,
} from "@thunderstore/cyberstorm";
import { TableSort } from "@thunderstore/cyberstorm/src/newComponents/Table/Table";
import {
  teamEditMember,
  teamRemoveMember,
  type RequestConfig,
  type TeamMember,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

import { type OutletContextShape } from "app/root";
import { isTeamOwner } from "cyberstorm/utils/permissions";

const teamMemberColumns = [
  { value: "User", disableSort: false },
  { value: "Role", disableSort: false },
  { value: "Actions", disableSort: true },
];

const roleOptions: SelectOption<"owner" | "member">[] = [
  { value: "member", label: "Member" },
  { value: "owner", label: "Owner" },
];

export function MembersTable(props: {
  config: () => RequestConfig;
  members: TeamMember[];
  teamName: string;
  updateTrigger: () => Promise<void>;
}) {
  const { config, members, teamName, updateTrigger } = props;
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();

  const currentUser = outletContext.currentUser;
  const isOwner = isTeamOwner(teamName, currentUser);

  const canManageMember = (username: string) =>
    isOwner && currentUser?.username !== username;

  const changeMemberRoleAction = ApiAction({
    endpoint: teamEditMember,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Member role updated`,
        duration: 4000,
      });
      updateTrigger();
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  function changeMemberRole(username: string, value: "owner" | "member") {
    changeMemberRoleAction({
      params: { teamIdentifier: teamName, username },
      data: { role: value },
      queryParams: {},
      config,
    });
  }

  const tableData = members.map((member, index) => {
    return [
      {
        value: (
          <div
            key={`user_${member.username}_${index}`}
            className="members__user"
          >
            <NewAvatar
              src={member.avatar}
              username={member.username}
              csSize="small"
            />
            <span>{member.username}</span>
          </div>
        ),
        sortValue: member.username,
      },
      {
        value: (
          <div key={`role_${member.username}_${index}`}>
            <NewSelect
              csSize="xsmall"
              options={roleOptions}
              value={member.role}
              onChange={(val: "owner" | "member") =>
                changeMemberRole(member.username, val)
              }
              disabled={!canManageMember(member.username)}
            />
          </div>
        ),
        sortValue: member.role,
      },
      {
        value: canManageMember(member.username) ? (
          <RemoveTeamMemberForm
            indexKey={`action_${member.username}_${index}`}
            teamName={teamName}
            userName={member.username}
            updateTrigger={updateTrigger}
            config={config}
          />
        ) : currentUser?.username === member.username ? (
          <span
            className="members_table__span"
            key={`action_${member.username}_${index}`}
          >
            Use the{" "}
            <NewLink
              linkId="TeamSettingsSettings"
              team={teamName}
              primitiveType="cyberstormLink"
              csVariant="cyber"
            >
              Settings tab
            </NewLink>{" "}
            to leave the team.
          </span>
        ) : null,
        sortValue: 0,
      },
    ];
  });

  return (
    <NewTable
      headers={teamMemberColumns}
      rows={tableData}
      sortByHeader={1}
      sortDirection={TableSort.ASC}
    />
  );
}

MembersTable.displayName = "MembersTable";

function RemoveTeamMemberForm(props: {
  indexKey?: string;
  userName: string;
  teamName: string;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const kickMemberAction = ApiAction({
    endpoint: teamRemoveMember,
    onSubmitSuccess: () => {
      props.updateTrigger();
      toast.addToast({
        csVariant: "success",
        children: `Team member removed`,
        duration: 4000,
      });
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      titleContent="Confirm member removal"
      csSize="small"
      trigger={
        <NewButton csVariant="danger" csSize="xsmall" key={props.indexKey}>
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faTrashCan} />
          </NewIcon>
          Kick
        </NewButton>
      }
    >
      <Modal.Body className="remove-member-form__body">
        <div className="remove-member-form__text">
          You are about to kick member{" "}
          <span className="remove-member-form__text--bold">
            {props.userName}
          </span>
          .
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <NewButton>Cancel</NewButton>
        </Modal.Close>
        <NewButton
          csVariant="danger"
          onClick={() =>
            kickMemberAction({
              config: props.config,
              params: { team_name: props.teamName, username: props.userName },
              queryParams: {},
              data: {},
            }).then(() => {
              setOpen(false);
            })
          }
        >
          Kick member
        </NewButton>
      </Modal.Footer>
    </Modal>
  );
}

RemoveTeamMemberForm.displayName = "RemoveTeamMemberForm";
