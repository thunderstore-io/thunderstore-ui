import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  NewIcon,
  NewLink,
  ThunderstoreLogoHorizontal,
} from "@thunderstore/cyberstorm";

import "./FooterSocials.css";

const DISCORD_URL = "https://discord.thunderstore.io/";
const GITHUB_URL = "https://github.com/thunderstore-io";

export function FooterSocials() {
  return (
    <div className="footer-socials">
      <NewIcon noWrapper csHeight="2rem" csWidth="auto">
        <ThunderstoreLogoHorizontal />
      </NewIcon>

      <div className="footer-socials__links">
        <NewLink
          primitiveType="link"
          tooltipText="Join our Discord"
          href={DISCORD_URL}
          rootClasses="footer-link"
          csVariant="primary"
          aria-label="Invite link to Thunderstores Discord server"
        >
          <NewIcon noWrapper csWidth="2rem" csHeight="2rem">
            <FontAwesomeIcon icon={faDiscord} />
          </NewIcon>
        </NewLink>
        <NewLink
          primitiveType="link"
          tooltipText="Check out our GitHub"
          href={GITHUB_URL}
          rootClasses="footer-link"
          aria-label="Link to Thunderstores Github"
          csVariant="primary"
        >
          <NewIcon noWrapper csWidth="2rem" csHeight="2rem">
            <FontAwesomeIcon icon={faGithub} />
          </NewIcon>
        </NewLink>
      </div>
    </div>
  );
}

FooterSocials.displayName = "FooterSocials";
