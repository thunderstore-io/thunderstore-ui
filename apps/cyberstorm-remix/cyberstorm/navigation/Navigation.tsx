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
  Button,
  Popover,
} from "@thunderstore/cyberstorm";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import { Suspense } from "react";
import { DevelopersDropDown } from "./DevelopersDropDown";
import { MobileUserPopover } from "./MobileUserPopover";
import { DesktopUserDropdown } from "./DesktopUserDropdown";
import { DesktopLoginPopover } from "./DesktopLoginPopover";
import { MobileUserPopoverContent } from "./MobileUserPopoverContent";
import { getEmptyUser } from "@thunderstore/dapper-ts";

export function Navigation() {
  return (
    <>
      <header className={styles.desktopNavRoot}>
        <nav className={styles.item}>
          <ul className={styles.nav}>
            <li>
              <CyberstormLink linkId="Index" className={styles.logoWrapper}>
                <Icon noWrapper>
                  <ThunderstoreLogo />
                </Icon>
              </CyberstormLink>
            </li>
            <li>
              <Button.Root
                paddingSize="large"
                colorScheme="transparentDefault"
                CyberstormLinkId="Communities"
              >
                <Button.ButtonLabel fontSize="large" fontWeight="600">
                  Communities
                </Button.ButtonLabel>
              </Button.Root>
            </li>
            <li>
              <DevelopersDropDown />
            </li>
          </ul>
        </nav>

        <nav className={styles.item}>
          <ul className={styles.nav}>
            <li className={styles.navButtons}>
              <Button.Root
                paddingSize="large"
                colorScheme="accent"
                href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
              >
                <Button.ButtonLabel fontWeight="700">
                  Get App
                </Button.ButtonLabel>
              </Button.Root>
            </li>
            <Suspense fallback={<DesktopLoginPopover />}>
              <DesktopUserDropdown />
            </Suspense>
          </ul>
        </nav>
      </header>

      <nav className={styles.mobileNavRoot}>
        <div className={styles.mobileNavItem}>
          <Popover
            popoverId={"mobileNavMenu"}
            popoverRootClasses={styles.mobileNavAccountPopoverRoot}
            popoverWrapperClasses={styles.mobileNavAccountPopoverWrapper}
            trigger={
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
            }
          >
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
            <nav className={styles.mobileNavPopoverList}>
              <CyberstormLink
                linkId="Communities"
                className={styles.mobileNavPopoverListLink}
              >
                Communities
              </CyberstormLink>
              <Popover
                popoverId={"mobileNavMenuDevelopers"}
                popoverRootClasses={styles.mobileNavAccountPopoverRoot}
                popoverWrapperClasses={styles.mobileNavAccountPopoverWrapper}
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
              >
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
                <nav className={styles.mobileNavPopoverList}>
                  <CyberstormLink
                    linkId="Communities"
                    className={styles.mobileNavPopoverListLink}
                  >
                    Communities
                  </CyberstormLink>
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
              </Popover>
            </nav>
          </Popover>
          Menu
        </div>
        <div className={styles.mobileNavItem}>
          <CyberstormLink linkId="Communities">
            <Icon wrapperClasses={styles.mobileNavItemIconWrapper}>
              <FontAwesomeIcon icon={faGamepad} />
            </Icon>
            Browse
          </CyberstormLink>
        </div>
        <Suspense fallback={<MobileUserPopoverContent user={getEmptyUser} />}>
          <MobileUserPopover />
        </Suspense>
      </nav>
    </>
  );
}
