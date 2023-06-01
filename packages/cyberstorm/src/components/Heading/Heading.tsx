import styles from "./Heading.module.css";
import { DropDown } from "../DropDown/DropDown";
import { Button } from "../Button/Button";
import { Title } from "../Title/Title";
import { TextInput } from "../TextInput/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThunderstoreLogo } from "../ThunderstoreLogo/ThunderstoreLogo";
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
  faUsers,
} from "@fortawesome/pro-solid-svg-icons";
import { AvatarButton } from "../Avatar/AvatarButton";

/**
 * Cyberstorm Heading Component
 */
export function Heading() {
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
        <Avatar src={userData.imageSource} />
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
    <div className={styles.root}>
      <div className={styles.heading}>
        <div className={styles.leftSection}>
          <IndexLink>
            <ThunderstoreLogo />
          </IndexLink>
          <IndexLink>
            <Title text="Browse" size="smallest" />
          </IndexLink>
          <CommunitiesLink>
            <Title text="Communities" size="smallest" />
          </CommunitiesLink>
          <DropDown
            trigger={
              <Button
                label="Developers"
                rightIcon={<FontAwesomeIcon icon={faCaretDown} fixedWidth />}
              />
            }
            content={developersDropDownContents}
          />
        </div>
        <div className={styles.middleSection}>
          <TextInput />
        </div>
        <div className={styles.rightSection}>
          <Button colorScheme="specialPurple" label="Get Manager" />

          <PackageUploadLink>
            <Button
              size="small"
              colorScheme="transparentDefault"
              leftIcon={<FontAwesomeIcon icon={faUpload} fixedWidth />}
            />
          </PackageUploadLink>
          <Button
            size="small"
            colorScheme="transparentDefault"
            leftIcon={<FontAwesomeIcon icon={faBell} fixedWidth />}
          />
          <DropDown
            colorScheme="default"
            trigger={<AvatarButton src={userData.imageSource} />}
            content={userDropDownContents}
          />
        </div>
      </div>
    </div>
  );
}

Heading.displayName = "Heading";

function getUserData(userId: string) {
  return getUserDummyData(userId);
}
