import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Island, IslandContainer } from "~/commonComponents/Island/Island";

import {
  Heading,
  NewButton,
  NewIcon,
  NewLink,
  ThunderstoreLogoHorizontal,
} from "@thunderstore/cyberstorm";
import {
  faArrowUpRight,
  faBoltLightning,
  faDiscord,
  faGithub,
} from "@thunderstore/icons";

const AD_IMAGE_SRC = "/cyberstorm-static/images/tsmm_screenshot.webp";
const DISCORD_URL = "https://discord.thunderstore.io/";
const GITHUB_URL = "https://github.com/thunderstore-io";

/**
 * Cyberstorm Footer Component
 *
 * `domain` is the Django origin (VITE_API_URL); Django-served pages like
 * the API docs must link there, since the React Router app doesn't serve
 * them on every deployment origin.
 */
export function Footer(props: { domain: string }) {
  const { domain } = props;
  return (
    <IslandContainer as="footer" rootClasses="footer" aria-label="Footer">
      <IslandContainer direction="x" rootClasses="footer__content">
        <IslandContainer direction="y" rootClasses="footer__section">
          <Island rootClasses="footer-item">
            <div className="footer-item__content">
              <div className="footer__company">
                <NewIcon csVariant="accent" wrapperClasses="footer__logo">
                  <ThunderstoreLogoHorizontal />
                </NewIcon>
              </div>
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
          </Island>
          <Island rootClasses="footer-item">
            <div className="footer-item__content">
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
                      href={`${domain}/api/docs/`}
                      csVariant="primary"
                    >
                      API Documentation
                    </NewLink>
                  </li>
                  <li>
                    <NewLink
                      primitiveType="link"
                      href="https://wiki.thunderstore.io/mods/creating-a-package"
                      csVariant="primary"
                    >
                      Package Format Docs
                    </NewLink>
                  </li>
                  <li>
                    <NewLink
                      primitiveType="cyberstormLink"
                      linkId="ManifestValidator"
                      csVariant="primary"
                    >
                      Manifest Validator
                    </NewLink>
                  </li>
                  <li>
                    <NewLink
                      primitiveType="cyberstormLink"
                      linkId="MarkdownPreview"
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
          </Island>
        </IslandContainer>

        <Island rootClasses="footer__section manager-ad">
          <div className="footer-item manager-ad__wrapper">
            <Heading mode="display" csLevel="2" csSize="3">
              Thunderstore Mod Manager
            </Heading>
            <p className="manager-ad__description">
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
                width="640"
                height="321"
                src={AD_IMAGE_SRC}
                className="manager-ad__image"
              />
            </div>
          </div>
        </Island>
      </IslandContainer>

      <Island rootClasses="footnote">
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
            © 2026 Thunderstore and contributors.{" "}
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
      </Island>
    </IslandContainer>
  );
}

Footer.displayName = "Footer";
