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
                <Button.Label fontSize="large">Browse</Button.Label>
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
                <Button.Label fontSize="large">Communities</Button.Label>
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
                <Button.Label>Go Premium</Button.Label>
              </Button.Root>
            </a>
            <a href="/">
              <Button.Root paddingSize="large" colorScheme="accent">
                <Button.Label>Get Manager</Button.Label>
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
                  <Button.Icon>
                    <Icon>
                      <FontAwesomeIcon icon={faUpload} />
                    </Icon>
                  </Button.Icon>
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
