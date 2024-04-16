import {
  faArrowUpRight,
  faGamepadModern,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Header.module.css";
import { DevelopersDropDown } from "./DevelopersDropDown";
import { CyberstormLink } from "../Links/Links";
import { ThunderstoreLogo } from "../../svg/svg";
import { Suspense } from "react";
import { HeaderUserNav } from "./HeaderUserNav";
import { AvatarButton } from "../Avatar/AvatarButton";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";
import { Button } from "../..";

/**
 * Horizontal navigation bar shown at the top of the site.
 */
export function Header() {
  return (
    <header className={styles.root}>
      <div className={styles.narrowHeader}>
        <CyberstormLink linkId="Index" className={styles.logoWrapper}>
          <Icon>
            <ThunderstoreLogo />
          </Icon>
        </CyberstormLink>
        <Button.Root
          href="/communities"
          paddingSize="mediumSquare"
          colorScheme="default"
          tooltipText="Communities"
        >
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faGamepadModern} />
          </Button.ButtonIcon>
        </Button.Root>
        <DevelopersDropDown squareButton />
      </div>

      <nav className={classnames(styles.item, styles.wideHeader)}>
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
              <Button.ButtonLabel fontWeight="800">
                Get Manager
              </Button.ButtonLabel>
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </Button.ButtonIcon>
            </Button.Root>
          </li>
          <Suspense fallback={<AvatarButton size="small" />}>
            <HeaderUserNav />
          </Suspense>
        </ul>
      </nav>
    </header>
  );
}

Header.displayName = "Header";
