"use client";
import styles from "./PackageDetailLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CommunitiesLink, CommunityLink, PackageLink } from "../../Links/Links";
import { MetaItem } from "../../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../Button/Button";
import { ModIcon } from "../../ModIcon/ModIcon";
import { Title } from "../../Title/Title";
import { Dialog } from "../../Dialog/Dialog";
import { PackageManagementForm } from "./PackageManagementForm";
import { getPackageDummyData } from "../../../dummyData";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { MetaInfoItemList } from "../../MetaInfoItemList/MetaInfoItemList";
import {
  faDonate,
  faDownload,
  faCog,
  faHouse,
  faUser,
  faThumbsUp,
  faFlag,
} from "@fortawesome/pro-solid-svg-icons";
import { PackageDependencyList } from "./PackageDependencyList/PackageDependencyList";
import { PackageAuthorList } from "./PackageAuthorList/PackageAuthorList";
import { CopyButton } from "../../CopyButton/CopyButton";
import { formatInteger } from "../../../utils/utils";
import { Package } from "../../../schema";
import { useState } from "react";
import { Tabs } from "../../Tabs/Tabs";
import { PackageChangeLog } from "./PackageChangeLog/PackageChangeLog";
import { PackageVersions } from "./PackageVersions/PackageVersions";

export interface PackageDetailLayoutProps {
  packageId: string;
  managementDialogIsOpen?: boolean;
}

/**
 * Cyberstorm PackageDetail Layout
 */
export function PackageDetailLayout(props: PackageDetailLayoutProps) {
  const { packageId, managementDialogIsOpen = false } = props;
  const packageData = getPackageData(packageId);
  const metaInfoData = getMetaInfoData(packageData);

  const [currentTab, setCurrentTab] = useState(1);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={packageData.community}>
            {packageData.community}
          </CommunityLink>
          <PackageLink
            namespace={packageData.namespace}
            community={packageData.community}
            package={packageData.name}
          >
            {packageData.name}
          </PackageLink>
        </BreadCrumbs>
      }
      header={
        <div className={styles.packageInfo}>
          <ModIcon src={packageData.imageSource}></ModIcon>
          <div className={styles.packageInfoDetails}>
            <Title text={packageData.name}></Title>
            <p>{packageData.shortDescription}</p>
            <div className={styles.packageInfoMeta}>
              <MetaItem
                colorScheme="tertiary"
                label={packageData.author}
                icon={<FontAwesomeIcon icon={faUser} fixedWidth />}
              />
              <Button
                label={packageData.gitHubLink}
                colorScheme="transparentPrimary"
                leftIcon={<FontAwesomeIcon icon={faHouse} fixedWidth />}
              />
            </div>
          </div>
          <div className={styles.managementDialogTrigger}>
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
                  label="Manage"
                />
              }
            />
          </div>
        </div>
      }
      tabs={
        <Tabs tabs={tabs} onTabChange={setCurrentTab} currentTab={currentTab} />
      }
      mainContent={<>{getTabContent(currentTab, packageData)}</>}
      rightSidebarContent={
        <div className={styles.metaInfo}>
          <div className={styles.metaButtonWrapper}>
            <Button
              leftIcon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
              label="Download"
            />
            <Button leftIcon={<FontAwesomeIcon icon={faDonate} fixedWidth />} />
            <Button
              leftIcon={<FontAwesomeIcon icon={faThumbsUp} fixedWidth />}
            />
            <Button leftIcon={<FontAwesomeIcon icon={faFlag} fixedWidth />} />
          </div>
          <MetaInfoItemList metaInfoData={metaInfoData} />
          <PackageDependencyList packages={packageData.dependencies} />
          <PackageAuthorList
            teamName={packageData.team.name}
            teamMembers={packageData.team.members}
          />
        </div>
      }
    />
  );
}

PackageDetailLayout.displayName = "PackageDetailLayout";

function getPackageData(packageId: string) {
  return getPackageDummyData(packageId);
}

function getMetaInfoData(packageData: Package) {
  return [
    {
      key: "1",
      label: "Last Updated",
      content: <>{packageData.lastUpdated}</>,
    },
    {
      key: "2",
      label: "First Updated",
      content: <>{packageData.firstUploaded}</>,
    },
    {
      key: "3",
      label: "Downloads",
      content: <>{formatInteger(packageData.downloadCount)}</>,
    },
    {
      key: "4",
      label: "Likes",
      content: <>{formatInteger(packageData.likes)}</>,
    },
    {
      key: "5",
      label: "Dependency string",
      content: (
        <>
          {packageData.dependencyString}
          <CopyButton text={packageData.dependencyString} />
        </>
      ),
    },
    { key: "6", label: "Dependants", content: <a href="/">5 other mods</a> },
  ];
}

const tabs = [
  { key: 1, label: "Description" },
  { key: 2, label: "Images" },
  { key: 3, label: "ChangeLog" },
  { key: 4, label: "Versions" },
];

function getTabContent(currentTab: number, packageData: Package) {
  let tabContent = null;
  if (currentTab === 1) {
    tabContent = (
      <>
        <Title text={packageData.name} />
        <p className={styles.description}>{packageData.description}</p>
      </>
    );
  } else if (currentTab === 2) {
    //TODO: proper image carousel or something
    tabContent = (
      <>
        <img src={packageData.imageSource} alt={packageData.name} />
        <img src={packageData.imageSource} alt={packageData.name} />
        <img src={packageData.imageSource} alt={packageData.name} />
      </>
    );
  } else if (currentTab === 3) {
    tabContent = <PackageChangeLog packageId={packageData.name} />;
  } else if (currentTab === 4) {
    tabContent = <PackageVersions />;
  }
  return tabContent;
}
