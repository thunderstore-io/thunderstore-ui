import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  Await,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
  useRouteError,
} from "react-router";
import { NewAlert, NewLink, SkeletonBox, Tabs } from "@thunderstore/cyberstorm";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "../../../root";
import "./teamSettings.css";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { ApiError } from "@thunderstore/thunderstore-api";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { Suspense, useMemo } from "react";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import {
  isLoaderError,
  resolveLoaderPromise,
  type LoaderErrorPayload,
  type LoaderResult,
} from "cyberstorm/utils/errors/loaderResult";

type MaybePromise<T> = T | Promise<T>;

type TeamDetails = Awaited<ReturnType<DapperTs["getTeamDetails"]>>;

type LoaderData = {
  team: MaybePromise<LoaderResult<TeamDetails>>;
};

function isPromiseLike<T>(value: MaybePromise<T>): value is Promise<T> {
  return typeof value === "object" && value !== null && "then" in value;
}

export const meta: MetaFunction<typeof clientLoader> = ({ data }) => {
  const loaderData = data as LoaderData | undefined;
  const teamValue = loaderData?.team;
  const resolvedName =
    teamValue && !isPromiseLike(teamValue) && !isLoaderError(teamValue)
      ? teamValue.name
      : undefined;

  const title = resolvedName
    ? `${resolvedName} settings`
    : "Team settings | Thunderstore";

  return [
    { title },
    {
      name: "description",
      content: resolvedName ? `${resolvedName} settings` : "Team configuration",
    },
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
      const teamPromise = resolveLoaderPromise(
        dapper.getTeamDetails(params.namespaceId).catch((error) => {
          if (error instanceof ApiError && error.statusCode === 404) {
            throwUserFacingPayloadResponse({
              headline: "Team not found.",
              description: "We could not find the requested team.",
              category: "not_found",
              status: 404,
            });
          }
          throw error;
        })
      );

      return {
        team: teamPromise,
      } satisfies LoaderData;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        throwUserFacingPayloadResponse({
          headline: "Team not found.",
          description: "We could not find the requested team.",
          category: "not_found",
          status: 404,
        });
      }
      handleLoaderError(error);
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Team not found.",
    description: "We could not find the requested team.",
    category: "not_found",
    status: 404,
  });
}

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

export default function TeamSettingsRoute() {
  const { team } = useLoaderData<typeof clientLoader>() as LoaderData;
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  const resolvedTeamPromise = useMemo(() => {
    return Promise.resolve(team) as Promise<LoaderResult<TeamDetails>>;
  }, [team]);

  return (
    <Suspense fallback={<TeamSettingsSkeleton />}>
      <Await resolve={resolvedTeamPromise}>
        {(result) =>
          isLoaderError(result) ? (
            <TeamSettingsAwaitError payload={result.__error} />
          ) : (
            <TeamSettingsContent
              team={result}
              locationPathname={location.pathname}
              outletContext={outletContext}
            />
          )
        }
      </Await>
    </Suspense>
  );
}

interface TeamSettingsContentProps {
  team: TeamDetails;
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
 * Shows an inline alert when the team detail promise rejects during Suspense.
 */
function TeamSettingsAwaitError(props: { payload: LoaderErrorPayload }) {
  const { payload } = props;

  return (
    <NewAlert csVariant="danger">
      <strong>{payload.headline}</strong>
      {payload.description ? ` ${payload.description}` : ""}
    </NewAlert>
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

/**
 * Maps thrown loader errors to an alert for the team settings route.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <NewAlert csVariant="danger">
      <strong>{payload.headline}</strong>
      {payload.description ? ` ${payload.description}` : ""}
    </NewAlert>
  );
}
