import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type OutletContextShape } from "app/root";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { isTeamOwner } from "cyberstorm/utils/permissions";
import { Suspense, useReducer, useState } from "react";
import {
  Await,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";

import {
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewLink,
  NewTextInput,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  type TeamDisbandRequestData,
  UserFacingError,
  teamDisband,
  teamRemoveMember,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

import "./Settings.css";

export const clientLoader = makeTeamSettingsTabLoader(
  async (dapper, teamName) => ({
    permissions: dapper.getCurrentUserTeamPermissions(teamName),
  })
);

export default function Settings() {
  const { permissions, teamName } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();
  const navigate = useNavigate();

  async function moveToTeams() {
    toast.addToast({
      csVariant: "info",
      children: `Moving to teams selection`,
      duration: 4000,
    });
    navigate("/teams");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={permissions}>
        {(resolvedPermissions) => (
          <div className="settings-items">
            <div className="settings-items__item">
              <div className="settings-items__meta">
                <p className="settings-items__title">Leave team</p>
                <p className="settings-items__description">
                  Resign from the team
                </p>
              </div>
              <div className="settings-items__content">
                {resolvedPermissions.can_leave_team ? (
                  <LeaveTeamForm
                    userName={outletContext.currentUser?.username ?? ""}
                    teamName={teamName}
                    toast={toast}
                    config={outletContext.requestConfig}
                    updateTrigger={moveToTeams}
                  />
                ) : (
                  <LastOwnerAlert />
                )}
              </div>
            </div>
            <div className="settings-items__separator" />
            <div className="settings-items__item">
              <div className="settings-items__meta">
                <p className="settings-items__title">Disband team</p>
                <p className="settings-items__description">
                  Remove the team completely
                </p>
              </div>
              <div className="settings-items__content">
                {resolvedPermissions.can_disband_team ? (
                  <DisbandTeamForm
                    teamName={teamName}
                    updateTrigger={moveToTeams}
                    config={outletContext.requestConfig}
                    toast={toast}
                  />
                ) : isTeamOwner(teamName, outletContext.currentUser) ? (
                  <TeamHasPackagesAlert />
                ) : (
                  <NotTeamOwnerAlert />
                )}
              </div>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

const LastOwnerAlert = () => (
  <NewAlert csVariant="info">
    You cannot currently leave this team as you are its last owner.
    <br />
    To leave the team, you need to assign another owner to it. Alternatively,
    you can disband the whole team.
  </NewAlert>
);

const TeamHasPackagesAlert = () => (
  <NewAlert csVariant="info">
    You cannot currently disband this team as it has packages.
    <br />
    If you need to archive this team, contact #support in the{" "}
    <a href="https://discord.thunderstore.io/">Thunderstore Discord</a>.
  </NewAlert>
);

const NotTeamOwnerAlert = () => (
  <NewAlert csVariant="info">Only team owners can disband teams.</NewAlert>
);

function LeaveTeamForm(props: {
  userName: string;
  teamName: string;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}) {
  const { userName, teamName, toast, updateTrigger, config } = props;
  const [open, setOpen] = useState(false);
  const kickMemberAction = ApiAction({
    endpoint: teamRemoveMember,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `You have left the team ${teamName}`,
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

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      titleContent="Leave team?"
      csSize="small"
      trigger={
        <NewButton
          csVariant="danger"
          rootClasses="team-settings__leave-and-disband-button"
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faTrashCan} />
          </NewIcon>
          Leave team
        </NewButton>
      }
    >
      <Modal.Body>
        <span>
          You are about to leave the team{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Team"
            team={teamName}
            csVariant="cyber"
          >
            {teamName}.
          </NewLink>
        </span>
      </Modal.Body>
      <Modal.Footer>
        <NewButton
          csVariant="danger"
          onClick={() =>
            kickMemberAction({
              config: config,
              params: { team_name: teamName, username: userName },
              queryParams: {},
              data: {},
            })
          }
        >
          Leave team
        </NewButton>
      </Modal.Footer>
    </Modal>
  );
}

LeaveTeamForm.displayName = "LeaveTeamForm";

function DisbandTeamForm(props: {
  teamName: string;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}) {
  const { teamName, toast, updateTrigger, config } = props;

  const [open, setOpen] = useState(false);

  function formFieldUpdateAction(
    state: TeamDisbandRequestData,
    action: {
      field: keyof TeamDisbandRequestData;
      value: TeamDisbandRequestData[keyof TeamDisbandRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    team_name: "",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof teamDisband>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await teamDisband({
      config: config,
      params: { team_name: teamName },
      data: { team_name: data.team_name },
      queryParams: {},
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    TeamDisbandRequestData,
    Error,
    SubmitorOutput,
    UserFacingError,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `You have disbanded the team ${teamName}`,
        duration: 4000,
      });
      updateTrigger();
      setOpen(false);
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
      titleContent="Disband team?"
      csSize="small"
      trigger={
        <NewButton
          csVariant="danger"
          rootClasses="team-settings__leave-and-disband-button"
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faTrashCan} />
          </NewIcon>
          Disband team
        </NewButton>
      }
    >
      <Modal.Body>
        <div>
          You are about to disband the team{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Team"
            team={teamName}
            csVariant="cyber"
          >
            {teamName}.
          </NewLink>
        </div>
        <div>
          As a precaution, to disband your team, please input{" "}
          <span className="disband-team-form__text--bold">{teamName}</span> into
          the field below.
        </div>
        <NewTextInput
          onChange={(e) =>
            updateFormFieldState({ field: "team_name", value: e.target.value })
          }
        />
      </Modal.Body>
      <Modal.Footer>
        <NewButton
          csVariant="danger"
          onClick={() => {
            strongForm.submit();
          }}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faTrashCan} />
          </NewIcon>
          Disband team
        </NewButton>
      </Modal.Footer>
    </Modal>
  );
}

LeaveTeamForm.displayName = "LeaveTeamForm";
