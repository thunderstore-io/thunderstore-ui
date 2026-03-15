import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Outlet, useLocation, useOutletContext, useParams } from "react-router";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "~/root";

import { NewLink, Tabs } from "@thunderstore/cyberstorm";

import type { Route } from "./+types/teamSettings";
import "./teamSettings.css";

export const loader = ssrLoader(
  async ({ params, request }: Route.LoaderArgs) => {
    const teamName = params.namespaceId ?? "";
    const url = new URL(request.url);

    return {
      seo: createSeo({
        descriptors: [
          { title: `Team ${teamName} settings | Thunderstore` },
          { name: "description", content: `Manage ${teamName} team settings` },
          { property: "og:type", content: "website" },
          { property: "og:url", content: url.href },
          {
            property: "og:title",
            content: `Team ${teamName} settings | Thunderstore`,
          },
          {
            property: "og:description",
            content: `Manage ${teamName} team settings`,
          },
          { property: "og:site_name", content: "Thunderstore" },
        ],
      }),
    };
  }
);

export default function TeamSettings() {
  const teamName = useParams().namespaceId ?? "";
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  const parts = location.pathname.split("/");
  const currentTab = parts.length === 4 ? parts[3] : "profile";

  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        {teamName}
      </PageHeader>
      <div className="team-settings">
        <Tabs>
          <NewLink
            key="profile"
            primitiveType="cyberstormLink"
            linkId="TeamSettings"
            team={teamName}
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
            team={teamName}
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
            team={teamName}
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
            team={teamName}
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
    </>
  );
}
