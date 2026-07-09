import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Heading, NewButton, NewIcon } from "@thunderstore/cyberstorm";

import "./FooterManagerAd.css";

const AD_IMAGE_SRC = "/cyberstorm-static/images/tsmm_screenshot.webp";

export function FooterManagerAd() {
  return (
    <div className="footer-manager">
      <div className="footer-manager__body">
        <Heading mode="display" csLevel="2" csSize="3">
          Thunderstore Mod Manager
        </Heading>
        <p className="footer-manager__desc">
          Download Thunderstore Mod Manager for Windows to easily install,
          update, and manage your mods.{" "}
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faBoltLightning} />
          </NewIcon>
        </p>
        <NewButton
          primitiveType="link"
          href="https://get.thunderstore.io/"
          csSize="big"
          csVariant="accent"
        >
          Get Manager
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faArrowUpRight} />
          </NewIcon>
        </NewButton>
      </div>
      <div className="footer-manager__media">
        <img
          alt="Screenshot of the Thunderstore Mod Manager"
          width="640"
          height="321"
          src={AD_IMAGE_SRC}
        />
      </div>
    </div>
  );
}

FooterManagerAd.displayName = "FooterManagerAd";
