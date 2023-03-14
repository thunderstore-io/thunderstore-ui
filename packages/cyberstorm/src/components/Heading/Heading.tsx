import React from "react";
import styles from "./Heading.module.css";
import { DropDown } from "../DropDown/DropDown";
import { Button } from "../Button/Button";
import { Title } from "../Title/Title";
import { TextInput } from "../TextInput/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faBell } from "@fortawesome/free-solid-svg-icons";
import { ThunderstoreLogo } from "../ThunderstoreLogo/ThunderstoreLogo";
import { DropDownLink } from "../DropDown/DropDownLink";
import { IndexLink } from "../Links/Links";

/**
 * Cyberstorm Heading Component
 */
export const Heading: React.FC = () => {
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
    <IndexLink key="5">
      <DropDownLink label="Package Format Docs" />
    </IndexLink>,
    <IndexLink key="6">
      <DropDownLink label="Markdown Preview" />
    </IndexLink>,
    <IndexLink key="7">
      <DropDownLink label="Manifest Validator" />
    </IndexLink>,
  ];

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <div className={styles.leftSection}>
          <ThunderstoreLogo />
          <a href="/browse">
            <Title text="Browse" size="smallest" />
          </a>
          <a href="/communities">
            <Title text="Communities" size="smallest" />
          </a>
          <DropDown
            trigger={<Button label="Developers" />}
            content={developersDropDownContents}
          />
        </div>
        <div className={styles.middleSection}>
          <TextInput />
        </div>
        <div className={styles.rightSection}>
          <Button colorScheme="specialPurple" label="Get Manager" />
          <Button
            colorScheme="transparentDefault"
            label="Upload"
            leftIcon={<FontAwesomeIcon icon={faUpload} fixedWidth />}
          />
          <Button
            colorScheme="transparentDefault"
            leftIcon={<FontAwesomeIcon icon={faBell} fixedWidth />}
          />
          <Button />
        </div>
      </div>
    </div>
  );
};

Heading.displayName = "Heading";
Heading.defaultProps = {};
