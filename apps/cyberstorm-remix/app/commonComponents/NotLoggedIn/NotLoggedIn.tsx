import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import {
  buildAuthLoginUrl,
  sanitizeReturnUrl,
} from "cyberstorm/utils/ThunderstoreAuth";

import {
  Heading,
  NewIcon,
  NewLink,
  OverwolfLogo,
  ThunderstoreLogo,
} from "@thunderstore/cyberstorm";

import "./NotLoggedIn.css";

export function NotLoggedIn(props: { returnUrl?: string; title?: string }) {
  const publicEnvVariables = getPublicEnvVariables([
    "VITE_AUTH_BASE_URL",
    "VITE_AUTH_RETURN_URL",
  ]);

  const rawReturnUrl = props.returnUrl || "";
  const sanitizedReturnUrl = sanitizeReturnUrl(rawReturnUrl);

  return (
    <div className="not-logged-in">
      <div className="not-logged-in__content">
        <NewIcon wrapperClasses="not-logged-in__logo">
          <ThunderstoreLogo />
        </NewIcon>
        <Heading
          mode="heading"
          csLevel="2"
          csSize="3"
          rootClasses="not-logged-in__title"
        >
          {props.title || "Viewing this page requires an account"}
        </Heading>
        <p className="not-logged-in__description">Please log in to continue.</p>
        <div className="not-logged-in__links">
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({
              type: "discord",
              authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
              authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
              nextUrl: sanitizedReturnUrl,
            })}
            rootClasses="not-logged-in__link not-logged-in__discord"
          >
            <NewIcon csMode="inline" wrapperClasses="not-logged-in__icon">
              <FontAwesomeIcon icon={faDiscord} />
            </NewIcon>
            Connect with Discord
          </NewLink>
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({
              type: "github",
              authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
              authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
              nextUrl: sanitizedReturnUrl,
            })}
            rootClasses="not-logged-in__link not-logged-in__github"
          >
            <NewIcon csMode="inline" wrapperClasses="not-logged-in__icon">
              <FontAwesomeIcon icon={faGithub} />
            </NewIcon>
            Connect with Github
          </NewLink>
          <NewLink
            primitiveType="link"
            href={buildAuthLoginUrl({
              type: "overwolf",
              authBaseDomain: publicEnvVariables.VITE_AUTH_BASE_URL || "",
              authReturnDomain: publicEnvVariables.VITE_AUTH_RETURN_URL || "",
              nextUrl: sanitizedReturnUrl,
            })}
            rootClasses="not-logged-in__link not-logged-in__overwolf"
          >
            <NewIcon csMode="inline" wrapperClasses="not-logged-in__icon">
              <OverwolfLogo />
            </NewIcon>
            Connect with Overwolf
          </NewLink>
        </div>
      </div>
    </div>
  );
}

NotLoggedIn.displayName = "NotLoggedIn";
