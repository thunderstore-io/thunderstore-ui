import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import {
  BreadCrumbs,
  CyberstormLink,
  Icon,
  PageHeader,
} from "@thunderstore/cyberstorm";
import tabsStyles from "./Tabs.module.css";
import styles from "./SettingsLayout.module.css";
import rootStyles from "../../RootLayout.module.css";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faCog } from "@fortawesome/free-solid-svg-icons";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: "Settings" }, { name: "description", content: "Settings" }];
};

// REMIX TODO: Since the server loader has to exist for whatever reason?
// We have to return empty list for the members
// as permissions are needed for retrieving that data
// which the server doesn't have
// Fix this to not be stupid
export async function loader() {
  return { wowSuchData: undefined };
}

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader() {
  const dapper = await getDapper(true);
  const currentUser = await dapper.getCurrentUser();
  if (!currentUser.username) {
    throw new Response("Not logged in.", { status: 401 });
  }
  return { wowSuchData: undefined };
}

clientLoader.hydrate = true;

export default function Community() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { wowSuchData } = useLoaderData<typeof loader | typeof clientLoader>();
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
