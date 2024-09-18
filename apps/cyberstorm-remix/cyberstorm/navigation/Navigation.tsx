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
  Menu,
  LinkButton,
  NewLink,
  NewIcon,
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
      <header className={styles.desktopNavRoot} aria-label="Header">
        <nav className={styles.item} aria-label="Main">
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Index"
            rootClasses={styles.logoWrapper}
            csVariant="default"
            csColor="cyber-green"
            aria-label="Home"
          >
            <NewIcon noWrapper>
              <ThunderstoreLogo />
            </NewIcon>
          </NewLink>
          <LinkButton
            primitiveType="cyberstormLink"
            linkId="Communities"
            csSize="l"
            csColor="surface"
            csVariant="tertiary"
          >
            Communities
          </LinkButton>
          <DevelopersDropDown />
        </nav>
        {/* <div className={styles.item} aria-label=""> */}
        <LinkButton
          primitiveType="link"
          href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
          csSize="s"
          csColor="cyber-green"
          csVariant="accent"
          rootClasses={styles.getAppButton}
          aria-label="Get Thunderstore Mod Manager App"
        >
          Get App
        </LinkButton>
        {/* TODO: Enable once working */}
        {/*<Suspense fallback={<DesktopLoginPopover />}>*/}
        {/*  <DesktopUserDropdown />*/}
        {/*</Suspense>*/}
        {/* </div> */}
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
                <NewIcon noWrapper csVariant="tertiary">
                  <FontAwesomeIcon icon={faBars} />
                </NewIcon>
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
              <NewIcon csMode="inline" csVariant="tertiary" noWrapper>
                <FontAwesomeIcon icon={faLongArrowLeft} />
              </NewIcon>
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
                  <NewIcon
                    csMode="inline"
                    csVariant="tertiary"
                    wrapperClasses={styles.mobileNavMenuDevelopersButtonIcon}
                  >
                    <FontAwesomeIcon icon={faCaretRight} />
                  </NewIcon>
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
                  <NewIcon csMode="inline" noWrapper csVariant="tertiary">
                    <FontAwesomeIcon icon={faLongArrowLeft} />
                  </NewIcon>
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
            <NewIcon
              wrapperClasses={styles.mobileNavItemIconWrapper}
              csVariant="tertiary"
            >
              <FontAwesomeIcon icon={faGamepad} />
            </NewIcon>
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
