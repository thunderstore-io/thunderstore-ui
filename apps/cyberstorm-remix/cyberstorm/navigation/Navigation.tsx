import {
  faBars,
  faGamepad,
  faLongArrowLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import {
  CyberstormLink,
  Icon,
  Menu,
  LinkButton,
  NewLink,
} from "@thunderstore/cyberstorm";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
// import { Suspense } from "react";
import { DevelopersDropDown } from "./DevelopersDropDown";
// import { MobileUserPopover } from "./MobileUserPopover";
// import { DesktopUserDropdown } from "./DesktopUserDropdown";
// import { DesktopLoginPopover } from "./DesktopLoginPopover";
// import { MobileUserPopoverContent } from "./MobileUserPopoverContent";
// import { getEmptyUser } from "@thunderstore/dapper-ts";

export function Navigation() {
  return (
    <>
      <header className={styles.desktopNavRoot}>
        <nav className={styles.item}>
          <ul className={styles.nav}>
            <li>
              <NewLink
                primitiveType="cyberstormLink"
                linkId="Index"
                rootClasses={styles.logoWrapper}
                csVariant="default"
                csColor="cyber-green"
                csMode="body"
              >
                <Icon noWrapper>
                  <ThunderstoreLogo />
                </Icon>
              </NewLink>
            </li>
            <li>
              <LinkButton
                primitiveType="cyberstormLink"
                linkId="Communities"
                csSize="l"
                csColor="surface"
                csVariant="tertiary"
              >
                Communities
              </LinkButton>
            </li>
            <li>
              <DevelopersDropDown />
            </li>
          </ul>
        </nav>

        <nav className={styles.item}>
          <ul className={styles.nav}>
            <li className={styles.navButtons}>
              <LinkButton
                primitiveType="link"
                href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
                csSize="s"
                csColor="cyber-green"
                csVariant="accent"
              >
                Get App
              </LinkButton>
            </li>
            {/* TODO: Enable once working */}
            {/*<Suspense fallback={<DesktopLoginPopover />}>*/}
            {/*  <DesktopUserDropdown />*/}
            {/*</Suspense>*/}
          </ul>
        </nav>
      </header>

      <nav className={styles.mobileNavRoot}>
        <Menu
          popoverId={"mobileNavMenu"}
          trigger={
            <div className={styles.mobileNavItem}>
              <button
                {...{
                  popovertarget: "mobileNavMenu",
                  popovertargetaction: "open",
                }}
                className={styles.mobileNavItemIconWrapper}
              >
                <Icon noWrapper>
                  <FontAwesomeIcon icon={faBars} />
                </Icon>
              </button>
              Menu
            </div>
          }
          controls={
            <button
              {...{
                popovertarget: "mobileNavMenu",
                popovertargetaction: "close",
              }}
              className={styles.popoverCloseButton}
            >
              <Icon
                inline
                noWrapper
                iconClasses={styles.popoverCloseButtonIcon}
              >
                <FontAwesomeIcon icon={faLongArrowLeft} />
              </Icon>
            </button>
          }
        >
          <nav className={styles.mobileNavPopoverList}>
            <CyberstormLink
              linkId="Communities"
              className={styles.mobileNavPopoverListLink}
            >
              Communities
            </CyberstormLink>
            <Menu
              popoverId={"mobileNavMenuDevelopers"}
              trigger={
                <button
                  {...{
                    popovertarget: "mobileNavMenuDevelopers",
                    popovertargetaction: "open",
                  }}
                  className={styles.mobileNavMenuDevelopersButton}
                >
                  Developers
                  <Icon
                    inline
                    iconClasses={styles.mobileNavMenuDevelopersButtonIcon}
                  >
                    <FontAwesomeIcon icon={faCaretRight} />
                  </Icon>
                </button>
              }
              controls={
                <button
                  {...{
                    popovertarget: "mobileNavMenuDevelopers",
                    popovertargetaction: "close",
                  }}
                  className={styles.popoverCloseButton}
                >
                  <Icon
                    inline
                    noWrapper
                    iconClasses={styles.popoverCloseButtonIcon}
                  >
                    <FontAwesomeIcon icon={faLongArrowLeft} />
                  </Icon>
                </button>
              }
            >
              <nav className={styles.mobileNavPopoverList}>
                <a
                  href="/api/docs"
                  key="docs"
                  className={styles.mobileNavPopoverListLink}
                >
                  API Docs
                </a>
                <a
                  href="https://github.com/thunderstore-io"
                  key="github"
                  className={styles.mobileNavPopoverListLink}
                >
                  GitHub
                </a>
                <a
                  href="/package/create/docs/"
                  key="old_format_docs"
                  className={styles.mobileNavPopoverListLink}
                >
                  Package Format Docs
                </a>
                <a
                  href="/tools/markdown-preview/"
                  key="old_markdown_preview"
                  className={styles.mobileNavPopoverListLink}
                >
                  Markdown Preview
                </a>
                <a
                  href="/tools/manifest-v1-validator/"
                  key="old_manifest_validator"
                  className={styles.mobileNavPopoverListLink}
                >
                  Manifest Validator
                </a>
              </nav>
            </Menu>
          </nav>
        </Menu>
        <div className={styles.mobileNavItem}>
          <CyberstormLink linkId="Communities">
            <Icon wrapperClasses={styles.mobileNavItemIconWrapper}>
              <FontAwesomeIcon icon={faGamepad} />
            </Icon>
            Browse
          </CyberstormLink>
        </div>
        {/* TODO: Enable once working */}
        {/*<Suspense fallback={<MobileUserPopoverContent user={getEmptyUser} />}>*/}
        {/*  <MobileUserPopover />*/}
        {/*</Suspense>*/}
      </nav>
    </>
  );
}
