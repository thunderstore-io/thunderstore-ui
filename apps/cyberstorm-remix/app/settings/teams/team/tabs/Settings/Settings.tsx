import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense, useReducer, useState } from "react";
import {
  Await,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";

import "./Settings.css";
import {
  NewAlert,
  Modal,
  NewButton,
  NewIcon,
  NewLink,
  NewTextInput,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  teamDisband,
  type TeamDisbandRequestData,
  teamRemoveMember,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

import { NotLoggedIn } from "app/commonComponents/NotLoggedIn/NotLoggedIn";
import { type OutletContextShape } from "app/root";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";

export const clientLoader = makeTeamSettingsTabLoader(
  // TODO: add end point for checking can leave/disband status.
  async (dapper, teamName) => ({ teamName })
);

export default function Settings() {
  const { teamName } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();
  const navigate = useNavigate();

  const currentUser = outletContext.currentUser?.username;
  if (!currentUser) return <NotLoggedIn />;

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
      <Await resolve={teamName}>
        {(resolvedTeamName) => (
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
                  If you are the owner of the team, you can only leave if the
                  team has another owner assigned.
                </p>
                <LeaveTeamForm
                  userName={currentUser}
                  teamName={resolvedTeamName}
                  toast={toast}
                  config={outletContext.requestConfig}
                  updateTrigger={moveToTeams}
                />
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
                <p>You are about to disband the team {resolvedTeamName}.</p>
                <p>
                  Be aware you can currently only disband teams with no
                  packages. If you need to archive a team with existing pages,
                  contact Mythic#0001 on the Thunderstore Discord.
                </p>
                <DisbandTeamForm
                  teamName={resolvedTeamName}
                  updateTrigger={moveToTeams}
                  config={outletContext.requestConfig}
                  toast={toast}
                />
              </div>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
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
      titleContent="Leave team"
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
            {teamName}
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
    // Check that the team name input matches the actual team name
    if (data.team_name !== teamName) {
      return Promise.reject(
        new Error("The team name you entered does not match.")
      );
    }

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
      titleContent="Disband team"
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
