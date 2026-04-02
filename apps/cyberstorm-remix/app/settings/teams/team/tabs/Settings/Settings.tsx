import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type OutletContextShape } from "app/root";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { isTeamOwner } from "cyberstorm/utils/permissions";
import { Suspense, useReducer } from "react";
import {
  Await,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";

import {
  NewAlert,
  NewButton,
  NewIcon,
  NewTextInput,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  type TeamDisbandRequestData,
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
                {!resolvedPermissions.can_leave_team && <LastOwnerAlert />}
                <LeaveTeamForm
                  userName={outletContext.currentUser?.username ?? ""}
                  teamName={teamName}
                  toast={toast}
                  config={outletContext.requestConfig}
                  updateTrigger={moveToTeams}
                  disabled={!resolvedPermissions.can_leave_team}
                />
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
                {!resolvedPermissions.can_disband_team &&
                  (isTeamOwner(teamName, outletContext.currentUser) ? (
                    <TeamHasPackagesAlert />
                  ) : (
                    <NotTeamOwnerAlert />
                  ))}
                <DisbandTeamForm
                  teamName={teamName}
                  updateTrigger={moveToTeams}
                  config={outletContext.requestConfig}
                  toast={toast}
                  disabled={!resolvedPermissions.can_disband_team}
                />
              </div>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

const LastOwnerAlert = () => (
  <NewAlert csVariant="danger">
    You cannot currently leave this team as you are its last owner.
    <br />
    To leave the team, you need to assign another owner to it. Alternatively,
    you can disband the whole team.
  </NewAlert>
);

const TeamHasPackagesAlert = () => (
  <NewAlert csVariant="danger">
    You cannot currently disband this team as it has packages.
    <br />
    If you need to archive this team, contact #support in the{" "}
    <a href="https://discord.thunderstore.io/">Thunderstore Discord</a>.
  </NewAlert>
);

const NotTeamOwnerAlert = () => (
  <NewAlert csVariant="danger">Only team owners can disband teams.</NewAlert>
);

function LeaveTeamForm(props: {
  userName: string;
  teamName: string;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
  disabled?: boolean;
}) {
  const { userName, teamName, toast, updateTrigger, config, disabled } = props;
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
    <div className="team-settings__form">
      <div>
        <p className="team-settings__instructions">
          You are about to leave the team{" "}
          <span className="team-settings__text--bold">{teamName}</span>.
        </p>
        <p className="team-settings__instructions">
          If you are an owner of the team, you can only leave if the team has
          another owner assigned.
        </p>
      </div>
      <div className="team-settings__action-container">
        <NewButton
          csVariant="danger"
          rootClasses="team-settings__leave-and-disband-button"
          disabled={disabled}
          onClick={() =>
            kickMemberAction({
              config: config,
              params: { team_name: teamName, username: userName },
              queryParams: {},
              data: {},
            })
          }
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faTrashCan} />
          </NewIcon>
          Leave team
        </NewButton>
      </div>
    </div>
  );
}

LeaveTeamForm.displayName = "LeaveTeamForm";

function DisbandTeamForm(props: {
  teamName: string;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
  disabled?: boolean;
}) {
  const { teamName, toast, updateTrigger, config, disabled } = props;

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

  const formDisabled = formInputs.team_name !== teamName;

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
    Error,
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
    <div className="team-settings__form">
      <div>
        <p className="team-settings__instructions">
          You are about to disband the team{" "}
          <span className="team-settings__text--bold">{teamName}</span>.
        </p>
        <p className="team-settings__instructions">
          Be aware you can currently only disband teams with no packages. If you
          need to archive a team with existing packages, contact #support in the{" "}
          <a
            href="https://discord.thunderstore.io/"
            className="team-settings__link"
          >
            Thunderstore Discord
          </a>
          .
        </p>
        <p className="team-settings__instructions">
          As a precaution, to disband your team, please input{" "}
          <span className="team-settings__text--bold">{teamName}</span> into the
          field below.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!disabled && !formDisabled) {
              strongForm.submit();
            }
          }}
          className="disband-team-form__form"
        >
          <NewTextInput
            aria-label="Confirm team name to disband"
            value={formInputs.team_name}
            disabled={disabled}
            onChange={(e) =>
              updateFormFieldState({
                field: "team_name",
                value: e.target.value,
              })
            }
          />
        </form>
      </div>

      <div className="team-settings__action-container">
        <NewButton
          csVariant="danger"
          rootClasses="team-settings__leave-and-disband-button"
          disabled={disabled || formDisabled}
          onClick={() => {
            strongForm.submit();
          }}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faTrashCan} />
          </NewIcon>
          Disband team
        </NewButton>
      </div>
    </div>
  );
}

DisbandTeamForm.displayName = "DisbandTeamForm";
