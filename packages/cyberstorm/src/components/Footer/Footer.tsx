import styles from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUpRightFromSquare,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";
import { ThunderstoreLogoHorizontal } from "../../svg/svg";
import { classnames } from "../../utils/utils";
import { Container, Heading, LinkButton, List, NewIcon, NewLink } from "../..";

const AD_IMAGE_SRC = "/cyberstorm-static/images/tsmm_screenshot.png";
const DISCORD_URL = "https://discord.thunderstore.io/";
const GITHUB_URL = "https://github.com/thunderstore-io";

/**
 * Cyberstorm Footer Component
 */
export function Footer() {
  return (
    <footer className={styles.root} aria-label="Footer">
      <div className={styles.main}>
        <div className={classnames(styles.section, styles.info)}>
          <div className={classnames(styles.item, styles.company)}>
            <div className={classnames(styles.inner, styles.logoAndLinks)}>
              <NewIcon csVariant="accent" wrapperClasses={styles.logo}>
                <ThunderstoreLogoHorizontal />
              </NewIcon>
              <Container rootClasses={styles.iconLinks} csVariant="accent">
                <NewLink
                  primitiveType="link"
                  tooltipText="Join our Discord"
                  href={DISCORD_URL}
                  rootClasses={styles.iconLink}
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
                  rootClasses={styles.iconLink}
                  aria-label="Link to Thunderstores Github"
                >
                  <NewIcon noWrapper>
                    <FontAwesomeIcon icon={faGithub} />
                  </NewIcon>
                </NewLink>
              </Container>
            </div>
          </div>
          <div className={classnames(styles.item, styles.linksWrapper)}>
            <div className={classnames(styles.inner, styles.navLinks)}>
              <nav className={styles.nav} aria-label="Footer links">
                <Container rootClasses={styles.navSection}>
                  <Heading
                    csVariant="primary"
                    mode="heading"
                    csLevel="2"
                    csStyleLevel="4"
                  >
                    Thunderstore
                  </Heading>
                  <List.Root csTextStyles={["lineHeightBody", "fontSizeS"]}>
                    <List.ListItem>
                      <NewLink
                        primitiveType="cyberstormLink"
                        linkId="Communities"
                        csVariant="accent"
                      >
                        Communities
                      </NewLink>
                    </List.ListItem>
                  </List.Root>
                </Container>
                <Container rootClasses={styles.navSection}>
                  <Heading
                    csVariant="primary"
                    mode="heading"
                    csLevel="2"
                    csStyleLevel="4"
                  >
                    Developers
                  </Heading>
                  <List.Root csTextStyles={["lineHeightBody", "fontSizeS"]}>
                    <List.ListItem>
                      <NewLink
                        primitiveType="link"
                        href="/api/docs"
                        csVariant="accent"
                      >
                        API Documentation
                      </NewLink>
                    </List.ListItem>
                    <List.ListItem>
                      <NewLink
                        primitiveType="link"
                        href="/package/create/docs/"
                        csVariant="accent"
                      >
                        Package Format Docs
                      </NewLink>
                    </List.ListItem>
                    <List.ListItem>
                      <NewLink
                        primitiveType="link"
                        href="/tools/manifest-v1-validator/"
                        csVariant="accent"
                      >
                        Manifest Validator
                      </NewLink>
                    </List.ListItem>
                    <List.ListItem>
                      <NewLink
                        primitiveType="link"
                        href="/tools/markdown-preview/"
                        csVariant="accent"
                      >
                        Markdown Preview
                      </NewLink>
                    </List.ListItem>
                    <List.ListItem>
                      <NewLink
                        primitiveType="link"
                        href="https://github.com/thunderstore-io"
                        csVariant="accent"
                      >
                        GitHub
                      </NewLink>
                    </List.ListItem>
                  </List.Root>
                </Container>
              </nav>
            </div>
          </div>
        </div>

        <div className={classnames(styles.section, styles.extra)}>
          <div className={classnames(styles.item, styles.adWrapper)}>
            <div className={styles.inner}>
              <div className={styles.ad}>
                <div className={styles.adText}>
                  <Heading mode="display" csLevel="2" csStyleLevel="3">
                    Thunderstore Mod Manager
                  </Heading>
                  <Container
                    rootClasses={styles.adDescription}
                    csVariant="accent"
                  >
                    You are prepared. Download Thunderstore Mod Manager for
                    desktop and enter a world of Thunder{" "}
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faBoltLightning} />
                    </NewIcon>
                  </Container>
                  <LinkButton
                    primitiveType="link"
                    href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
                    csSize="l"
                    csColor="cyber-green"
                    csVariant="accent"
                    rootClasses={styles.getManagerButton}
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
                  className={styles.img}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classnames(styles.item, styles.footnote)}>
        <div className={styles.footnoteInner}>
          <Container
            rootClasses={styles.footerPagesLinks}
            csTextStyles={["fontSizeXS", "fontWeightRegular", "lineHeightAuto"]}
          >
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
          </Container>
          <Container
            csVariant="accent"
            csTextStyles={["lineHeightBody", "fontWeightRegular", "fontSizeXS"]}
            rootClasses={styles.footnoteCopyright}
          >
            © 2024 Thunderstore and contributors. This page is{" "}
            <NewLink
              primitiveType="link"
              href="https://github.com/thunderstore-io/thunderstore-ui/"
              aria-label="This page is open source, link to Thunderstore UIs Github page"
            >
              open-source ❤
            </NewLink>
          </Container>
        </div>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";
