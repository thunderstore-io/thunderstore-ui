import { Outlet, useLocation, useOutletContext } from "react-router";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import { NewLink, Tabs } from "@thunderstore/cyberstorm";

import { type OutletContextShape } from "../../root";
import "./Settings.css";

export default function UserSettings() {
  const context = useOutletContext<OutletContextShape>();
  const { pathname } = useLocation();
  const currentTab = pathname.endsWith("/account/") ? "account" : "settings";

  function tabClass(tab: string) {
    return `tabs-item${currentTab === tab ? " tabs-item--current" : ""}`;
  }

  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        Settings
      </PageHeader>

      <div className="settings-user">
        <Tabs>
          <NewLink
            key="settings"
            primitiveType="cyberstormLink"
            linkId="Settings"
            aria-current={currentTab === "settings"}
            rootClasses={tabClass("settings")}
          >
            Settings
          </NewLink>
          <NewLink
            key="account"
            primitiveType="cyberstormLink"
            linkId="SettingsAccount"
            aria-current={currentTab === "account"}
            rootClasses={tabClass("account")}
          >
            Account
          </NewLink>
        </Tabs>

        <section className="settings-user__body">
          <Outlet context={context} />
        </section>
      </div>
    </>
  );
}
