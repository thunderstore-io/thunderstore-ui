import styles from "./Heading.module.css";
import { DropDown } from "../DropDown/DropDown";
import { Button } from "../Button/Button";
import { Title } from "../Title/Title";
import { TextInput } from "../TextInput/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faBell,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
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
} from "../Links/Links";
import { Avatar } from "../Avatar/Avatar";
import { getUserDummyData } from "../../dummyData";

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
    <SettingsLink key="1">
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
    </SettingsLink>,
    <TeamsLink key="2">
      <DropDownLink label="Teams" />
    </TeamsLink>,
    <a href="/notifications" key="3">
      <DropDownLink label="Notifications" />
    </a>,
    <a href="/subscriptons" key="4">
      <DropDownLink label="Subscriptions" />
    </a>,
    <SettingsLink key="5">
      <DropDownLink label="Settings" />
    </SettingsLink>,
    <a href="/logout" key="6">
      <DropDownLink label="Log Out" />
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
            trigger={<Avatar src={userData.imageSource} />}
            content={userDropDownContents}
          />
        </div>
      </div>
    </div>
  );
}

Heading.displayName = "Heading";
Heading.defaultProps = {};

function getUserData(userId: string) {
  return getUserDummyData(userId);
}
