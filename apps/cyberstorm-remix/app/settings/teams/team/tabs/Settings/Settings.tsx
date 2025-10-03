import "./Settings.css";
import {
  NewAlert,
  Modal,
  NewButton,
  NewIcon,
  NewLink,
  NewTextInput,
} from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useOutletContext, useParams } from "react-router";

import { type OutletContextShape } from "~/root";
import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import {
  RequestConfig,
  teamDisband,
  TeamDisbandRequestData,
  teamRemoveMember,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import { NotLoggedIn } from "~/commonComponents/NotLoggedIn/NotLoggedIn";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { useReducer } from "react";

// REMIX TODO: Make sure user is redirected of this page, if the user is not logged in
export default function Settings() {
  const params = useParams();
  const outletContext = useOutletContext() as OutletContextShape;

  if (
    !outletContext.currentUser ||
    !outletContext.currentUser.username ||
    !params.namespaceId
  )
    return <NotLoggedIn />;

  if (!params.namespaceId) return <p>Team not found</p>;

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
    <div className="settings-items">
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Leave team</p>
          <p className="settings-items__description">Leave your team</p>
        </div>
        <div className="settings-items__content">
          <NewAlert csVariant="danger">
            You cannot currently leave this team as you are it&apos;s last
            owner.
          </NewAlert>
          <p>
            If you are the owner of the team, you can only leave if the team has
            another owner assigned.
          </p>
          <Modal
            popoverId={"teamLeaveTeam"}
            csSize="small"
            trigger={
              <NewButton
                popoverTarget="teamLeaveTeam"
                popoverTargetAction="show"
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
            <LeaveTeamForm
              userName={outletContext.currentUser.username}
              teamName={params.namespaceId}
              toast={toast}
              config={outletContext.requestConfig}
              updateTrigger={moveToTeams}
            />
          </Modal>
        </div>
      </div>
      <div className="settings-items__separator" />
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Disband team</p>
          <p className="settings-items__description">
            Disband your team completely
          </p>
        </div>
        <div className="settings-items__content">
          <NewAlert csVariant="danger">
            You cannot currently disband this team as it has packages.
          </NewAlert>
          <p>You are about to disband the team {params.namespaceId}.</p>
          <p>
            Be aware you can currently only disband teams with no packages. If
            you need to archive a team with existing pages, contact Mythic#0001
            on the Thunderstore Discord.
          </p>
          <Modal
            popoverId={"teamDisbandTeam"}
            csSize="small"
            trigger={
              <NewButton
                popoverTarget="teamDisbandTeam"
                popoverTargetAction="show"
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
            <DisbandTeamForm
              teamName={params.namespaceId}
              updateTrigger={moveToTeams}
              config={outletContext.requestConfig}
              toast={toast}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}

function LeaveTeamForm(props: {
  userName: string;
  teamName: string;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}) {
  const { userName, teamName, toast, updateTrigger, config } = props;
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
    <div className="modal-content">
      <div className="modal-content__header">Leave team</div>
      <div className="modal-content__body">
        <div>
          You are about to leave the team{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Team"
            team={teamName}
            csVariant="cyber"
          >
            {teamName}
          </NewLink>
        </div>
      </div>
      <div className="modal-content__footer">
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
}) {
  const { teamName, toast, updateTrigger, config } = props;

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
    <div className="modal-content">
      <div className="modal-content__header">Disband team</div>
      <div className="modal-content__body">
        <div>
          You are about to disband the team{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Team"
            team={teamName}
            csVariant="cyber"
          >
            {teamName}
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
      </div>
      <div className="modal-content__footer">
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
      </div>
    </div>
  );
}

LeaveTeamForm.displayName = "LeaveTeamForm";
