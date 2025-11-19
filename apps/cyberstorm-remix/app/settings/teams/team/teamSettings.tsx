import { PageHeader } from "app/commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "app/root";
import { NimbusDefaultRouteErrorBoundary } from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { Outlet, useLocation, useOutletContext, useParams } from "react-router";

import { NewLink, Tabs } from "@thunderstore/cyberstorm";

import "./teamSettings.css";

export default function TeamSettingsRoute() {
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;
  const teamName = useParams().namespaceId ?? "";

  return (
    <TeamSettingsContent
      teamName={teamName}
      locationPathname={location.pathname}
      outletContext={outletContext}
    />
  );
}

interface TeamSettingsContentProps {
  teamName: string;
  locationPathname: string;
  outletContext: OutletContextShape;
}

/**
 * Displays the team settings tabs once loader data resolves on the client.
 */
function TeamSettingsContent({
  teamName,
  outletContext,
}: TeamSettingsContentProps) {
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

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
