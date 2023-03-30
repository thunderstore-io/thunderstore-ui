import React from "react";
import styles from "./PackageDetailLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import {
  CommunityLink,
  CommunityPackagesLink,
  PackageLink,
} from "../../Links/Links";
import { MetaItem } from "../../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../Button/Button";
import { ModIcon } from "../../ModIcon/ModIcon";
import { Title } from "../../Title/Title";
import { Dialog } from "../../Dialog/Dialog";
import { PackageManagementForm } from "./PackageManagementForm";
import { getPackageDummyData } from "../../../dummyData/generate";

export interface PackageDetailLayoutProps {
  packageId: number;
  managementDialogIsOpen?: boolean;
}

/**
 * Cyberstorm PackageDetail Layout
 */
export const PackageDetailLayout: React.FC<PackageDetailLayoutProps> = (
  props
) => {
  const { packageId, managementDialogIsOpen } = props;
  const packageData = getPackageData(packageId);

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
            {packageData.name}
          </PackageLink>
        </BreadCrumbs>

        <div className={styles.packageInfo}>
          <ModIcon src="/images/thomas.jpg"></ModIcon>
          <>
            <Title text={packageData.name}></Title>
            <div className={styles.packageInfoDetails}>
              <MetaItem
                colorScheme="tertiary"
                label={packageData.author}
                icon={<FontAwesomeIcon icon={faUser} fixedWidth />}
              />
              <Button
                label={packageData.gitHubLink}
                colorScheme="transparentPrimary"
                leftIcon={<FontAwesomeIcon icon={faHouse} fixedWidth />}
                rightIcon={<FontAwesomeIcon icon={faHouse} fixedWidth />}
              />
            </div>
          </>
          <>
            <Dialog
              defaultOpen={managementDialogIsOpen}
              title="Manage Package"
              content={<PackageManagementForm />}
              acceptButton={
                <Button label="Save changes" colorScheme="primary" />
              }
              additionalFooterContent={
                <Button label="Deprecate" colorScheme="warning" />
              }
              trigger={
                <Button
                  leftIcon={<FontAwesomeIcon icon={faCog} fixedWidth />}
                  label="Manage Package"
                />
              }
            />
          </>
        </div>
      </div>
      <div className={styles.mainContentWrapper}>
        <div className={styles.mainContentLeft}>
          <Title text={packageData.name} />
          <p className={styles.description}>{packageData.description}</p>
        </div>
        <div className={styles.mainContentRight} />
      </div>
    </div>
  );
};

PackageDetailLayout.displayName = "PackageDetailLayout";
PackageDetailLayout.defaultProps = {
  managementDialogIsOpen: false,
};

function getPackageData(packageId: number) {
  return getPackageDummyData(packageId);
}
