import { Outlet, useLocation, useOutletContext } from "react-router";
import { NewLink, Tabs } from "@thunderstore/cyberstorm";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import { type OutletContextShape } from "../../root";
import "./Settings.css";
import { NotLoggedIn } from "~/commonComponents/NotLoggedIn/NotLoggedIn";
import {
  NimbusErrorBoundary,
  NimbusErrorBoundaryFallback,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import type { NimbusErrorBoundaryFallbackProps } from "cyberstorm/utils/errors/NimbusErrorBoundary";

// export async function clientLoader() {
//   const _storage = new NamespacedStorageManager(SESSION_STORAGE_KEY);
//   const currentUser = getSessionCurrentUser(_storage, true, undefined, () => {
//     clearSession(_storage);
//     throw new Response("Your session has expired, please log in again", {
//       status: 401,
//     });
//     // redirect("/");
//   });

//   if (
//     !currentUser.username ||
//     (currentUser.username && currentUser.username === "")
//   ) {
//     clearSession(_storage);
//     throw new Response("Not logged in.", { status: 401 });
//   } else {
//     return {
//       currentUser: currentUser as typeof currentUserSchema._type,
//     };
//   }
// }

// export function HydrateFallback() {
//   return <div style={{ padding: "32px" }}>Loading...</div>;
// }

export default function Community() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { currentUser } = useLoaderData<typeof clientLoader>();
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  if (!outletContext.currentUser || !outletContext.currentUser.username)
    return <NotLoggedIn />;

  const currentTab = location.pathname.endsWith("/account/")
    ? "account"
    : "settings";

  return (
    <NimbusErrorBoundary
      fallback={UserSettingsFallback}
      onRetry={({ reset }) => reset()}
    >
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
            rootClasses={`tabs-item${
              currentTab === "settings" ? " tabs-item--current" : ""
            }`}
          >
            Settings
          </NewLink>
          <NewLink
            key="account"
            primitiveType="cyberstormLink"
            linkId="SettingsAccount"
            aria-current={currentTab === "account"}
            rootClasses={`tabs-item${
              currentTab === "account" ? " tabs-item--current" : ""
            }`}
          >
            Account
          </NewLink>
        </Tabs>
        <section className="settings-user__body">
          <Outlet context={outletContext} />
        </section>
      </div>
    </NimbusErrorBoundary>
  );
}

/**
 * Provides fallback messaging when the user settings shell fails to render.
 */
function UserSettingsFallback(props: NimbusErrorBoundaryFallbackProps) {
  const {
    title = "Settings failed to load",
    description = "Reload the settings page or return to the dashboard.",
    retryLabel = "Reload",
    ...rest
  } = props;

  return (
    <NimbusErrorBoundaryFallback
      {...rest}
      title={title}
      description={description}
      retryLabel={retryLabel}
    />
  );
}
