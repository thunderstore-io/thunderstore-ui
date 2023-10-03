"use client";
import { faUpload } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Header.module.css";
import { DevelopersDropDown } from "./DevelopersDropDown";
import * as Button from "../Button/";
import { CommunitiesLink, IndexLink, PackageUploadLink } from "../Links/Links";
import { Tooltip } from "../Tooltip/Tooltip";
import { ThunderstoreLogo } from "../../svg/svg";
import { UserDropDown } from "./UserDropDown";
import { Icon } from "../Icon/Icon";

/**
 * Horizontal navigation bar shown at the top of the site.
 */
export function Header() {
  return (
    <header className={styles.root}>
      <nav className={styles.item}>
        <ul className={styles.nav}>
          <li>
            <IndexLink>
              <div className={styles.logoWrapper}>
                <ThunderstoreLogo />
              </div>
            </IndexLink>
          </li>
          {/* Disabled temporarily, ref. TS-1828 */}
          {/* <li>
            <IndexLink>
              <Button.Root
                plain
                paddingSize="large"
                colorScheme="transparentDefault"
              >
                <Button.ButtonLabel fontSize="large">Browse</Button.ButtonLabel>
              </Button.Root>
            </IndexLink>
          </li> */}
          <li>
            <CommunitiesLink>
              <Button.Root
                plain
                paddingSize="large"
                colorScheme="transparentDefault"
              >
                <Button.ButtonLabel fontSize="large">
                  Communities
                </Button.ButtonLabel>
              </Button.Root>
            </CommunitiesLink>
          </li>
          <li>
            <DevelopersDropDown />
          </li>
        </ul>
      </nav>

      <div className={`${styles.item} + ${styles.search}`}></div>

      <nav className={styles.item}>
        <ul className={styles.nav}>
          <li className={styles.navButtons}>
            <a href="/">
              <Button.Root paddingSize="large" colorScheme="specialPurple">
                <Button.ButtonLabel>Go Premium</Button.ButtonLabel>
              </Button.Root>
            </a>
            <a href="/">
              <Button.Root paddingSize="large" colorScheme="accent">
                <Button.ButtonLabel>Get Manager</Button.ButtonLabel>
              </Button.Root>
            </a>
          </li>
          <li>
            <PackageUploadLink>
              <Tooltip content="Upload" side="bottom">
                <Button.Root
                  paddingSize="mediumSquare"
                  colorScheme="transparentAccent"
                >
                  <Button.ButtonIcon>
                    <Icon>
                      <FontAwesomeIcon icon={faUpload} />
                    </Icon>
                  </Button.ButtonIcon>
                </Button.Root>
              </Tooltip>
            </PackageUploadLink>
          </li>
          <li>
            <UserDropDown />
          </li>
        </ul>
      </nav>
    </header>
  );
}

Header.displayName = "Header";
