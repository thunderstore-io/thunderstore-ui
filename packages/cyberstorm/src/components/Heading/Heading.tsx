import React from "react";
import styles from "./Heading.module.css";
import { Link } from "../Link/Link";
import { DropDown } from "../DropDown/DropDown";
import { Button } from "../Button/Button";
import { Title } from "../Title/Title";
import { TextInput } from "../TextInput/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faBell } from "@fortawesome/free-solid-svg-icons";
import { ThunderstoreLogo } from "../ThunderstoreLogo/ThunderstoreLogo";

/**
 * Cyberstorm Heading Component
 */
export const Heading: React.FC = () => {
  const developersDropDownContents = [
    <Link key="1" label="Modding Wiki" />,
    <Link key="2" label="API Docs" />,
  ];

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <div className={styles.leftSection}>
          <ThunderstoreLogo />
          <a href="/browse">
            <Title text="Browse" size="small" />
          </a>
          <a href="/communities">
            <Title text="Communities" size="small" />
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
