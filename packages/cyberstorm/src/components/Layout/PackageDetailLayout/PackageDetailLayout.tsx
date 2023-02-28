import React from "react";
import styles from "./PackageDetailLayout.module.css";
import { Tabs } from "../../Tabs/Tabs";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import {
  CommunityLink,
  CommunityPackagesLink,
  PackageLink,
} from "../../Links/Links";
import { MetaItem } from "../../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../Button/Button";
import { ModIcon } from "../../ModIcon/ModIcon";

export interface PackageDetailLayoutProps {
  title?: string;
  description?: string;
}

/**
 * Cyberstorm PackageDetail Layout
 */
export const PackageDetailLayout: React.FC<PackageDetailLayoutProps> = (
  props
) => {
  const { description, title } = props;

  return (
    <div className={styles.root}>
      <div className={styles.topContent}>
        <BreadCrumbs>
          <CommunityLink community="V-Rising">V Rising</CommunityLink>
          <CommunityPackagesLink community="V-Rising">
            Packages
          </CommunityPackagesLink>
          <PackageLink
            namespace="packages"
            community="V-Rising"
            package="v-rising-epic-hardcore-mode"
          >
            {title}
          </PackageLink>
        </BreadCrumbs>

        <div className={styles.packageInfo}>
          <ModIcon src="/images/thomas.jpg"></ModIcon>
          <div>
            <Tabs text={title}></Tabs>
            <div className={styles.packageInfoDetails}>
              <MetaItem
                colorScheme="tertiary"
                label="grav"
                icon={<FontAwesomeIcon icon={faUser} fixedWidth />}
              />
              <Button
                label="github.com/thunderstore-io/v-rising-epic-hc-mode"
                colorScheme="transparentPrimary"
                leftIcon={<FontAwesomeIcon icon={faHouse} fixedWidth />}
                rightIcon={<FontAwesomeIcon icon={faHouse} fixedWidth />}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mainContentWrapper}>
        <div className={styles.mainContentLeft}>
          <Tabs size="small" text="Description title" />
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.mainContentRight} />
      </div>
    </div>
  );
};

PackageDetailLayout.displayName = "PackageDetailLayout";
PackageDetailLayout.defaultProps = { title: "", description: "" };
