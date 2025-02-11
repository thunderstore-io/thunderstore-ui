import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { ThunderstoreLogoHorizontal } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  Heading,
  NewButton,
  NewIcon,
  NewLink,
} from "@thunderstore/cyberstorm/src";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";

const AD_IMAGE_SRC = "/cyberstorm-static/images/tsmm_screenshot.png";
const DISCORD_URL = "https://discord.thunderstore.io/";
const GITHUB_URL = "https://github.com/thunderstore-io";

/**
 * Cyberstorm Footer Component
 */
export function Footer() {
  return (
    <footer
      className="ts-container ts-container--y ts-section nimbus-commonComponents-footer"
      aria-label="Footer"
    >
      <div className="ts-container ts-container--y ts-container--full ts-section nimbus-commonComponents-footer__content">
        <div className="ts-container ts-container--y ts-section nimbus-commonComponents-footer-info">
          <div className="ts-container ts-container--x ts-section-item nimbus-commonComponents-footer-info-company">
            <div className="nimbus-commonComponents-footer-info-company__body">
              <NewIcon
                csVariant="accent"
                wrapperClasses="nimbus-commonComponents-footer-info-company__logo"
              >
                <ThunderstoreLogoHorizontal />
              </NewIcon>
              <div className="nimbus-commonComponents-footer-info-company__iconLinks">
                <NewLink
                  primitiveType="link"
                  tooltipText="Join our Discord"
                  href={DISCORD_URL}
                  rootClasses="nimbus-commonComponents-footer-info-company__iconLink"
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
                  rootClasses="nimbus-commonComponents-footer-info-company__iconLink"
                  aria-label="Link to Thunderstores Github"
                  csVariant="primary"
                >
                  <NewIcon noWrapper>
                    <FontAwesomeIcon icon={faGithub} />
                  </NewIcon>
                </NewLink>
              </div>
            </div>
          </div>
          <div className="ts-container ts-container--x ts-container--full ts-section-item nimbus-commonComponents-footer-info-links">
            <div className="nimbus-commonComponents-footer-info-links__body">
              <nav
                className="nimbus-commonComponents-footer-info-links__nav"
                aria-label="Thunderstore links"
              >
                <Heading
                  csVariant="primary"
                  mode="heading"
                  csLevel="2"
                  csSize="4"
                >
                  Thunderstore
                </Heading>
                <ul>
                  <li>
                    <NewLink
                      primitiveType="cyberstormLink"
                      linkId="Communities"
                      csVariant="primary"
                    >
                      Communities
                    </NewLink>
                  </li>
                </ul>
              </nav>
              <nav
                className="nimbus-commonComponents-footer-info-links__nav"
                aria-label="Developer links"
              >
                <Heading
                  csVariant="primary"
                  mode="heading"
                  csLevel="2"
                  csSize="4"
                >
                  Developers
                </Heading>
                <ul>
                  <li>
                    <NewLink
                      primitiveType="link"
                      href="/api/docs"
                      csVariant="primary"
                    >
                      API Documentation
                    </NewLink>
                  </li>
                  <li>
                    <NewLink
                      primitiveType="link"
                      href="/package/create/docs/"
                      csVariant="primary"
                    >
                      Package Format Docs
                    </NewLink>
                  </li>
                  <li>
                    <NewLink
                      primitiveType="link"
                      href="/tools/manifest-v1-validator/"
                      csVariant="primary"
                    >
                      Manifest Validator
                    </NewLink>
                  </li>
                  <li>
                    <NewLink
                      primitiveType="link"
                      href="/tools/markdown-preview/"
                      csVariant="primary"
                    >
                      Markdown Preview
                    </NewLink>
                  </li>
                  <li>
                    <NewLink
                      primitiveType="link"
                      href="https://github.com/thunderstore-io"
                      csVariant="primary"
                    >
                      GitHub
                    </NewLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div className="ts-container ts-container--x ts-section-item nimbus-commonComponents-footer-managerAd">
          <div className="nimbus-commonComponents-footer-managerAd__content">
            <Heading mode="display" csLevel="2" csSize="3">
              Thunderstore Mod Manager
            </Heading>
            <p className="nimbus-commonComponents-footer-managerAd__description">
              You are prepared. Download Thunderstore Mod Manager for desktop
              and enter a world of Thunder{" "}
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faBoltLightning} />
              </NewIcon>
            </p>
            <NewButton
              primitiveType="link"
              href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
              csSize="big"
              csVariant="accent"
              rootClasses="nimbus-commonComponents-footer-managerAd__getManagerButton"
            >
              Get Manager
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </NewIcon>
            </NewButton>
            <div className="nimbus-commonComponents-footer-managerAd__imageWrapper">
              <img
                alt="Screenshot of the Thunderstore Mod Manager"
                width="1350"
                height="811"
                src={AD_IMAGE_SRC}
                className="nimbus-commonComponents-footer-managerAd__image"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ts-container ts-container--x ts-container--stretch ts-section-item nimbus-commonComponents-footer-footnote">
        <div className="nimbus-commonComponents-footer-footnote__inner">
          <div className="nimbus-commonComponents-footer-footnote__links">
            <NewLink
              primitiveType="link"
              href="https://pages.thunderstore.io/p/contact-us"
            >
              Contact Us
            </NewLink>
            <NewLink
              primitiveType="link"
              href="https://pages.thunderstore.io/p/privacy-policy"
            >
              Privacy Policy
            </NewLink>
            <NewLink primitiveType="link" href="https://blog.thunderstore.io/">
              News
            </NewLink>
          </div>
          <p className="nimbus-commonComponents-footer-footnote__copyright">
            © 2024 Thunderstore and contributors.{" "}
            <span>
              This page is{" "}
              <NewLink
                primitiveType="link"
                href="https://github.com/thunderstore-io/thunderstore-ui/"
                aria-label="This page is open source, link to Thunderstore UIs Github page"
                csVariant="primary"
              >
                open-source ❤
              </NewLink>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";
