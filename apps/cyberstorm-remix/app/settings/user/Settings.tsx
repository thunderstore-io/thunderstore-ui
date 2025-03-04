import {
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "@remix-run/react";
import { NewBreadCrumbs, NewLink, Tabs } from "@thunderstore/cyberstorm";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  clearSession,
  getSessionCurrentUser,
  NamespacedStorageManager,
} from "@thunderstore/ts-api-react";
import { currentUserSchema } from "@thunderstore/dapper-ts";
import { OutletContextShape } from "../../root";
import "./Settings.css";

export async function clientLoader() {
  const _storage = new NamespacedStorageManager("Session");
  const currentUser = getSessionCurrentUser(_storage, true, undefined, () => {
    clearSession(_storage);
    throw new Response("Your session has expired, please log in again", {
      status: 401,
    });
    // redirect("/");
  });

  if (
    !currentUser.username ||
    (currentUser.username && currentUser.username === "")
  ) {
    clearSession(_storage);
    throw new Response("Not logged in.", { status: 401 });
  } else {
    return {
      currentUser: currentUser as typeof currentUserSchema._type,
    };
  }
}

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

export default function Community() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentUser } = useLoaderData<typeof clientLoader>();
  const location = useLocation();
  const outletContext = useOutletContext() as OutletContextShape;

  const currentTab = location.pathname.endsWith("/account/")
    ? "account"
    : "settings";

  return (
    <div className="container container--y container--full layout__content">
      <NewBreadCrumbs>
        <span>
          <span>{currentUser.username}</span>
        </span>
      </NewBreadCrumbs>
      <PageHeader headingLevel="1" headingSize="2">
        Settings
      </PageHeader>
      <div className="settings-user">
        <Tabs
          tabItems={[
            {
              itemProps: {
                key: "settings",
                primitiveType: "cyberstormLink",
                linkId: "Settings",
                "aria-current": currentTab === "settings",
                children: <>Settings</>,
              },
              current: currentTab === "settings",
            },
            {
              itemProps: {
                key: "account",
                primitiveType: "cyberstormLink",
                linkId: "SettingsAccount",
                "aria-current": currentTab === "account",
                children: <>Account</>,
              },
              current: currentTab === "account",
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
        <section className="settings-user__body">
          <Outlet context={outletContext} />
        </section>
      </div>
    </div>
  );
}
