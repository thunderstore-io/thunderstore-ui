import styles from "./Footer.module.css";
import * as Button from "../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faGithub,
  faReddit,
} from "@fortawesome/free-brands-svg-icons";
import {
  CommunitiesLink,
  ManifestValidatorLink,
  MarkdownPreviewLink,
  PackageFormatDocsLink,
  PrivacyPolicyLink,
  TermsOfServiceLink,
} from "../Links/Links";
import {
  faArrowUpRight,
  faBoltLightning,
} from "@fortawesome/pro-solid-svg-icons";
import { ThunderstoreLogoHorizontal } from "../../svg/svg";
import { Tooltip } from "../Tooltip/Tooltip";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

const AD_IMAGE_SRC = "/images/tsmm_screenshot.png";
const DISCORD_URL = "https://discord.thunderstore.io/";
const GITHUB_URL = "https://github.com/thunderstore-io/thunderstore-ui";
const REDDIT_URL = "https://www.reddit.com/r/thunderstore";

/**
 * Cyberstorm Footer Component
 */
export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.main}>
        <div className={classnames(styles.section, styles.info)}>
          <div className={classnames(styles.item, styles.company)}>
            <div className={classnames(styles.inner, styles.logoAndLinks)}>
              <div className={styles.logo}>
                <ThunderstoreLogoHorizontal />
              </div>
              <div className={styles.iconLinks}>
                <Tooltip content="Join our discord" side="bottom">
                  <a href={DISCORD_URL}>
                    <Icon inline wrapperClasses={styles.iconLink}>
                      <FontAwesomeIcon icon={faDiscord} />
                    </Icon>
                  </a>
                </Tooltip>
                <Tooltip content="Check out our GitHub" side="bottom">
                  <a href={GITHUB_URL}>
                    <Icon inline wrapperClasses={styles.iconLink}>
                      <FontAwesomeIcon icon={faGithub} />
                    </Icon>
                  </a>
                </Tooltip>
                <Tooltip content="Talk to us on Reddit" side="bottom">
                  <a href={REDDIT_URL}>
                    <Icon inline wrapperClasses={styles.iconLink}>
                      <FontAwesomeIcon icon={faReddit} />
                    </Icon>
                  </a>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className={classnames(styles.item, styles.linksWrapper)}>
            <div className={styles.inner}>
              <nav className={styles.nav}>
                <div className={styles.navSection}>
                  <div className={styles.navTitle}>Thunderstore</div>
                  <ul className={styles.links}>
                    {/* Disabled temporarily, ref. TS-1828 */}
                    {/* <IndexLink>
                      <li>Browse</li>
                    </IndexLink> */}
                    <CommunitiesLink>
                      <li>Communities</li>
                    </CommunitiesLink>
                    <li>About us</li>
                  </ul>
                </div>
                <div className={styles.navSection}>
                  <div className={styles.navTitle}>Developers</div>
                  <ul className={styles.links}>
                    <li>Modding Wiki</li>
                    <li>API Documentation</li>
                    <li>GitHub Repo</li>
                    <PackageFormatDocsLink>
                      <li>Package Format Docs</li>
                    </PackageFormatDocsLink>
                    <MarkdownPreviewLink>
                      <li>Markdown Preview</li>
                    </MarkdownPreviewLink>
                    <ManifestValidatorLink>
                      <li>Manifest Validator</li>
                    </ManifestValidatorLink>
                  </ul>
                </div>
                <div className={styles.navSection}>
                  <div className={styles.navTitle}>Support</div>
                  <ul className={styles.links}>
                    <li>FAQ</li>
                    <li>Give Feedback</li>
                    <li>Contact Us</li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>

        <div className={classnames(styles.section, styles.extra)}>
          <div className={classnames(styles.item, styles.adWrapper)}>
            <div className={styles.inner}>
              <div className={styles.ad}>
                <div className={styles.adText}>
                  <div className={styles.adTitle}>Thunderstore Mod Manager</div>
                  <div className={styles.adDescription}>
                    You are prepared. Download Thunderstore Bolt
                    <br />
                    for desktop and enter a world of Thunder{" "}
                    <Icon inline wrapperClasses={styles.inlineIcon}>
                      <FontAwesomeIcon icon={faBoltLightning} />
                    </Icon>
                  </div>
                  <a href="/" className={styles.adButton}>
                    <Button.Root plain colorScheme="accent" paddingSize="large">
                      <Button.ButtonLabel fontSize="large">
                        Get Manager
                      </Button.ButtonLabel>
                      <Button.ButtonIcon>
                        <FontAwesomeIcon icon={faArrowUpRight} />
                      </Button.ButtonIcon>
                    </Button.Root>
                  </a>
                </div>
                <img
                  alt="Screenshot of the Thunderstore Mod Manager"
                  src={AD_IMAGE_SRC}
                  className={styles.img}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classnames(styles.item, styles.footnote)}>
        <div className={styles.footnoteInner}>
          <div className={styles.footnoteLinks}>
            <TermsOfServiceLink>
              <div className={styles.footnoteLink}>Terms Of Service</div>
            </TermsOfServiceLink>
            <PrivacyPolicyLink>
              <div className={styles.footnoteLink}>Privacy Policy</div>
            </PrivacyPolicyLink>
          </div>
          <div className={styles.footnoteCopyright}>
            © 2023 Thunderstore. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";
