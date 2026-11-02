import { getCanonicalUrl } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useOutletContext, useParams } from "react-router";
import { Page } from "~/commonComponents/Page/Page";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "~/root";

import { NewButton, NewLink, Tabs } from "@thunderstore/cyberstorm";
import { type TeamCommunity } from "@thunderstore/thunderstore-api";

import type { Route } from "./+types/teamSettings";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

export async function loader({ params, request }: Route.LoaderArgs) {
  const teamName = params.namespaceId ?? "";

  return {
    seo: createSeo({
      descriptors: [
        { title: `Team settings for ${teamName} · Thunderstore` },
        { name: "description", content: `Manage ${teamName} team settings` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: getCanonicalUrl(request) },
        {
          property: "og:title",
          content: `Team settings for ${teamName}`,
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

export default function TeamSettings() {
  const teamName = useParams().namespaceId ?? "";
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  const parts = location.pathname.split("/");
  const currentTab = parts.length === 4 ? parts[3] : "profile";

  const [communities, setCommunities] = useState<TeamCommunity[] | null>(null);

  useEffect(() => {
    let isCurrent = true;
    setCommunities(null);
    outletContext.dapper
      .getTeamCommunities(teamName)
      .then((result) => {
        if (isCurrent) {
          setCommunities(result);
        }
      })
      // The header link is optional, so a failed fetch just leaves it out
      .catch(() => {});

    return () => {
      isCurrent = false;
    };
  }, [outletContext.dapper, teamName]);

  return (
    <Page>
      <PageHeader
        headingLevel="1"
        headingSize="2"
        meta={<PublicPageLink teamName={teamName} communities={communities} />}
      >
        {teamName}
      </PageHeader>
      <div className="settings-page">
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
            key="communities"
            primitiveType="cyberstormLink"
            linkId="TeamSettingsCommunities"
            team={teamName}
            aria-current={currentTab === "communities"}
            rootClasses={`tabs-item${
              currentTab === "communities" ? " tabs-item--current" : ""
            }`}
          >
            Communities
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
        <section className="settings-page__body">
          <Outlet context={outletContext} />
        </section>
      </div>
    </Page>
  );
}

/**
 * Header link to the team's public page. Links straight to the page when the
 * team is in a single community, and to the Communities tab when it is in
 * several
 *
 * @param props.teamName The name of the team
 * @param props.communities The team's communities, or null while loading
 * @returns The link, or null when there is no public page to link to
 */
function PublicPageLink(props: {
  teamName: string;
  communities: TeamCommunity[] | null;
}) {
  const { teamName, communities } = props;

  if (!communities || communities.length === 0) {
    return null;
  }

  if (communities.length === 1) {
    return (
      <NewButton
        primitiveType="cyberstormLink"
        linkId="Team"
        community={communities[0].identifier}
        team={teamName}
        csVariant="secondary"
      >
        View public page
      </NewButton>
    );
  }

  return (
    <NewButton
      primitiveType="cyberstormLink"
      linkId="TeamSettingsCommunities"
      team={teamName}
      csVariant="secondary"
    >
      View public pages
    </NewButton>
  );
}
