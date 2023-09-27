"use client";
import { faUpload } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Header.module.css";
import { DevelopersDropDown } from "./DevelopersDropDown";
import { PlainButton } from "../Button/Button";
import { CommunitiesLink, IndexLink, PackageUploadLink } from "../Links/Links";
import { Tooltip } from "../Tooltip/Tooltip";
import { ThunderstoreLogo } from "../../svg/svg";
import { UserDropDown } from "./UserDropDown";

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
              <PlainButton
                label="Browse"
                paddingSize="large"
                fontSize="large"
                colorScheme="transparentDefault"
              />
            </IndexLink>
          </li> */}
          <li>
            <CommunitiesLink>
              <PlainButton
                label="Communities"
                paddingSize="large"
                fontSize="large"
                colorScheme="transparentDefault"
              />
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
              <PlainButton
                label="Go Premium"
                paddingSize="large"
                colorScheme="specialPurple"
              />
            </a>
            <a href="/">
              <PlainButton
                label="Get Manager"
                paddingSize="large"
                colorScheme="accent"
              />
            </a>
          </li>
          <li>
            <PackageUploadLink>
              <Tooltip content="Upload" side="bottom">
                <PlainButton
                  paddingSize="mediumSquare"
                  colorScheme="transparentAccent"
                  leftIcon={<FontAwesomeIcon icon={faUpload} fixedWidth />}
                />
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
