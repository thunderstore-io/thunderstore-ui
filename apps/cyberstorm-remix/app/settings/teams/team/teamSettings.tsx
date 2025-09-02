import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "react-router";
import {
  NewBreadCrumbs,
  NewBreadCrumbsLink,
  NewLink,
  Tabs,
} from "@thunderstore/cyberstorm";
import { ApiError } from "@thunderstore/thunderstore-api";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { OutletContextShape } from "../../../root";
import "./teamSettings.css";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";

export const meta: MetaFunction<typeof clientLoader> = ({ data }) => {
  return [
    { title: `${data?.team.name} settings` },
    { name: "description", content: `${data?.team.name} settings` },
  ];
};

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    try {
      const tools = getSessionTools();
      const config = tools?.getConfig();
      const dapper = new DapperTs(() => {
        return {
          apiHost: config?.apiHost,
          sessionId: config?.sessionId,
        };
      });
      return {
        team: await dapper.getTeamDetails(params.namespaceId),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Team not found", { status: 404 });
      } else {
        throw error;
      }
    }
  }
  throw new Response("Team not found", { status: 404 });
}

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

export default function Community() {
  const { team } = useLoaderData<typeof clientLoader>();
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  const currentTab = location.pathname.endsWith("/settings")
    ? "settings"
    : location.pathname.endsWith("/members")
      ? "members"
      : location.pathname.endsWith("/service-accounts")
        ? "service-accounts"
        : "profile";

  return (
    <div className="container container--y container--full layout__content">
      <NewBreadCrumbs>
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Teams"
          csVariant="cyber"
        >
          Teams
        </NewBreadCrumbsLink>
        <span>
          <span>{team.name}</span>
        </span>
      </NewBreadCrumbs>
      <PageHeader headingLevel="1" headingSize="2">
        {team.name}
      </PageHeader>
      <div className="team-settings">
        <Tabs>
          <NewLink
            key="profile"
            primitiveType="cyberstormLink"
            linkId="TeamSettings"
            team={team.name}
            aria-current={currentTab === "profile"}
            rootClasses={`tabs-item${
              currentTab === "profile" ? " tabs-item--current" : ""
            }`}
          >
            Profile
          </NewLink>
          <NewLink
            key="members"
            primitiveType="cyberstormLink"
            linkId="TeamSettingsMembers"
            team={team.name}
            aria-current={currentTab === "members"}
            rootClasses={`tabs-item${
              currentTab === "members" ? " tabs-item--current" : ""
            }`}
          >
            Members
          </NewLink>
          <NewLink
            key="service-accounts"
            primitiveType="cyberstormLink"
            linkId="TeamSettingsServiceAccounts"
            team={team.name}
            aria-current={currentTab === "service-accounts"}
            rootClasses={`tabs-item${
              currentTab === "service-accounts" ? " tabs-item--current" : ""
            }`}
          >
            Service Accounts
          </NewLink>
          <NewLink
            key="settings"
            primitiveType="cyberstormLink"
            linkId="TeamSettingsSettings"
            team={team.name}
            aria-current={currentTab === "settings"}
            rootClasses={`tabs-item${
              currentTab === "settings" ? " tabs-item--current" : ""
            }`}
          >
            Settings
          </NewLink>
        </Tabs>
        <section>
          <Outlet context={outletContext} />
        </section>
      </div>
    </div>
  );
}
