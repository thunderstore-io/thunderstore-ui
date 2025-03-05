import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "@remix-run/react";
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
      const dapper = window.Dapper;
      return {
        team: await dapper.getTeamDetails(params.namespaceId),
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
        <Tabs
          tabItems={[
            {
              itemProps: {
                key: "profile",
                primitiveType: "cyberstormLink",
                linkId: "TeamSettings",
                team: team.name,
                "aria-current": currentTab === "profile",
                children: <>Profile</>,
              },
              current: currentTab === "profile",
            },
            {
              itemProps: {
                key: "members",
                primitiveType: "cyberstormLink",
                linkId: "TeamSettingsMembers",
                team: team.name,
                "aria-current": currentTab === "members",
                children: <>Members</>,
              },
              current: currentTab === "members",
            },
            {
              itemProps: {
                key: "service-accounts",
                primitiveType: "cyberstormLink",
                linkId: "TeamSettingsServiceAccounts",
                team: team.name,
                "aria-current": currentTab === "service-accounts",
                children: <>Service Accounts</>,
              },
              current: currentTab === "service-accounts",
            },
            {
              itemProps: {
                key: "settings",
                primitiveType: "cyberstormLink",
                linkId: "TeamSettingsSettings",
                team: team.name,
                "aria-current": currentTab === "settings",
                children: <>Settings</>,
              },
              current: currentTab === "settings",
            },
          ]}
          renderTabItem={(itemProps, numberSlate) => {
            const { key, children, ...fItemProps } = itemProps;
            return (
              <NewLink key={key} {...fItemProps}>
                {children}
                {numberSlate}
              </NewLink>
            );
          }}
        />
        <section>
          <Outlet context={outletContext} />
        </section>
      </div>
    </div>
  );
}
