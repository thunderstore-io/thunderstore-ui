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
import { useEffect, useRef, useState } from "react";
import { DevelopersDropDown } from "./DevelopersDropDown";
import { DesktopUserDropdown } from "./DesktopUserDropdown";
import { DesktopLoginPopover } from "./DesktopLoginPopover";
import { MobileUserPopoverContent } from "./MobileUserPopoverContent";
import { emptyUser } from "@thunderstore/dapper-ts/src/methods/currentUser";
import { CurrentUser } from "@thunderstore/dapper/types";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { useHydrated } from "remix-utils/use-hydrated";

export function Navigation() {
  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);
  const [currentUser, setCurrentUser] = useState<CurrentUser>();

  useEffect(() => {
    if (!startsHydrated.current && isHydrated) return;
    const fetchAndSetUser = async () => {
      const dapper = await getDapper(true);
      const fetchedUser = await dapper.getCurrentUser();
      if (fetchedUser?.username) {
        setCurrentUser(fetchedUser);
      }
    };
    fetchAndSetUser();
  }, []);

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
        <div className={styles.headerRightSide}>
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
          {!startsHydrated.current && isHydrated && currentUser ? (
            <DesktopUserDropdown user={currentUser} />
          ) : (
            <DesktopLoginPopover />
          )}
        </div>
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
          <nav className={styles.mobileNavPopover}>
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
              <nav className={styles.mobileNavPopover}>
                <NewLink
                  primitiveType="link"
                  href="/api/docs"
                  csVariant="primary"
                  csTextStyles={["fontWeightRegular", "fontSizeS"]}
                  rootClasses={styles.mobileNavPopoverListLink}
                >
                  API Docs
                </NewLink>
                <NewLink
                  primitiveType="link"
                  href="https://github.com/thunderstore-io"
                  csVariant="primary"
                  csTextStyles={["fontWeightRegular", "fontSizeS"]}
                  rootClasses={styles.mobileNavPopoverListLink}
                >
                  GitHub
                </NewLink>
                <NewLink
                  primitiveType="link"
                  href="/package/create/docs/"
                  csVariant="primary"
                  csTextStyles={["fontWeightRegular", "fontSizeS"]}
                  rootClasses={styles.mobileNavPopoverListLink}
                >
                  Package Format Docs
                </NewLink>
                <NewLink
                  primitiveType="link"
                  href="/tools/markdown-preview/"
                  csVariant="primary"
                  csTextStyles={["fontWeightRegular", "fontSizeS"]}
                  rootClasses={styles.mobileNavPopoverListLink}
                >
                  Markdown Preview
                </NewLink>
                <NewLink
                  primitiveType="link"
                  href="/tools/manifest-v1-validator/"
                  csVariant="primary"
                  csTextStyles={["fontWeightRegular", "fontSizeS"]}
                  rootClasses={styles.mobileNavPopoverListLink}
                >
                  Manifest Validator
                </NewLink>
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
        {!startsHydrated.current && isHydrated && currentUser ? (
          <MobileUserPopoverContent user={currentUser} />
        ) : (
          <MobileUserPopoverContent user={emptyUser} />
        )}
      </nav>
    </>
  );
}
