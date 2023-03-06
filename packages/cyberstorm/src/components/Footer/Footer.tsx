import React from "react";
import styles from "./Footer.module.css";
import { Title } from "../Title/Title";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { Link } from "../Link/Link";
import { ThunderstoreLogo } from "../ThunderstoreLogo/ThunderstoreLogo";

/**
 * Cyberstorm Footer Component
 */
export const Footer: React.FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <div className={styles.leftColumn}>
          <div className={styles.columnItem}>
            <div className={styles.logos}>
              <div className={styles.logo}>
                <ThunderstoreLogo />
                <Title size="smaller" text="Thunderstore" />
              </div>
              <div className={styles.linkLogos}>
                <FontAwesomeIcon icon={faGamepad} fixedWidth />
                <FontAwesomeIcon icon={faGamepad} fixedWidth />
                <FontAwesomeIcon icon={faGamepad} fixedWidth />
              </div>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.columnItem}>
            <div className={styles.links}>
              <div className={styles.linksColumn}>
                <Title size="small" text="Thunderstore" />
                <Link label="Browse" />
                <Link label="Communities" />
                <Link label="About Us" />
              </div>
              <div className={styles.linksColumn}>
                <Title size="small" text="Thunderstore" />
                <Link label="Browse" />
                <Link label="Communities" />
                <Link label="About Us" />
              </div>
              <div className={styles.linksColumn}>
                <Title size="small" text="Thunderstore" />
                <Link label="Browse" />
                <Link label="Communities" />
                <Link label="About Us" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <Title text="Thunderstore Bolt" />
          <p className={styles.rightColumnText}>
            You are prepared. Download Thunderstore Bolt for desktop and enter a
            world of Thunder
          </p>
          <div>
            <Button
              colorScheme="specialPurple"
              label="Get Bolt"
              rightIcon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
            />
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>Thunderstore © 2023</span>
        <span>All your base are belong to us.</span>
      </div>
    </div>
  );
};

Footer.displayName = "Footer";
Footer.defaultProps = {};
