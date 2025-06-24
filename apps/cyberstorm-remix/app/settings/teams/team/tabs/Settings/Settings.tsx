import {
  NewAlert,
  Modal,
  NewButton,
  NewIcon,
  NewLink,
} from "@thunderstore/cyberstorm";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { currentUserSchema } from "@thunderstore/dapper-ts";
import { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import {
  ApiError,
  // teamDisbandTeam,
  // teamRemoveMember,
} from "@thunderstore/thunderstore-api";
import {
  clearSession,
  getSessionCurrentUser,
  NamespacedStorageManager,
} from "@thunderstore/ts-api-react";
// import {
//   ApiForm,
//   teamDisbandFormSchema,
// } from "@thunderstore/ts-api-react-forms";
import { z } from "zod";
import { OutletContextShape } from "~/root";

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    const _storage = new NamespacedStorageManager("Session");
    const currentUser = getSessionCurrentUser(_storage, true, undefined, () => {
      clearSession(_storage);
      throw new Response("Your session has expired, please log in again", {
        status: 401,
      });
      // redirect("/");
    });

    if (
      !currentUser.username ||
      (currentUser.username && currentUser.username === "")
    ) {
      clearSession(_storage);
      throw new Response("Not logged in.", { status: 401 });
    }

    try {
      return {
        teamName: params.namespaceId,
        currentUser: currentUser as typeof currentUserSchema._type,
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

// REMIX TODO: Make sure user is redirected of this page, if the user is not logged in
export default function Settings() {
  const { teamName, currentUser } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  const leaveTeamToast = useFormToaster({
    successMessage: `${teamName} left `,
  });

  const disbandTeamToast = useFormToaster({
    successMessage: `${teamName} disbanded`,
  });

  return (
    <div className="settings-items">
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Leave team</p>
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
                {...{
                  popovertarget: "teamLeaveTeam",
                  popovertargetaction: "open",
                }}
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faTrashCan} />
                </NewIcon>
                Leave team
              </NewButton>
            }
          >
            {/* <ApiForm
              config={outletContext.requestConfig}
              onSubmitSuccess={leaveTeamToast.onSubmitSuccess}
              onSubmitError={leaveTeamToast.onSubmitError}
              schema={z.object({})}
              endpoint={teamRemoveMember}
              meta={{
                teamIdentifier: teamName,
                username: currentUser.username,
              }}
              formProps={{
                className: "nimbus-commonStyles-modalTempalate",
              }}
            >
              <div className="nimbus-commonStyles-modalTempalate__header">
                Leave team
              </div>
              <div className="nimbus-commonStyles-modalTempalate__content">
                You are about to leave the team{" "}
                <NewLink
                  primitiveType="cyberstormLink"
                  linkId="Team"
                  team={teamName}
                >
                  {currentUser.username}
                </NewLink>
              </div>
              <div className="nimbus-commonStyles-modalTempalate__footer">
                <FormSubmitButton csVariant="danger">
                  Leave team
                </FormSubmitButton>
              </div>
            </ApiForm> */}
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
          <p>You are about to disband the team {teamName}.</p>
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
                {...{
                  popovertarget: "teamDisbandTeam",
                  popovertargetaction: "open",
                }}
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faTrashCan} />
                </NewIcon>
                Disband team
              </NewButton>
            }
          >
            {/* <ApiForm
              config={outletContext.requestConfig}
              onSubmitSuccess={disbandTeamToast.onSubmitSuccess}
              onSubmitError={disbandTeamToast.onSubmitError}
              schema={teamDisbandFormSchema}
              endpoint={teamDisbandTeam}
              meta={{ teamIdentifier: teamName }}
              formProps={{
                className: "nimbus-commonStyles-modalTempalate",
              }}
            >
              <div className="nimbus-commonStyles-modalTempalate__header">
                Confirm disband team
              </div>
              <div className="nimbus-commonStyles-modalTempalate__content">
                <p>
                  As a precaution, to disband your team, please input {teamName}{" "}
                  into the field below.
                </p>
                <FormTextInput
                  schema={teamDisbandFormSchema}
                  name={"verification"}
                  placeholder={"Verification"}
                />
                <div>
                  You are about to disband the team{" "}
                  <NewLink
                    primitiveType="cyberstormLink"
                    linkId="Team"
                    team={teamName}
                  >
                    {teamName}
                  </NewLink>
                </div>
              </div>
              <div className="nimbus-commonStyles-modalTempalate__footer">
                <FormSubmitButton csVariant="danger">
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </NewIcon>
                  Disband team
                </FormSubmitButton>
              </div>
            </ApiForm> */}
          </Modal>
        </div>
      </div>
    </div>
  );
}
