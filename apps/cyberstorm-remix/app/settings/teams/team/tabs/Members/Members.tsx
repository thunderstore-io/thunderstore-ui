import "./Members.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  Modal,
  NewAvatar,
  NewButton,
  NewIcon,
  NewLink,
  NewSelect,
  NewTable,
  NewTextInput,
  type SelectOption,
  useToast,
} from "@thunderstore/cyberstorm";
import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";
import {
  ApiError,
  type RequestConfig,
  teamAddMember,
  type TeamAddMemberRequestData,
  teamEditMember,
  teamRemoveMember,
  UserFacingError,
  formatUserFacingError,
} from "@thunderstore/thunderstore-api";
import { type OutletContextShape } from "../../../../../root";
import { TableSort } from "@thunderstore/cyberstorm/src/newComponents/Table/Table";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { useReducer, useState } from "react";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    try {
      const tools = getSessionTools();
      const config = tools?.getConfig();
      const dapper = new DapperTs(() => {
        return {
          apiHost: config.apiHost,
          sessionId: config.sessionId,
        };
      });
      return {
        teamName: params.namespaceId,
        members: await dapper.getTeamMembers(params.namespaceId),
      };
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        throwUserFacingPayloadResponse({
          headline: "Team not found.",
          description: "We could not find the requested team.",
          category: "not_found",
          status: 404,
        });
      }
      handleLoaderError(error);
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Team not found.",
    description: "We could not find the requested team.",
    category: "not_found",
    status: 404,
  });
}

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

const teamMemberColumns = [
  { value: "User", disableSort: false },
  { value: "Role", disableSort: false },
  { value: "Actions", disableSort: true },
];

const roleOptions: SelectOption<"owner" | "member">[] = [
  { value: "member", label: "Member" },
  { value: "owner", label: "Owner" },
];

export default function Members() {
  const { teamName, members } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  const revalidator = useRevalidator();

  async function teamMemberRevalidate() {
    revalidator.revalidate();
  }

  const toast = useToast();

  const changeMemberRoleAction = ApiAction({
    endpoint: teamEditMember,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Member role updated`,
        duration: 4000,
      });
      teamMemberRevalidate();
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: formatUserFacingError(error),
        duration: 8000,
      });
    },
  });

  function changeMemberRole(username: string, value: "owner" | "member") {
    changeMemberRoleAction({
      params: { teamIdentifier: teamName, username },
      data: { role: value },
      queryParams: {},
      config: outletContext.requestConfig,
    });
  }

  const tableData = members.map((member, index) => {
    return [
      {
        value: (
          <NewLink
            primitiveType="cyberstormLink"
            linkId="User"
            key={`user_${index}`}
            user={member.username}
            rootClasses="members__user"
          >
            <NewAvatar
              src={member.avatar}
              username={member.username}
              csSize="small"
            />
            <span>{member.username}</span>
          </NewLink>
        ),
        sortValue: member.username,
      },
      {
        value: (
          <div key={`role_${index}`}>
            <NewSelect
              csSize="xsmall"
              options={roleOptions}
              value={member.role}
              onChange={(val) =>
                changeMemberRole(member.username, val as "owner" | "member")
              }
            />
          </div>
        ),
        sortValue: member.role,
      },
      {
        value: (
          <RemoveTeamMemberForm
            indexKey={`action_${index}`}
            teamName={teamName}
            userName={member.username}
            updateTrigger={teamMemberRevalidate}
            config={outletContext.requestConfig}
          />
        ),
        sortValue: 0,
      },
    ];
  });

  return (
    <div className="settings-items">
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Teams</p>
          <p className="settings-items__description">Manage your teams</p>
          <AddTeamMemberForm
            teamName={teamName}
            updateTrigger={teamMemberRevalidate}
            config={outletContext.requestConfig}
          />
        </div>
        <div className="settings-items__content">
          <NewTable
            headers={teamMemberColumns}
            rows={tableData}
            sortByHeader={1}
            sortDirection={TableSort.ASC}
          />
        </div>
      </div>
    </div>
  );
}

function AddTeamMemberForm(props: {
  teamName: string;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  function formFieldUpdateAction(
    state: TeamAddMemberRequestData,
    action: {
      field: keyof TeamAddMemberRequestData;
      value: TeamAddMemberRequestData[keyof TeamAddMemberRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    username: "",
    role: "member",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof teamAddMember>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await teamAddMember({
      config: props.config,
      params: { team_name: props.teamName },
      queryParams: {},
      data: { username: data.username, role: data.role },
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    TeamAddMemberRequestData,
    Error,
    SubmitorOutput,
    UserFacingError,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: () => {
      props.updateTrigger();
      toast.addToast({
        csVariant: "success",
        children: `Team member added`,
        duration: 4000,
      });
      setOpen(false);
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: formatUserFacingError(error),
        duration: 8000,
      });
    },
  });

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      titleContent="Add Team Member"
      csSize="small"
      trigger={
        <NewButton>
          Add Member
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faPlus} />
          </NewIcon>
        </NewButton>
      }
    >
      <Modal.Body>
        <div className="add-member-form__text">
          Enter the username of the user you wish to add to the team{" "}
          <span className="add-member-form__text--bold">{props.teamName}</span>.
        </div>
        <div className="add-member-form__fields">
          <div className="add-member-form__field add-member-form__username">
            <label className="add-member-form__label" htmlFor="username">
              Username
            </label>
            <NewTextInput
              name={"username"}
              placeholder={"Enter username..."}
              onChange={(e) => {
                updateFormFieldState({
                  field: "username",
                  value: e.target.value,
                });
              }}
              rootClasses="add-member-form__username-input"
              id="username"
            />
          </div>
          <div className="add-member-form__field">
            <label className="add-member-form__label" htmlFor="role">
              Role
            </label>
            <NewSelect
              name={"role"}
              options={roleOptions}
              defaultValue="member"
              placeholder="Select role..."
              onChange={(value) => {
                updateFormFieldState({ field: "role", value: value });
              }}
              id="role"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <NewButton csVariant="accent" onClick={strongForm.submit}>
          Add member
        </NewButton>
      </Modal.Footer>
    </Modal>
  );
}

AddTeamMemberForm.displayName = "AddTeamMemberForm";

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
        children: formatUserFacingError(error),
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
