import styles from "./Header.module.css";
import { DropDown } from "../DropDown/DropDown";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropDownLink } from "../DropDown/DropDownLink";
import {
  CommunitiesLink,
  IndexLink,
  ManifestValidatorLink,
  MarkdownPreviewLink,
  PackageFormatDocsLink,
  PackageUploadLink,
  SettingsLink,
  TeamsLink,
  UserLink,
} from "../Links/Links";
import { Avatar } from "../Avatar/Avatar";
import { getUserDummyData } from "../../dummyData";
import {
  faBell,
  faCaretDown,
  faCog,
  faCreditCard,
  faSignOut,
  faUpload,
  faUser,
  faUsers,
} from "@fortawesome/pro-solid-svg-icons";
import { AvatarButton } from "../Avatar/AvatarButton";
import { ThunderstoreLogo } from "../../svg/svg";

/**
 * Cyberstorm Header Component
 */
export function Header() {
  const userId = "user";
  const userData = getUserData(userId);

  const developersDropDownContents = [
    <a href="/wiki" key="1">
      <DropDownLink label="Modding Wiki" isExternal />
    </a>,
    <a href="/docs" key="2">
      <DropDownLink label="API Docs" isExternal />
    </a>,
    <a href="/git" key="3">
      <DropDownLink label="GitHub Repo" isExternal />
    </a>,
    <PackageFormatDocsLink key="4">
      <DropDownLink label="Package Format Docs" />
    </PackageFormatDocsLink>,
    <MarkdownPreviewLink key="5">
      <DropDownLink label="Markdown Preview" />
    </MarkdownPreviewLink>,
    <ManifestValidatorLink key="6">
      <DropDownLink label="Manifest Validator" />
    </ManifestValidatorLink>,
    <PackageUploadLink key="7">
      <DropDownLink label="Upload Package" />
    </PackageUploadLink>,
  ];

  const userDropDownContents = [
    <UserLink key="1" user={userData.name}>
      <div className={styles.dropDownUserInfo}>
        {userData.imageSource ? <Avatar src={userData.imageSource} /> : null}
        <div className={styles.dropdownUserInfoDetails}>
          <div className={styles.dropdownUserInfoDetails_userName}>
            {userData.name}
          </div>
          <div className={styles.dropdownUserInfoDetails_description}>
            My profile
          </div>
        </div>
      </div>
    </UserLink>,
    <TeamsLink key="2">
      <DropDownLink
        leftIcon={<FontAwesomeIcon icon={faUsers} fixedWidth />}
        label="Teams"
      />
    </TeamsLink>,
    <a href="/notifications" key="3">
      <DropDownLink
        leftIcon={<FontAwesomeIcon icon={faBell} fixedWidth />}
        label="Notifications"
      />
    </a>,
    <a href="/subscriptons" key="4">
      <DropDownLink
        leftIcon={<FontAwesomeIcon icon={faCreditCard} fixedWidth />}
        label="Subscriptions"
      />
    </a>,
    <SettingsLink key="5">
      <DropDownLink
        leftIcon={<FontAwesomeIcon icon={faCog} fixedWidth />}
        label="Settings"
      />
    </SettingsLink>,
    <a href="/logout" key="6">
      <DropDownLink
        leftIcon={<FontAwesomeIcon icon={faSignOut} fixedWidth />}
        label="Log Out"
      />
    </a>,
  ];

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
            <IndexLink>
              <Button label="Browse" colorScheme="transparentDefault" />
            </IndexLink>
          </li>
          <li>
            <CommunitiesLink>
              <Button
                asAnchor
                label="Communities"
                colorScheme="transparentDefault"
              />
            </CommunitiesLink>
          </li>
          <li>
            <DropDown
              triggerColorScheme="transparentDefault"
              trigger={
                <Button
                  label="Developers"
                  rightIcon={<FontAwesomeIcon icon={faCaretDown} fixedWidth />}
                  size="medium"
                />
              }
              content={developersDropDownContents}
            />
          </li>
        </ul>
      </nav>

      <div className={`${styles.item} + ${styles.search}`}></div>

      <nav className={styles.item}>
        <ul className={styles.nav}>
          <li className={styles.navButtons}>
            <Button colorScheme="specialPurple" label="Go Premium" />
            <Button colorScheme="primary" label="Get Manager" />
          </li>
          <li>
            <PackageUploadLink>
              <Button
                asAnchor
                size="small"
                colorScheme="transparentAccent"
                leftIcon={<FontAwesomeIcon icon={faUpload} fixedWidth />}
              />
            </PackageUploadLink>
          </li>
          <li>
            <DropDown
              colorScheme="default"
              trigger={
                userData.imageSource ? (
                  <AvatarButton src={userData.imageSource} />
                ) : (
                  <Button
                    leftIcon={<FontAwesomeIcon icon={faUser} fixedWidth />}
                  />
                )
              }
              content={userDropDownContents}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}

Header.displayName = "Header";

function getUserData(userId: string) {
  return getUserDummyData(userId);
}
