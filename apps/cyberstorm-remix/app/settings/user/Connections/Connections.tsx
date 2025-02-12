import { NewLink } from "@thunderstore/cyberstorm";

import { currentUserSchema } from "@thunderstore/dapper-ts";
import { useLoaderData } from "@remix-run/react";
import { buildAuthLoginUrl } from "cyberstorm/utils/ThunderstoreAuth";
import {
  clearSession,
  getConfig,
  getSessionCurrentUser,
  NamespacedStorageManager,
} from "@thunderstore/ts-api-react";
import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import {
  useApiForm,
  userLinkedAccountDisconnectFormSchema,
} from "@thunderstore/ts-api-react-forms";
import { userLinkedAccountDisconnect } from "../../../../../../packages/thunderstore-api/src";

import { Connection } from "~/commonComponents/Connection/Connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { OverwolfLogo } from "@thunderstore/cyberstorm/src/svg/svg";

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
      config: getConfig(_storage),
      currentUser: currentUser as typeof currentUserSchema._type,
    };
  }
}

export function HydrateFallback() {
  return "Loading...";
}

type ProvidersType = {
  name: string;
  identifier: "discord" | "github" | "overwolf";
  icon: JSX.Element;
}[];

export const PROVIDERS: ProvidersType = [
  {
    name: "Discord",
    identifier: "discord",
    icon: <FontAwesomeIcon icon={faDiscord} />,
  },
  {
    name: "Github",
    identifier: "github",
    icon: <FontAwesomeIcon icon={faGithub} />,
  },
  { name: "Overwolf", identifier: "overwolf", icon: OverwolfLogo() },
];

export default function Connections() {
  const { config, currentUser } = useLoaderData<typeof clientLoader>();

  const toast = useToast();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitSuccess = (_r: unknown) => {
    toast.addToast({
      csVariant: "success",
      children: <>User {currentUser.username} was disconnected from TODO</>,
      duration: 30000,
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitError = (_e: unknown) => {
    toast.addToast({
      csVariant: "danger",
      children: <>Unknown error occurred. The error has been logged</>,
    });
  };

  const { submitHandler } = useApiForm({
    schema: userLinkedAccountDisconnectFormSchema,
    meta: {},
    endpoint: userLinkedAccountDisconnect,
  });

  const onSubmit = async (
    data: typeof userLinkedAccountDisconnectFormSchema._type
  ) => {
    try {
      const result = await submitHandler(() => config, data);
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
    } catch (e) {
      if (onSubmitError) {
        onSubmitError(e);
      } else {
        throw e;
      }
    }
  };

  return (
    <div className="settings-items">
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Connections</p>
          <p className="settings-items__description">
            This information will not be shared outside of Thunderstore. Read
            more on our{" "}
            <NewLink primitiveType="cyberstormLink" linkId="PrivacyPolicy">
              Privacy Policy
            </NewLink>
            .
          </p>
        </div>
        <div className="settings-items__content">
          {PROVIDERS.map((p) => (
            <Connection
              key={p.name}
              icon={p.icon}
              name={p.name}
              identifier={p.identifier}
              connection={currentUser.connections?.find(
                (c) => c.provider.toLowerCase() === p.identifier
              )}
              connectionLink={buildAuthLoginUrl({ type: p.identifier })}
              disconnectFunction={onSubmit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

Connections.displayName = "Connections";
