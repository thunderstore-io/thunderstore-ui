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
        <Tabs
          tabItems={[
            {
              itemProps: {
                primitiveType: "cyberstormLink",
                linkId: "TeamSettings",
                team: team.name,
                "aria-current": currentTab === "profile",
                children: <>Profile</>,
              } as React.ComponentPropsWithRef<typeof NewLink>,
              key: "profile",
              current: currentTab === "profile",
            },
            {
              itemProps: {
                primitiveType: "cyberstormLink",
                linkId: "TeamSettingsMembers",
                team: team.name,
                "aria-current": currentTab === "members",
                children: <>Members</>,
              } as React.ComponentPropsWithRef<typeof NewLink>,
              key: "members",
              current: currentTab === "members",
            },
            {
              itemProps: {
                primitiveType: "cyberstormLink",
                linkId: "TeamSettingsServiceAccounts",
                team: team.name,
                "aria-current": currentTab === "service-accounts",
                children: <>Service Accounts</>,
              } as React.ComponentPropsWithRef<typeof NewLink>,
              key: "service-accounts",
              current: currentTab === "service-accounts",
            },
            {
              itemProps: {
                primitiveType: "cyberstormLink",
                linkId: "TeamSettingsSettings",
                team: team.name,
                "aria-current": currentTab === "settings",
                children: <>Settings</>,
              } as React.ComponentPropsWithRef<typeof NewLink>,
              key: "settings",
              current: currentTab === "settings",
            },
          ]}
          renderTabItem={(key, itemProps, numberSlate) => {
            const { children, ...fItemProps } =
              itemProps as React.ComponentPropsWithRef<typeof NewLink>;
            return (
              <NewLink
                key={key}
                {...(fItemProps as React.ComponentProps<typeof NewLink>)}
              >
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
