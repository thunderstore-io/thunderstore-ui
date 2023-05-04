import styles from "./Footer.module.css";
import { Title } from "../Title/Title";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "../Link/Link";
import { ThunderstoreLogo } from "../ThunderstoreLogo/ThunderstoreLogo";
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
import { PackageFormatDocsLayout } from "../Layout/Developers/PackageFormatDocs/PackageFormatDocsLayout";
import TermsOfService from "@thunderstore/cyberstorm-nextjs/pages/terms-of-service";

/**
 * Cyberstorm Footer Component
 */
export function Footer() {
  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <div className={styles.leftColumn}>
          <div className={styles.columnItem}>
            <div className={styles.logos}>
              <div className={styles.logo}>
                <ThunderstoreLogo />
                <Title size="smaller" text="Thunderstore" />
              </div>
              <div className={styles.linkLogos}>
                <FontAwesomeIcon icon={faDiscord} fixedWidth size={"2x"} />
                <FontAwesomeIcon icon={faGithub} fixedWidth size={"2x"} />
                <FontAwesomeIcon icon={faReddit} fixedWidth size={"2x"} />
              </div>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.columnItem}>
            <div className={styles.links}>
              <div className={styles.linksColumn}>
                <Title size="smallest" text="Thunderstore" />
                <div className={styles.link}>Browse</div>
                <div className={styles.link}>
                  <CommunitiesLink>Communities</CommunitiesLink>
                </div>
                <div className={styles.link}>About Us</div>
              </div>
              <div className={styles.linksColumn}>
                <Title size="smallest" text="Thunderstore" />
                <div className={styles.link}>Modding Wiki</div>
                <div className={styles.link}>API Documentation</div>
                <div className={styles.link}>GitHub Repo</div>
                <div className={styles.link}>
                  <PackageFormatDocsLink>
                    Package Format Docs
                  </PackageFormatDocsLink>
                </div>
                <div className={styles.link}>
                  <MarkdownPreviewLink>Markdown Preview</MarkdownPreviewLink>
                </div>
                <div className={styles.link}>
                  <ManifestValidatorLink>
                    Manifest Validator
                  </ManifestValidatorLink>
                </div>
              </div>
              <div className={styles.linksColumn}>
                <Title size="smallest" text="Thunderstore" />
                <div className={styles.link}>FAQ</div>
                <div className={styles.link}>Give Feedback</div>
                <div className={styles.link}>Contact Us</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <Title text="Thunderstore Bolt" />
          <p className={styles.rightColumnText}>
            You are prepared. Download Thunderstore Bolt for desktop and enter a
            world of Thunder
          </p>
          <div>
            <Button
              colorScheme="specialPurple"
              label="Get Bolt"
              rightIcon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
            />
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.bottomLinks}>
          <TermsOfServiceLink>Terms of service</TermsOfServiceLink>
          <PrivacyPolicyLink>PrivacyPolicy</PrivacyPolicyLink>
        </span>
        <span>© 2023 Thunderstore. All rights reserved.</span>
      </div>
    </div>
  );
}

Footer.displayName = "Footer";
Footer.defaultProps = {};
