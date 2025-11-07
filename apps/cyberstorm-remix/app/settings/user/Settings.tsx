import "./Settings.css";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { NewLink, Tabs } from "@thunderstore/cyberstorm";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "../../root";
import "./Settings.css";
import {
  NimbusErrorBoundary,
  NimbusErrorBoundaryFallback,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import type { NimbusErrorBoundaryFallbackProps } from "cyberstorm/utils/errors/NimbusErrorBoundary";

export default function UserSettings() {
  const context = useOutletContext<OutletContextShape>();
  const { pathname } = useLocation();
  const currentTab = pathname.endsWith("/account/") ? "account" : "settings";

  function tabClass(tab: string) {
    return `tabs-item${currentTab === tab ? " tabs-item--current" : ""}`;
  }

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
