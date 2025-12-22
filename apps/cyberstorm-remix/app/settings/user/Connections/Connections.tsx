import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { buildAuthLoginUrl } from "cyberstorm/utils/ThunderstoreAuth";
import { type ReactElement, useRef } from "react";
import { useOutletContext, useRevalidator } from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";
import { Connection } from "~/commonComponents/Connection/Connection";
import { Loading } from "~/commonComponents/Loading/Loading";
import { NotLoggedIn } from "~/commonComponents/NotLoggedIn/NotLoggedIn";
import { type OutletContextShape } from "~/root";

import { NewLink, OverwolfLogo, useToast } from "@thunderstore/cyberstorm";
import { ApiError } from "@thunderstore/thunderstore-api";
import { userLinkedAccountDisconnect } from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

type ProvidersType = {
  name: string;
  identifier: "discord" | "github" | "overwolf";
  icon: ReactElement;
};

export const PROVIDERS: ProvidersType[] = [
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
  const isHydrated = useHydrated();
  const revalidator = useRevalidator();
  const toast = useToast();
  const disconnectingProviderRef = useRef<string | null>(null);

  const onlyOneConnected = () => {
    const connectedProviders =
      outletContext.currentUser?.connections?.length ?? 0;
    return connectedProviders === 1;
  };

  const getConnection = (provider: ProvidersType) =>
    outletContext.currentUser?.connections?.find(
      (c) => c.provider?.toLowerCase() === provider.identifier
    );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitSuccess = (_r: unknown) => {
    const username = outletContext.currentUser?.username;

    revalidator.revalidate();

    toast.addToast({
      csVariant: "success",
      children: (
        <>
          User {username} was disconnected from{" "}
          {disconnectingProviderRef.current}
        </>
      ),
      duration: 30000,
    });

    disconnectingProviderRef.current = null;
  };

  const onSubmitError = (error: unknown) => {
    let message = "Error when disconnecting account.";

    if (error instanceof ApiError) {
      const fieldErrors = error.getFieldErrors();
      message =
        fieldErrors.non_field_errors?.[0] ||
        fieldErrors.detail?.[0] ||
        fieldErrors.root?.[0] ||
        error.message ||
        message;
    }

    toast.addToast({
      csVariant: "danger",
      children: <>{message}</>,
      duration: 8000,
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
    "VITE_BETA_SITE_URL",
  ]);

  if (!isHydrated) {
    return <Loading />;
  }

  if (!outletContext.currentUser) {
    return <NotLoggedIn />;
  }

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
          {PROVIDERS.map((provider) => (
            <Connection
              key={provider.name}
              disabled={onlyOneConnected() && !!getConnection(provider)}
              icon={provider.icon}
              name={provider.name}
              identifier={provider.identifier}
              connection={getConnection(provider)}
              connectionLink={buildAuthLoginUrl({
                type: provider.identifier,
                authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
                authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
                nextUrl: `${publicEnvVariables.VITE_BETA_SITE_URL}/settings`,
              })}
              disconnectFunction={(provider) => {
                disconnectingProviderRef.current = provider;
                return onSubmit({
                  params: { provider },
                  config: outletContext.requestConfig,
                  queryParams: {},
                  data: { provider },
                });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
