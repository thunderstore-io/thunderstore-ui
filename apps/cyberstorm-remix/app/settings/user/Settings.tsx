import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import { NewLink, Tabs } from "@thunderstore/cyberstorm";

import { type OutletContextShape } from "../../root";
import type { Route } from "./+types/Settings";
import "./Settings.css";

export const loader = ssrLoader(async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  return {
    seo: createSeo({
      descriptors: [
        { title: "Settings | Thunderstore" },
        {
          name: "description",
          content: "Manage your Thunderstore account settings",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url.href },
        { property: "og:title", content: "Settings | Thunderstore" },
        {
          property: "og:description",
          content: "Manage your Thunderstore account settings",
        },
        { property: "og:site_name", content: "Thunderstore" },
      ],
    }),
  };
});

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
