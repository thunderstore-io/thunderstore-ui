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
    <footer className="nimbus-footer" aria-label="Footer">
      <div className="nimbus-footer__main">
        <div className="nimbus-footer__section nimbus-footer__info">
          <div className="nimbus-footer__item nimbus-footer__company">
            <div className="nimbus-footer__inner nimbus-footer__logoandlinks">
              <NewIcon csVariant="accent" wrapperClasses="nimbus-footer__logo">
                <ThunderstoreLogoHorizontal />
              </NewIcon>
              <div className="nimbus-footer__iconlinks">
                <NewLink
                  primitiveType="link"
                  tooltipText="Join our Discord"
                  href={DISCORD_URL}
                  rootClasses="nimbus-footer__iconlink"
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
                  rootClasses="nimbus-footer__iconlink"
                  aria-label="Link to Thunderstores Github"
                >
                  <NewIcon noWrapper>
                    <FontAwesomeIcon icon={faGithub} />
                  </NewIcon>
                </NewLink>
              </div>
            </div>
          </div>
          <div className="nimbus-footer__item nimbus-footer__linkswrapper">
            <div className="nimbus-footer__inner nimbus-footer__navlinks">
              <nav className="nimbus-footer__nav" aria-label="Footer links">
                <div className="nimbus-footer__navsection">
                  <Heading
                    csVariant="primary"
                    mode="heading"
                    csLevel="2"
                    csSize="4"
                  >
                    Thunderstore
                  </Heading>
                  <ul className="nimbus-footer__footerlist">
                    <li>
                      <NewLink
                        primitiveType="cyberstormLink"
                        linkId="Communities"
                      >
                        Communities
                      </NewLink>
                    </li>
                  </ul>
                </div>
                <div className="nimbus-footer__navsection">
                  <Heading
                    csVariant="primary"
                    mode="heading"
                    csLevel="2"
                    csSize="4"
                  >
                    Developers
                  </Heading>
                  <ul className="nimbus-footer__footerlist">
                    <li>
                      <NewLink primitiveType="link" href="/api/docs">
                        API Documentation
                      </NewLink>
                    </li>
                    <li>
                      <NewLink
                        primitiveType="link"
                        href="/package/create/docs/"
                      >
                        Package Format Docs
                      </NewLink>
                    </li>
                    <li>
                      <NewLink
                        primitiveType="link"
                        href="/tools/manifest-v1-validator/"
                      >
                        Manifest Validator
                      </NewLink>
                    </li>
                    <li>
                      <NewLink
                        primitiveType="link"
                        href="/tools/markdown-preview/"
                      >
                        Markdown Preview
                      </NewLink>
                    </li>
                    <li>
                      <NewLink
                        primitiveType="link"
                        href="https://github.com/thunderstore-io"
                      >
                        GitHub
                      </NewLink>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>

        <div className="nimbus-footer__section nimbus-footer__extra">
          <div className="nimbus-footer__item nimbus-footer__adwrapper">
            <div className="nimbus-footer__inner">
              <div className="nimbus-footer__ad">
                <div className="nimbus-footer__adtext">
                  <Heading mode="display" csLevel="2" csSize="3">
                    Thunderstore Mod Manager
                  </Heading>
                  <div className="nimbus-footer__addescription">
                    You are prepared. Download Thunderstore Mod Manager for
                    desktop and enter a world of Thunder{" "}
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faBoltLightning} />
                    </NewIcon>
                  </div>
                  <NewButton
                    primitiveType="link"
                    href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
                    csSize="big"
                    csVariant="accent"
                    rootClasses="nimbus-footer__getmanagerbutton"
                  >
                    Get Manager
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faArrowUpRight} />
                    </NewIcon>
                  </NewButton>
                </div>
                <img
                  alt="Screenshot of the Thunderstore Mod Manager"
                  width="1350"
                  height="811"
                  src={AD_IMAGE_SRC}
                  className="nimbus-footer__img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="nimbus-footer__item nimbus-footer__footnote">
        <div className="nimbus-footer__footnoteinner">
          <div className="nimbus-footer__footerpageslinks">
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
          <div className="nimbus-footer__footnotecopyright">
            © 2024 Thunderstore and contributors. This page is{" "}
            <NewLink
              primitiveType="link"
              href="https://github.com/thunderstore-io/thunderstore-ui/"
              aria-label="This page is open source, link to Thunderstore UIs Github page"
              rootClasses="nimbus-footer__opensource"
            >
              open-source ❤
            </NewLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";
