import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { BreadCrumbs, CyberstormLink, Icon } from "@thunderstore/cyberstorm";
import tabsStyles from "./Tabs.module.css";
import styles from "./teamSettingsLayout.module.css";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiError } from "@thunderstore/thunderstore-api";
import {
  faFileLines,
  faFolderPlus,
  faCodeBranch,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

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
      const dapper = await getDapper(true);
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
  return "Loading...";
}

export default function Community() {
  const { team } = useLoaderData<typeof clientLoader>();
  const location = useLocation();

  const currentTab = location.pathname.endsWith("/settings")
    ? "settings"
    : location.pathname.endsWith("/members")
      ? "members"
      : location.pathname.endsWith("/service-accounts")
        ? "service-accounts"
        : "profile";

  return (
    <>
      <BreadCrumbs>
        <CyberstormLink linkId="Teams">Teams</CyberstormLink>
        {team.name}
      </BreadCrumbs>
      <header className="nimbus-root__page-header">
        <div className={styles.header}>
          <PageHeader title="Teams" />
        </div>
      </header>
      <main className="nimbus-root__main">
        <div className={styles.teamContainer}>
          <div className={tabsStyles.root}>
            <div className={tabsStyles.buttons}>
              <CyberstormLink
                linkId="TeamSettings"
                team={team.name}
                aria-current={currentTab === "profile"}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "profile" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faFileLines} />
                </Icon>
                <span className={tabsStyles.label}>Profile</span>
              </CyberstormLink>
              <CyberstormLink
                linkId="TeamSettingsMembers"
                team={team.name}
                aria-current={currentTab === "members"}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "members" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faBook} />
                </Icon>
                <span className={tabsStyles.label}>Members</span>
              </CyberstormLink>
              <CyberstormLink
                linkId="TeamSettingsServiceAccounts"
                team={team.name}
                aria-current={currentTab === "service-accounts"}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "service-accounts" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faFolderPlus} />
                </Icon>
                <span className={tabsStyles.label}>Service Accounts</span>
              </CyberstormLink>
              <CyberstormLink
                linkId="TeamSettingsSettings"
                team={team.name}
                aria-current={currentTab === "settings"}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "settings" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faCodeBranch} />
                </Icon>
                <span className={tabsStyles.label}>Settings</span>
              </CyberstormLink>
            </div>
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}
