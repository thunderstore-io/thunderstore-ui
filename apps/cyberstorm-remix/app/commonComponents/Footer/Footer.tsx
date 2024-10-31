import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUpRightFromSquare,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";
import { ThunderstoreLogoHorizontal } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  Heading,
  LinkButton,
  NewIcon,
  NewLink,
} from "@thunderstore/cyberstorm/src";

const AD_IMAGE_SRC = "/cyberstorm-static/images/tsmm_screenshot.png";
const DISCORD_URL = "https://discord.thunderstore.io/";
const GITHUB_URL = "https://github.com/thunderstore-io";

/**
 * Cyberstorm Footer Component
 */
export function Footer() {
  return (
    <footer className="project-footer" aria-label="Footer">
      <div className="project-footer__main">
        <div className="project-footer__section project-footer__info">
          <div className="project-footer__item project-footer__company">
            <div className="project-footer__inner project-footer__logoandlinks">
              <NewIcon csVariant="accent" wrapperClasses="project-footer__logo">
                <ThunderstoreLogoHorizontal />
              </NewIcon>
              <div className="project-footer__iconlinks">
                <NewLink
                  primitiveType="link"
                  tooltipText="Join our Discord"
                  href={DISCORD_URL}
                  rootClasses="project-footer__iconlink"
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
                  rootClasses="project-footer__iconlink"
                  aria-label="Link to Thunderstores Github"
                >
                  <NewIcon noWrapper>
                    <FontAwesomeIcon icon={faGithub} />
                  </NewIcon>
                </NewLink>
              </div>
            </div>
          </div>
          <div className="project-footer__item project-footer__linkswrapper">
            <div className="project-footer__inner project-footer__navlinks">
              <nav className="project-footer__nav" aria-label="Footer links">
                <div className="project-footer__navsection">
                  <Heading
                    csVariant="primary"
                    mode="heading"
                    csLevel="2"
                    csSize="4"
                  >
                    Thunderstore
                  </Heading>
                  <ul className="project-footer__footerlist">
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
                <div className="project-footer__navsection">
                  <Heading
                    csVariant="primary"
                    mode="heading"
                    csLevel="2"
                    csSize="4"
                  >
                    Developers
                  </Heading>
                  <ul className="project-footer__footerlist">
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

        <div className="project-footer__section project-footer__extra">
          <div className="project-footer__item project-footer__adwrapper">
            <div className="project-footer__inner">
              <div className="project-footer__ad">
                <div className="project-footer__adtext">
                  <Heading mode="display" csLevel="2" csSize="3">
                    Thunderstore Mod Manager
                  </Heading>
                  <div className="project-footer__addescription">
                    You are prepared. Download Thunderstore Mod Manager for
                    desktop and enter a world of Thunder{" "}
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faBoltLightning} />
                    </NewIcon>
                  </div>
                  <LinkButton
                    primitiveType="link"
                    href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
                    csSize="big"
                    csVariant="accent"
                    rootClasses="project-footer__getmanagerbutton"
                  >
                    Get Manager
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </NewIcon>
                  </LinkButton>
                </div>
                <img
                  alt="Screenshot of the Thunderstore Mod Manager"
                  src={AD_IMAGE_SRC}
                  className="project-footer__img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="project-footer__item project-footer__footnote">
        <div className="project-footer__footnoteinner">
          <div className="project-footer__footerpageslinks">
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
          <div className="project-footer__footnotecopyright">
            © 2024 Thunderstore and contributors. This page is{" "}
            <NewLink
              primitiveType="link"
              href="https://github.com/thunderstore-io/thunderstore-ui/"
              aria-label="This page is open source, link to Thunderstore UIs Github page"
              rootClasses="project-footer__opensource"
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
