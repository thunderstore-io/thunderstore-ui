import styles from "./Footer.module.css";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faGithub,
  faReddit,
} from "@fortawesome/free-brands-svg-icons";
import {
  CommunitiesLink,
  IndexLink,
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

const AD_IMAGE_SRC = "/images/tsmm_screenshot.png";

/**
 * Cyberstorm Footer Component
 */
export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.main}>
        <div className={`${styles.section} ${styles.info}`}>
          <div className={`${styles.item} ${styles.company}`}>
            <div className={`${styles.inner} ${styles.logoAndLinks}`}>
              <div className={styles.logo}>
                <ThunderstoreLogoHorizontal />
              </div>
              <div className={styles.iconLinks}>
                <FontAwesomeIcon icon={faDiscord} fixedWidth size={"2x"} />
                <FontAwesomeIcon icon={faGithub} fixedWidth size={"2x"} />
                <FontAwesomeIcon icon={faReddit} fixedWidth size={"2x"} />
              </div>
            </div>
          </div>
          <div className={`${styles.item} ${styles.linksWrapper}`}>
            <div className={styles.inner}>
              <nav className={styles.nav}>
                <div className={styles.navSection}>
                  <div className={styles.navTitle}>Thunderstore</div>
                  <ul className={styles.links}>
                    <IndexLink>
                      <li>Browse</li>
                    </IndexLink>
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

        <div className={`${styles.section} ${styles.extra}`}>
          <div className={`${styles.item} ${styles.adWrapper}`}>
            <div className={styles.inner}>
              <div className={styles.ad}>
                <div className={styles.adText}>
                  <div className={styles.adTitle}>Thunderstore Mod Manager</div>
                  <p className={styles.adDescription}>
                    You are prepared. Download Thunderstore Bolt
                    <br />
                    for desktop and enter a world of Thunder{" "}
                    <FontAwesomeIcon icon={faBoltLightning} fixedWidth />
                  </p>
                  <div className={styles.adButton}>
                    <Button
                      asAnchor
                      colorScheme="primary"
                      label="Get Manager"
                      rightIcon={
                        <FontAwesomeIcon icon={faArrowUpRight} fixedWidth />
                      }
                    />
                  </div>
                </div>
                <img src={AD_IMAGE_SRC} className={styles.img} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.item} ${styles.footnote}`}>
        <div className={styles.footnoteInner}>
          <div className={styles.footnoteLinks}>
            <TermsOfServiceLink>Terms Of Service</TermsOfServiceLink>
            <PrivacyPolicyLink>Privacy Policy</PrivacyPolicyLink>
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
