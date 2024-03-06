import styles from "./Footer.module.css";
import * as Button from "../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { CommunitiesLink } from "../Links/Links";
import {
  faArrowUpRight,
  faBoltLightning,
} from "@fortawesome/pro-solid-svg-icons";
import { ThunderstoreLogoHorizontal } from "../../svg/svg";
import { Tooltip } from "../Tooltip/Tooltip";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

const AD_IMAGE_SRC = "/cyberstorm/images/tsmm_screenshot.png";
const DISCORD_URL = "https://discord.thunderstore.io/";
const GITHUB_URL = "https://github.com/thunderstore-io";

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
                    <Icon wrapperClasses={styles.iconLink}>
                      <FontAwesomeIcon icon={faDiscord} />
                    </Icon>
                  </a>
                </Tooltip>
                <Tooltip content="Check out our GitHub" side="bottom">
                  <a href={GITHUB_URL}>
                    <Icon wrapperClasses={styles.iconLink}>
                      <FontAwesomeIcon icon={faGithub} />
                    </Icon>
                  </a>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className={classnames(styles.item, styles.linksWrapper)}>
            <div className={classnames(styles.inner, styles.navLinks)}>
              <nav className={styles.nav}>
                <div className={styles.navSection}>
                  <div className={styles.navTitle}>Thunderstore</div>
                  <ul className={styles.links}>
                    {/* Disabled temporarily, ref. TS-1828 */}
                    {/* <IndexLink>
                      <li>Browse</li>
                    </IndexLink> */}
                    <li>
                      <CommunitiesLink>Communities</CommunitiesLink>
                    </li>
                  </ul>
                </div>
                <div className={styles.navSection}>
                  <div className={styles.navTitle}>Developers</div>
                  <ul className={styles.links}>
                    <li>
                      <a href="/api/docs" key="docs">
                        API Documentation
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/thunderstore-io" key="github">
                        GitHub
                      </a>
                    </li>
                    <li>
                      <a href="/package/create/docs/" key="old_format_docs">
                        Package Format Docs
                      </a>
                    </li>
                    <li>
                      <a href="/tools/markdown-preview/" key="old_format_docs">
                        Markdown Preview
                      </a>
                    </li>
                    <li>
                      <a
                        href="/tools/manifest-v1-validator/"
                        key="old_manifest_validator"
                      >
                        Manifest Validator
                      </a>
                    </li>
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
                    You are prepared. Download Thunderstore Mod Manager
                    <br />
                    for desktop and enter a world of Thunder{" "}
                    <Icon inline wrapperClasses={styles.inlineIcon}>
                      <FontAwesomeIcon icon={faBoltLightning} />
                    </Icon>
                  </div>
                  <Button.Root
                    plain
                    colorScheme="accent"
                    paddingSize="large"
                    href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
                    className={styles.adButton}
                  >
                    <Button.ButtonLabel fontSize="large">
                      Get Manager
                    </Button.ButtonLabel>
                    <Button.ButtonIcon>
                      <FontAwesomeIcon icon={faArrowUpRight} />
                    </Button.ButtonIcon>
                  </Button.Root>
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
          <div className={styles.footnoteCopyright}>
            © 2024 Thunderstore and contributors. This page is open-source.
            Please{" "}
            <a href="https://github.com/thunderstore-io/thunderstore-ui/">
              help improve it ❤
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";
