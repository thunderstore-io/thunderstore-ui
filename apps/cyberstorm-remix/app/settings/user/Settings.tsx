import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { BreadCrumbs, CyberstormLink, Icon } from "@thunderstore/cyberstorm";
import tabsStyles from "./Tabs.module.css";
import styles from "./SettingsLayout.module.css";
import rootStyles from "../../RootLayout.module.css";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faCog } from "@fortawesome/free-solid-svg-icons";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader() {
  const dapper = await getDapper(true);
  const currentUser = await dapper.getCurrentUser();
  if (!currentUser.username) {
    throw new Response("Not logged in.", { status: 401 });
  }
  return { wowSuchData: undefined };
}

export function HydrateFallback() {
  return "Loading...";
}

export default function Community() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { wowSuchData } = useLoaderData<typeof clientLoader>();
  const location = useLocation();

  const currentTab = location.pathname.endsWith("/account/") ? "account" : "";

  return (
    <>
      <BreadCrumbs>
        <CyberstormLink linkId="Settings">Settings</CyberstormLink>
      </BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <div className={styles.header}>
          <PageHeader title="Settings" />
        </div>
      </header>
      <main className={rootStyles.main}>
        <div className={styles.tabContent}>
          <div className={tabsStyles.root}>
            <div className={tabsStyles.buttons}>
              <CyberstormLink
                linkId="Settings"
                aria-current={currentTab === ""}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faCircleNodes} />
                </Icon>
                <span className={tabsStyles.label}>Connections</span>
              </CyberstormLink>
              <CyberstormLink
                linkId="SettingsAccount"
                aria-current={currentTab === "account"}
                className={classnames(
                  tabsStyles.button,
                  currentTab === "account" ? tabsStyles.active : ""
                )}
              >
                <Icon inline wrapperClasses={tabsStyles.icon}>
                  <FontAwesomeIcon icon={faCog} />
                </Icon>
                <span className={tabsStyles.label}>Account</span>
              </CyberstormLink>
            </div>
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}
