import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Island } from "~/commonComponents/Island/Island";

import {
  NewIcon,
  NewLink,
  ThunderstoreLogoHorizontal,
} from "@thunderstore/cyberstorm";

const DISCORD_URL = "https://discord.thunderstore.io/";
const GITHUB_URL = "https://github.com/thunderstore-io";

export function FooterSocials() {
  return (
    <Island rootClasses="footer__section footer__socials">
      <div className="footer__content">
        <div className="footer__company__thunderstore-logo">
          <NewIcon noWrapper>
            <ThunderstoreLogoHorizontal />
          </NewIcon>
        </div>

        <div className="footer__company__icon-links">
          <NewLink
            primitiveType="link"
            tooltipText="Join our Discord"
            href={DISCORD_URL}
            rootClasses="footer__company__icon-link"
            csVariant="primary"
            aria-label="Invite link to Thunderstores Discord server"
          >
            <NewIcon noWrapper>
              <FontAwesomeIcon icon={faDiscord} />
            </NewIcon>
          </NewLink>
          <NewLink
            primitiveType="link"
            tooltipText="Check out our GitHub"
            href={GITHUB_URL}
            rootClasses="footer__company__icon-link"
            aria-label="Link to Thunderstores Github"
            csVariant="primary"
          >
            <NewIcon noWrapper>
              <FontAwesomeIcon icon={faGithub} />
            </NewIcon>
          </NewLink>
        </div>
      </div>
    </Island>
  );
}

FooterSocials.displayName = "FooterSocials";
