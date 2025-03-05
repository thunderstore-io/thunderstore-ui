import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import {
  Modal,
  NewBreadCrumbs,
  NewButton,
  NewIcon,
  NewLink,
  NewTable,
} from "@thunderstore/cyberstorm";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { currentUserSchema } from "@thunderstore/dapper-ts";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  clearSession,
  getConfig,
  getSessionCurrentUser,
  NamespacedStorageManager,
} from "@thunderstore/ts-api-react";
import {
  ApiForm,
  createTeamFormSchema,
} from "@thunderstore/ts-api-react-forms";
import { createTeam } from "../../../../../packages/thunderstore-api/src";

export const meta: MetaFunction<typeof clientLoader> = ({ data }) => {
  return [
    { title: `Teams of ${data?.currentUser.username}` },
    { name: "description", content: `Teams of ${data?.currentUser.username}` },
  ];
};

export async function clientLoader() {
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
  } else {
    return {
      config: getConfig(_storage),
      currentUser: currentUser as typeof currentUserSchema._type,
    };
  }
}

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

export default function Teams() {
  const { config, currentUser } = useLoaderData<typeof clientLoader>();
  const revalidator = useRevalidator();
  const [isRefetching, setIsRefetching] = useState(false);

  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: "Team created",
  });

  useEffect(() => {
    setIsRefetching(false);
  }, [currentUser]);

  async function createTeamRevalidate() {
    if (!isRefetching) {
      setIsRefetching(true);
      revalidator.revalidate();
    }
  }

  return (
    <div className="container container--y container--full layout__content">
      <NewBreadCrumbs>
        <span>
          <span>Teams</span>
        </span>
      </NewBreadCrumbs>
      <PageHeader heading="Teams" headingLevel="1" headingSize="2" />
      <section className="settings-items">
        <div className="settings-items__item">
          <div className="settings-items__meta">
            <p className="settings-items__title">Teams</p>
            <p className="settings-items__description">Manage your teams</p>
            <Modal
              popoverId={"teamsCreateTeam"}
              csSize="small"
              trigger={
                <NewButton
                  {...{
                    popovertarget: "teamsCreateTeam",
                    popovertargetaction: "open",
                  }}
                >
                  Create Team
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faPlus} />
                  </NewIcon>
                </NewButton>
              }
            >
              <ApiForm
                config={() => config}
                onSubmitSuccess={() => {
                  createTeamRevalidate();
                  onSubmitSuccess();
                }}
                onSubmitError={onSubmitError}
                schema={createTeamFormSchema}
                meta={{}}
                endpoint={createTeam}
                formProps={{ className: "nimbus-commonStyles-modalTempalate" }}
              >
                <div className="nimbus-commonStyles-modalTempalate__header">
                  Create team
                </div>
                <div className="nimbus-commonStyles-modalTempalate__content">
                  <div>
                    Enter the name of the team you wish to create. Team names
                    can contain the characters a-z A-Z 0-9 _ and must not start
                    or end with an _
                  </div>
                  <div>
                    <FormTextInput
                      schema={createTeamFormSchema}
                      name={"name"}
                      placeholder={"ExampleName"}
                    />
                  </div>
                </div>
                <div className="nimbus-commonStyles-modalTempalate__footer">
                  <FormSubmitButton>Create</FormSubmitButton>
                </div>
              </ApiForm>
            </Modal>
          </div>
          <div className="settings-items__content">
            <NewTable
              csModifiers={["alignLastColumnRight"]}
              headers={[
                { value: "Team Name", disableSort: false },
                { value: "Role", disableSort: false },
                { value: "Members", disableSort: false },
              ]}
              rows={currentUser.teams.map((team) => [
                {
                  value: (
                    <NewLink
                      primitiveType="cyberstormLink"
                      linkId="TeamSettings"
                      key={team.name}
                      team={team.name}
                      csVariant="cyber"
                    >
                      {team.name}
                    </NewLink>
                  ),
                  sortValue: team.name,
                },
                {
                  value: team.role,
                  sortValue: team.role,
                },
                {
                  value: team.member_count,
                  sortValue: team.member_count,
                },
              ])}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
