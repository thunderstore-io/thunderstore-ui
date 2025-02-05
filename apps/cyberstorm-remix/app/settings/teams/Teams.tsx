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
import { CreateTeamForm } from "@thunderstore/cyberstorm-forms";
import { currentUserSchema } from "@thunderstore/dapper-ts";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import "./Teams.css";
import {
  clearSession,
  getConfig,
  getSessionCurrentUser,
  NamespacedStorageManager,
} from "@thunderstore/ts-api-react";

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
    <div className="ts-container ts-container--y ts-container--full nimbus-root__content">
      <NewBreadCrumbs>
        <NewLink primitiveType="cyberstormLink" linkId="Teams">
          Teams
        </NewLink>
      </NewBreadCrumbs>
      <PageHeader heading="Teams" headingLevel="1" headingSize="2" />
      <section className="ts-container ts-container--y ts-container--full nimbus-settings-teams">
        <div className="ts-container ts-container--x ts-container--full __row">
          <div className="__meta">
            <p className="__title">Teams</p>
            <p className="__description">Manage your teams</p>
            <Modal
              popoverId={"teamsCreateTeam"}
              csSize="small"
              title="Create Team"
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
              <CreateTeamForm
                config={() => config}
                updateTrigger={createTeamRevalidate}
              />
            </Modal>
          </div>
          <div className="__content">
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
