import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";
import { createSeo } from "cyberstorm/utils/meta";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import { NewLink, Tabs } from "@thunderstore/cyberstorm";

import { type OutletContextShape } from "../../root";
import type { Route } from "./+types/Settings";
import "./Settings.css";

// Client loader to fetch current user for SEO titles and secure the route
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const tools = getSessionTools();
  const currentUser = await tools?.getSessionCurrentUser(true);
  const url = new URL(request.url);

  if (!currentUser?.username) {
    return redirectToLogin(url.pathname + url.search + url.hash);
  }

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
}

clientLoader.hydrate = true;

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
