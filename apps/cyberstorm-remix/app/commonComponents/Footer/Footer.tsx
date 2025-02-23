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
      className="container container--y island footer"
      aria-label="Footer"
    >
      <div className="container container--y container--full island footer__content">
        <div className="container container--y island footer__info">
          <div className="container container--x island-item footer__company">
            <div className="footer__company-wrapper">
              <NewIcon csVariant="accent" wrapperClasses="footer__logo">
                <ThunderstoreLogoHorizontal />
              </NewIcon>
              <div className="footer__icon-links">
                <NewLink
                  primitiveType="link"
                  tooltipText="Join our Discord"
                  href={DISCORD_URL}
                  rootClasses="footer__icon-link"
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
                  rootClasses="footer__icon-link"
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
          <div className="container container--x container--full island-item footer__links">
            <div className="footer__links-wrapper">
              <nav className="footer__nav" aria-label="Thunderstore links">
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
              <nav className="footer__nav" aria-label="Developer links">
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

        <div className="container container--x island-item manager-ad">
          <div className="manager-ad__wrapper">
            <Heading mode="display" csLevel="2" csSize="3">
              Thunderstore Mod Manager
            </Heading>
            <p className="manager-ad__description">
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
              rootClasses="manager-ad__get-manager-button"
            >
              Get Manager
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </NewIcon>
            </NewButton>
            <div className="manager-ad__image-wrapper">
              <img
                alt="Screenshot of the Thunderstore Mod Manager"
                width="1350"
                height="811"
                src={AD_IMAGE_SRC}
                className="manager-ad__image"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container container--x container--stretch island-item footnote">
        <div className="footnote__inner">
          <div className="footnote__links">
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
          <p className="footer__copyright">
            © 2025 Thunderstore and contributors.{" "}
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
