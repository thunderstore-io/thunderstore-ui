import type { LoaderFunctionArgs } from "react-router";
import {
  Await,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "react-router";
import { NewLink, SkeletonBox, Tabs } from "@thunderstore/cyberstorm";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { type OutletContextShape } from "../../../root";
import "./teamSettings.css";
import { DapperTs } from "@thunderstore/dapper-ts";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { Suspense } from "react";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    const { dapper } = getLoaderTools();
    return {
      team: dapper.getTeamDetails(params.namespaceId),
    };
  }
  throwUserFacingPayloadResponse({
    headline: "Team not found.",
    description: "We could not find the requested team.",
    category: "not_found",
    status: 404,
  });
}

export default function TeamSettingsRoute() {
  const { team } = useLoaderData<typeof clientLoader>();
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <Suspense fallback={<TeamSettingsSkeleton />}>
      <Await resolve={team} errorElement={<NimbusAwaitErrorElement />}>
        {(result) => (
          <TeamSettingsContent
            team={result}
            locationPathname={location.pathname}
            outletContext={outletContext}
          />
        )}
      </Await>
    </Suspense>
  );
}

interface TeamSettingsContentProps {
  team: Awaited<ReturnType<DapperTs["getTeamDetails"]>>;
  locationPathname: string;
  outletContext: OutletContextShape;
}

/**
 * Displays the team settings tabs once loader data resolves on the client.
 */
function TeamSettingsContent({
  team,
  locationPathname,
  outletContext,
}: TeamSettingsContentProps) {
  const currentTab = locationPathname.endsWith("/settings")
    ? "settings"
    : locationPathname.endsWith("/members")
      ? "members"
      : locationPathname.endsWith("/service-accounts")
        ? "service-accounts"
        : "profile";

  return (
    <>
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
    </>
  );
}

/**
 * Displays a lightweight skeleton while team details load on the client.
 */
function TeamSettingsSkeleton() {
  return (
    <div className="team-settings">
      <SkeletonBox className="team-settings__skeleton" />
    </div>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}
