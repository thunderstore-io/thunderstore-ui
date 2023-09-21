"use client";
import styles from "./Header.module.css";
import { DropDown, DropDownDivider, DropDownItem } from "../DropDown/DropDown";
import { Button, PlainButton } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropDownLink } from "../DropDown/DropDownLink";
import * as RadixDropDown from "@radix-ui/react-dropdown-menu";
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
import {
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
import { Tooltip } from "../..";
import { DapperInterface, useDapper } from "@thunderstore/dapper";
import usePromise from "react-promise-suspense";

/**
 * Cyberstorm Header Component
 */
export function Header() {
  const userId = "headerUser";
  const dapper = useDapper();
  const userData = usePromise(dapper.getUser, [userId]);

  const developersDropDownContents = getDevelopersDropDownContents();
  const userDropDownContents = userData?.user
    ? getUserDropDownContents(userData)
    : [];

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
                fontWeight="700"
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
                fontWeight="700"
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
                  paddingSize="large"
                  fontSize="large"
                  fontWeight="700"
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
            <a href="/">
              <PlainButton
                colorScheme="specialPurple"
                paddingSize="large"
                fontSize="medium"
                fontWeight="700"
                label="Go Premium"
              />
            </a>
            <a href="/">
              <PlainButton
                colorScheme="accent"
                label="Get Manager"
                paddingSize="large"
                fontSize="medium"
                fontWeight="700"
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
            {userData?.user ? (
              <DropDown
                colorScheme="default"
                contentAlignment="end"
                trigger={
                  userData.user.imageSource ? (
                    <AvatarButton src={userData.user.imageSource} />
                  ) : (
                    <Button
                      leftIcon={<FontAwesomeIcon icon={faUser} fixedWidth />}
                    />
                  )
                }
                content={userDropDownContents}
              />
            ) : null}
          </li>
        </ul>
      </nav>
    </header>
  );
}

Header.displayName = "Header";

function getDevelopersDropDownContents() {
  return [
    <a href="/wiki" key="1">
      <DropDownItem
        content={<DropDownLink label="Modding Wiki" isExternal />}
      />
    </a>,
    <a href="/docs" key="2">
      <DropDownItem content={<DropDownLink label="API Docs" isExternal />} />
    </a>,
    <a href="/git" key="3">
      <DropDownItem content={<DropDownLink label="GitHub Repo" isExternal />} />
    </a>,
    <PackageFormatDocsLink key="4">
      <DropDownItem content={<DropDownLink label="Package Format Docs" />} />
    </PackageFormatDocsLink>,
    <MarkdownPreviewLink key="5">
      <DropDownItem content={<DropDownLink label="Markdown Preview" />} />
    </MarkdownPreviewLink>,
    <ManifestValidatorLink key="6">
      <DropDownItem content={<DropDownLink label="Manifest Validator" />} />
    </ManifestValidatorLink>,
    <PackageUploadLink key="7">
      <DropDownItem content={<DropDownLink label="Upload Package" />} />
    </PackageUploadLink>,
  ];
}

function getUserDropDownContents(
  userData: Awaited<ReturnType<DapperInterface["getUser"]>>
) {
  return [
    <UserLink key="1" user={userData.user.name}>
      <RadixDropDown.Item>
        <div className={styles.dropDownUserInfo}>
          {userData.user.imageSource ? (
            <Avatar src={userData.user.imageSource} />
          ) : null}
          <div className={styles.dropdownUserInfoDetails}>
            <div className={styles.dropdownUserInfoDetails_userName}>
              {userData.user.name}
            </div>
            <div className={styles.dropdownUserInfoDetails_description}>
              My profile
            </div>
          </div>
        </div>
      </RadixDropDown.Item>
    </UserLink>,
    <DropDownDivider key="2" />,
    <TeamsLink key="3">
      <DropDownItem
        content={
          <DropDownLink
            leftIcon={<FontAwesomeIcon icon={faUsers} fixedWidth />}
            label="Teams"
          />
        }
      />
    </TeamsLink>,
    <a href="/subscriptons" key="4">
      <DropDownItem
        content={
          <DropDownLink
            leftIcon={<FontAwesomeIcon icon={faCreditCard} fixedWidth />}
            label="Subscriptions"
          />
        }
      />
    </a>,
    <SettingsLink key="5">
      <DropDownItem
        content={
          <DropDownLink
            leftIcon={<FontAwesomeIcon icon={faCog} fixedWidth />}
            label="Settings"
          />
        }
      />
    </SettingsLink>,
    <DropDownDivider key="6" />,
    <a href="/logout" key="7">
      <DropDownItem
        content={
          <DropDownLink
            leftIcon={<FontAwesomeIcon icon={faSignOut} fixedWidth />}
            label="Log Out"
          />
        }
      />
    </a>,
  ];
}
