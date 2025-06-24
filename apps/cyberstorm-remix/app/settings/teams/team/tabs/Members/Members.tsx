import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import {
  Avatar,
  Modal,
  NewButton,
  NewIcon,
  NewLink,
  NewTable,
  Select,
} from "@thunderstore/cyberstorm";
import { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";
import {
  ApiError,
  RequestConfig,
  teamAddMember,
  teamEditMember,
  teamRemoveMember,
} from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamAddMemberFormSchema,
  teamEditMemberFormSchema,
} from "@thunderstore/ts-api-react-forms";
import { FormSelect } from "@thunderstore/cyberstorm-forms/src/components/FormSelect";
import { OutletContextShape } from "../../../../../root";
import { TableSort } from "@thunderstore/cyberstorm/src/newComponents/Table/Table";
import { z } from "zod";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    try {
      const dapper = window.Dapper;
      return {
        teamName: params.namespaceId,
        members: await dapper.getTeamMembers(params.namespaceId),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Team not found", { status: 404 });
      } else {
        // REMIX TODO: Add sentry
        throw error;
      }
    }
  }
  throw new Response("Team not found", { status: 404 });
}

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

const teamMemberColumns = [
  { value: "User", disableSort: false },
  { value: "Role", disableSort: false },
  { value: "Actions", disableSort: true },
];

const roleOptions = [
  { value: "member", label: "Member" },
  { value: "owner", label: "Owner" },
];

export default function Page() {
  const { teamName, members } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  const revalidator = useRevalidator();

  async function teamMemberRevalidate() {
    revalidator.revalidate();
  }

  const roleToast = useFormToaster({
    successMessage: `Role changed`,
  });

  const onSubmit = ApiAction({
    schema: teamEditMemberFormSchema,
    meta: { teamIdentifier: teamName },
    endpoint: teamEditMember,
    onSubmitSuccess: () => {
      onSubmitSuccess();
      teamMemberRevalidate();
    },
    onSubmitError: roleToast.onSubmitError,
    config: outletContext.requestConfig,
  });

  function onChange(username: string, value: string) {
    onSubmit({ username: username, role: value });
  }

  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `Member TODO added to ${teamName}`,
  });

  const tableData = members.map((member, index) => {
    return [
      {
        value: (
          <NewLink
            primitiveType="cyberstormLink"
            linkId="User"
            key={`user_${index}`}
            user={member.username}
          >
            <div>
              <Avatar
                src={member.avatar}
                username={member.username}
                size="small"
              />
              <span>{member.username}</span>
            </div>
          </NewLink>
        ),
        sortValue: member.username,
      },
      {
        value: (
          <div key={`role_${index}`}>
            <Select
              triggerFontSize="medium"
              options={roleOptions}
              value={member.role}
              onChange={(val: string) => onChange(member.username, val)}
            />
          </div>
        ),
        sortValue: member.role,
      },
      {
        value: (
          <Modal
            key={`action_${index}`}
            title="Confirm member removal"
            trigger={
              <NewButton
                csVariant="danger"
                key={`action_button_${index}`}
                {...{
                  popovertarget: `memberKickModal-${member.username}-${index}`,
                  popovertargetaction: "open",
                }}
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faTrashCan} />
                </NewIcon>
                Kick
              </NewButton>
            }
            popoverId={`memberKickModal-${member.username}-${index}`}
          >
            <RemoveTeamMemberForm
              teamName={teamName}
              userName={member.username}
              updateTrigger={teamMemberRevalidate}
              config={outletContext.requestConfig}
            />
          </Modal>
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
          <Modal
            popoverId={"teamMembersAddMember"}
            csSize="small"
            trigger={
              <NewButton
                {...{
                  popovertarget: "teamMembersAddMember",
                  popovertargetaction: "open",
                }}
              >
                Add Member
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faPlus} />
                </NewIcon>
              </NewButton>
            }
          >
            {/* <CreateTeamForm
              config={() => config}
              updateTrigger={createTeamRevalidate}
            /> */}
            <ApiForm
              onSubmitSuccess={() => {
                onSubmitSuccess();
                if (teamMemberRevalidate) {
                  teamMemberRevalidate();
                }
              }}
              onSubmitError={onSubmitError}
              schema={teamAddMemberFormSchema}
              meta={{ teamIdentifier: teamName }}
              endpoint={teamAddMember}
              formProps={{ className: "__form" }}
              config={outletContext.requestConfig}
            >
              <div className="nimbus-commonStyles-modalTempalate__header">
                Add user to team
              </div>
              <div className="nimbus-commonStyles-modalTempalate__content">
                <div className="__dialogText">
                  Enter the username of the user you wish to add to the team{" "}
                  <span className="__teamNameText">{teamName}</span>
                </div>
                <div className="__fields">
                  <div className="__usernameWrapper">
                    <FormTextInput
                      schema={teamAddMemberFormSchema}
                      name={"username"}
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
              <div className="nimbus-commonStyles-modalTempalate__footer">
                <FormSubmitButton rootClasses="__submit">
                  Add member
                </FormSubmitButton>
              </div>
            </ApiForm>
          </Modal>
        </div>
        <div className="settings-items__content">
          <NewTable
            headers={teamMemberColumns}
            rows={tableData}
            sortByHeader={1}
            sortDirection={TableSort.ASC}
            csModifiers={["alignLastColumnRight"]}
          />
        </div>
      </div>
    </div>
  );
}

function RemoveTeamMemberForm(props: {
  userName: string;
  teamName: string;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
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
      formProps={{ className: "nimbus-commonStyles-modalTempalate" }}
      meta={{ teamIdentifier: props.teamName, username: props.userName }}
      config={props.config}
    >
      <div className="nimbus-commonStyles-modalTempalate__header">
        Kick member
      </div>
      <div className="nimbus-commonStyles-modalTempalate__content">
        <div>
          You are about to kick member{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="User"
            user={props.userName}
          >
            <span>{props.userName}</span>
          </NewLink>
        </div>
      </div>
      <div className="nimbus-commonStyles-modalTempalate__footer">
        <FormSubmitButton csVariant="danger">Kick member</FormSubmitButton>
      </div>
    </ApiForm>
  );
}

RemoveTeamMemberForm.displayName = "RemoveTeamMemberForm";
