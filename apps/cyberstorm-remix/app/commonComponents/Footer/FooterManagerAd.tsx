import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Island } from "~/commonComponents/Island/Island";

import { Heading, NewButton, NewIcon } from "@thunderstore/cyberstorm";

const AD_IMAGE_SRC = "/cyberstorm-static/images/tsmm_screenshot.webp";

export function FooterManagerAd() {
  return (
    <Island rootClasses="footer__section footer__manager">
      <div className="footer__content">
        <div className="footer__manager-ad">
          <div className="footer__manager-ad__body">
            <Heading mode="display" csLevel="2" csSize="3">
              Thunderstore Mod Manager
            </Heading>
            <p className="footer__manager-ad__body__description">
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
              rootClasses="footer__manager-ad__get-manager-button"
            >
              Get Manager
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </NewIcon>
            </NewButton>
          </div>
          <div className="footer__manager-ad__image-wrapper">
            <img
              className="footer__manager-ad__image"
              alt="Screenshot of the Thunderstore Mod Manager"
              width="640"
              height="321"
              src={AD_IMAGE_SRC}
            />
          </div>
        </div>
      </div>
    </Island>
  );
}

FooterManagerAd.displayName = "FooterManagerAd";
