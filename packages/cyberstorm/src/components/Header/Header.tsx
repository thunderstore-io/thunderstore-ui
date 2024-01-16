import {
  faArrowUpRight,
  faUpload,
  faUser,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Header.module.css";
import { DevelopersDropDown } from "./DevelopersDropDown";
import * as Button from "../Button/";
import { CommunitiesLink, IndexLink } from "../Links/Links";
import { ThunderstoreLogo } from "../../svg/svg";
import { UserDropDown } from "./UserDropDown";
import { Suspense } from "react";

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
          <li>
            <CommunitiesLink>
              <Button.Root
                plain
                paddingSize="large"
                colorScheme="transparentDefault"
              >
                <Button.ButtonLabel fontSize="large" fontWeight="600">
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

      <nav className={styles.item}>
        <ul className={styles.nav}>
          <li className={styles.navButtons}>
            <Button.Root
              paddingSize="large"
              colorScheme="accent"
              plain
              href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
            >
              <Button.ButtonLabel fontWeight="800">
                Get Manager
              </Button.ButtonLabel>
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </Button.ButtonIcon>
            </Button.Root>
          </li>
          <li>
            {/* TODO: This is a bit bad, since old upload pages exist on per community basis. Good enough until new upload page is deployed. */}
            {/* When new upload page is deployed change to use PackageUploadLink instead */}
            <a href="/package/create/" key="old_upload">
              <Button.Root
                paddingSize="mediumSquare"
                colorScheme="transparentAccent"
                tooltipText="Upload"
              >
                <Button.ButtonIcon>
                  <FontAwesomeIcon icon={faUpload} />
                </Button.ButtonIcon>
              </Button.Root>
            </a>
          </li>
          <li>
            <Suspense
              fallback={
                <Button.Root>
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faUser} />
                  </Button.ButtonIcon>
                </Button.Root>
              }
            >
              <UserDropDown />
            </Suspense>
          </li>
        </ul>
      </nav>
    </header>
  );
}

Header.displayName = "Header";
