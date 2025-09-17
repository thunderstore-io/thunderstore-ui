import { NewLink } from "@thunderstore/cyberstorm";

import { useOutletContext } from "react-router";
import { buildAuthLoginUrl } from "cyberstorm/utils/ThunderstoreAuth";

import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import { userLinkedAccountDisconnect } from "../../../../../../packages/thunderstore-api/src";

import { Connection } from "~/commonComponents/Connection/Connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { OverwolfLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import { ReactElement } from "react";
import { OutletContextShape } from "~/root";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import { NotLoggedIn } from "~/commonComponents/NotLoggedIn/NotLoggedIn";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

type ProvidersType = {
  name: string;
  identifier: "discord" | "github" | "overwolf";
  icon: ReactElement;
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
  const outletContext = useOutletContext() as OutletContextShape;

  if (!outletContext.currentUser || !outletContext.currentUser.username)
    return <NotLoggedIn />;

  const toast = useToast();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitSuccess = (_r: unknown) => {
    if (!outletContext.currentUser || !outletContext.currentUser.username)
      throw new Error("User not logged in");
    toast.addToast({
      csVariant: "success",
      children: (
        <>
          User {outletContext.currentUser.username} was disconnected from TODO
        </>
      ),
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

  const onSubmit = ApiAction({
    endpoint: userLinkedAccountDisconnect,
    onSubmitSuccess: onSubmitSuccess,
    onSubmitError: onSubmitError,
  });

  const publicEnvVariables = getPublicEnvVariables([
    "VITE_AUTH_BASE_URL",
    "VITE_AUTH_RETURN_URL",
  ]);

  return (
    <div className="settings-items">
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Connections</p>
          <p className="settings-items__description">
            This information will not be shared outside of Thunderstore. Read
            more on our{" "}
            <NewLink
              primitiveType="cyberstormLink"
              linkId="PrivacyPolicy"
              csVariant="cyber"
            >
              Privacy Policy
            </NewLink>
            .
          </p>
        </div>
        <div className="settings-items__content">
          {PROVIDERS.map((p) => {
            if (
              !outletContext.currentUser ||
              !outletContext.currentUser.username
            )
              throw new Error("User not logged in");
            return (
              <Connection
                key={p.name}
                icon={p.icon}
                name={p.name}
                identifier={p.identifier}
                connection={outletContext.currentUser.connections?.find(
                  (c) => c.provider.toLowerCase() === p.identifier
                )}
                connectionLink={buildAuthLoginUrl({
                  type: p.identifier,
                  authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
                  authReturnDomain:
                    publicEnvVariables.VITE_AUTH_RETURN_URL || "",
                })}
                disconnectFunction={(p) => {
                  if (
                    !outletContext.currentUser ||
                    !outletContext.currentUser.username
                  )
                    throw new Error("User not logged in");
                  return onSubmit({
                    params: {
                      provider: p,
                    },
                    config: outletContext.requestConfig,
                    queryParams: {},
                    data: { provider: p },
                  });
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
