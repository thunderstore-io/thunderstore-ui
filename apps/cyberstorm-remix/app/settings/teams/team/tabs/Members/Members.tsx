import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense, useReducer, useState } from "react";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router";

import {
  Modal,
  NewButton,
  NewIcon,
  NewSelect,
  NewTextInput,
  SkeletonBox,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  teamAddMember,
  type TeamAddMemberRequestData,
  teamRemoveMember,
  UserFacingError,
  formatUserFacingError,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

import { type OutletContextShape } from "app/root";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/getLoaderTools";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import "./Members.css";
import type { DapperTs } from "@thunderstore/dapper-ts";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { MemberAddForm } from "./MemberAddForm";
import { MembersTable } from "./MembersTable";

const roleOptions = [
  { label: "Owner", value: "owner" },
  { label: "Member", value: "member" },
];

export const clientLoader = makeTeamSettingsTabLoader(
  async (dapper, teamName) => ({
    members: dapper.getTeamMembers(teamName),
  })
);

export default function Members() {
  const { teamName, members } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;
  return (
    <Suspense fallback={<MembersSkeleton />}>
      <Await resolve={members} errorElement={<NimbusAwaitErrorElement />}>
        {(result) => (
          <MembersContent
            teamName={teamName}
            members={result}
            outletContext={outletContext}
          />
        )}
      </Await>
    </Suspense>
  );
}

interface MembersContentProps {
  teamName: string;
  members: Awaited<ReturnType<DapperTs["getTeamMembers"]>>;
  outletContext: OutletContextShape;
}

/**
 * Displays the team members table once the loader promise settles.
 */
function MembersContent({
  teamName,
  members,
  outletContext,
}: MembersContentProps) {
  const revalidator = useRevalidator();

  async function teamMemberRevalidate() {
    revalidator.revalidate();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={members}>
        {(resolvedMembers) => (
          <div className="settings-items">
            <div className="settings-items__item">
              <div className="settings-items__meta">
                <p className="settings-items__title">Teams</p>
                <p className="settings-items__description">Manage your teams</p>
                <MemberAddForm
                  teamName={teamName}
                  updateTrigger={teamMemberRevalidate}
                  config={outletContext.requestConfig}
                />
              </div>
              <div className="settings-items__content">
                <MembersTable
                  teamName={teamName}
                  members={resolvedMembers}
                  updateTrigger={teamMemberRevalidate}
                  config={outletContext.requestConfig}
                />
              </div>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * Displays a table placeholder while members load on the client.
 */
function MembersSkeleton() {
  return (
    <div className="settings-items">
      <SkeletonBox className="settings-items__skeleton" />
    </div>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
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
      void props.updateTrigger();
      setOpen(false);
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
