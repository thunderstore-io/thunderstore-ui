"use client";
import styles from "./PackageDetailLayout.module.css";
import { PackageBreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { PackageDependantsLink, TeamLink } from "../../Links/Links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, PlainButton } from "../../Button/Button";
import { ModIcon } from "../../ModIcon/ModIcon";
import { Title } from "../../Title/Title";
import { Dialog } from "../../Dialog/Dialog";
import { PackageManagementForm } from "./PackageManagementForm/PackageManagementForm";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { MetaInfoItemList } from "../../MetaInfoItemList/MetaInfoItemList";
import {
  faDonate,
  faDownload,
  faCog,
  faUsers,
  faThumbsUp,
  faFlag,
} from "@fortawesome/pro-solid-svg-icons";
import { PackageDependencyList } from "./PackageDependencyList/PackageDependencyList";
import { CopyButton } from "../../CopyButton/CopyButton";
import { formatInteger } from "../../../utils/utils";
import { useState } from "react";
import { Tabs } from "../../Tabs/Tabs";
import { PackageChangeLog } from "./PackageChangeLog/PackageChangeLog";
import { PackageVersions } from "./PackageVersions/PackageVersions";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUpRight,
  faCodeBranch,
  faFileLines,
  faFilePlus,
} from "@fortawesome/pro-regular-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import { Package } from "@thunderstore/dapper/schema";
import { PackageTagList } from "./PackageTagList/PackageTagList";
import { PackageTeamMemberList } from "./PackageTeamMemberList/PackageTeamMemberList";
import { ThunderstoreLogo } from "../../../svg/svg";
import { Tooltip } from "../../Tooltip/Tooltip";
import usePromise from "react-promise-suspense";

export interface PackageDetailLayoutProps {
  community: string;
  namespace: string;
  packageName: string;
  managementDialogIsOpen?: boolean;
}

/**
 * Cyberstorm PackageDetail Layout
 */
export function PackageDetailLayout(props: PackageDetailLayoutProps) {
  const {
    managementDialogIsOpen = false,
    community,
    namespace,
    packageName,
  } = props;
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackage, [
    community,
    namespace,
    packageName,
  ]);
  const metaInfoData = getMetaInfoData(packageData);

  const [currentTab, setCurrentTab] = useState(1);

  const packageDetailsMeta = [];
  if (packageData.author) {
    packageDetailsMeta.push(
      <TeamLink key="1" team={packageData.team.name}>
        <PlainButton
          colorScheme="transparentPrimary"
          paddingSize="small"
          fontSize="medium"
          fontWeight="700"
          label={packageData.team.name}
          leftIcon={<FontAwesomeIcon icon={faUsers} fixedWidth />}
        />
      </TeamLink>
    );
  }
  if (packageData.gitHubLink) {
    packageDetailsMeta.push(
      <a key="2" href={packageData.gitHubLink}>
        <PlainButton
          label="GitHub"
          colorScheme="transparentPrimary"
          paddingSize="small"
          fontSize="medium"
          fontWeight="700"
          leftIcon={<FontAwesomeIcon icon={faGithub} fixedWidth />}
          rightIcon={<FontAwesomeIcon icon={faArrowUpRight} fixedWidth />}
        />
      </a>
    );
  }

  return (
    <BaseLayout
      backGroundImageSource={packageData.imageSource}
      breadCrumb={
        <PackageBreadCrumbs
          community={packageData.community}
          pageTitle={packageData.name}
        />
      }
      header={
        <div className={styles.packageInfo}>
          <PageHeader
            title={packageData.name}
            image={<ModIcon src={packageData.imageSource} />}
            description={packageData.shortDescription}
            meta={packageDetailsMeta}
          />
          <div className={styles.headerActions}>
            <Dialog
              showFooterBorder
              defaultOpen={managementDialogIsOpen}
              title="Manage Package"
              content={<PackageManagementForm />}
              acceptButton={
                <Button
                  paddingSize="large"
                  label="Save changes"
                  colorScheme="success"
                />
              }
              additionalFooterContent={
                packageData.isDeprecated ? (
                  <Button
                    paddingSize="large"
                    label="Undeprecate"
                    colorScheme="default"
                  />
                ) : (
                  <Button
                    paddingSize="large"
                    label="Deprecate"
                    colorScheme="warning"
                  />
                )
              }
              trigger={
                <Button
                  colorScheme="transparentDefault"
                  paddingSize="large"
                  fontSize="medium"
                  fontWeight="700"
                  leftIcon={<FontAwesomeIcon icon={faCog} fixedWidth />}
                  label="Manage"
                />
              }
            />
            <a className={styles.installButton} href="/">
              <PlainButton
                paddingSize="huge"
                fontSize="huge"
                fontWeight="800"
                label="Install"
                colorScheme="fancyAccent"
                leftIcon={
                  <div className={styles.installButtonIcon}>
                    <ThunderstoreLogo />
                  </div>
                }
              />
            </a>
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
            <a href="/" className={styles.metaDownloadButton}>
              <PlainButton
                colorScheme="primary"
                paddingSize="medium"
                fontSize="medium"
                fontWeight="700"
                leftIcon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
                label="Download"
              />
            </a>
            <Tooltip content="Donate to author" side="bottom">
              <Button
                colorScheme="primary"
                paddingSize="mediumSquare"
                fontSize="medium"
                leftIcon={<FontAwesomeIcon icon={faDonate} fixedWidth />}
              />
            </Tooltip>
            <Tooltip content="Like" side="bottom">
              <Button
                colorScheme="primary"
                paddingSize="mediumSquare"
                fontSize="medium"
                leftIcon={<FontAwesomeIcon icon={faThumbsUp} fixedWidth />}
              />
            </Tooltip>
            <Tooltip content="Report" side="bottom">
              <Button
                colorScheme="primary"
                paddingSize="mediumSquare"
                fontSize="medium"
                leftIcon={<FontAwesomeIcon icon={faFlag} fixedWidth />}
              />
            </Tooltip>
          </div>
          <MetaInfoItemList metaInfoData={metaInfoData} />
          <PackageTagList tags={packageData.categories} />
          <PackageDependencyList namespace={namespace} community={community} />
          <PackageTeamMemberList
            teamName={packageData.team.name}
            teamMembers={packageData.team.members}
          />
        </div>
      }
    />
  );
}

PackageDetailLayout.displayName = "PackageDetailLayout";

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
        <div className={styles.dependencyStringWrapper}>
          <div
            title={packageData.dependencyString}
            className={styles.dependencyString}
          >
            {packageData.dependencyString}
          </div>
          <CopyButton text={packageData.dependencyString} />
        </div>
      ),
    },
    {
      key: "6",
      label: "Dependants",
      content: (
        <PackageDependantsLink
          community={packageData.community}
          namespace={packageData.namespace}
          package={packageData.name}
        >
          <div className={styles.dependantsLink}>
            {packageData.dependantCount + " other mods"}
          </div>
        </PackageDependantsLink>
      ),
    },
  ];
}

const tabs = [
  {
    key: 1,
    label: "Details",
    icon: (
      <FontAwesomeIcon
        icon={faFileLines}
        fixedWidth
        className={styles.tabIcon}
      />
    ),
  },
  {
    key: 2,
    label: "Changelog",
    icon: (
      <FontAwesomeIcon
        icon={faFilePlus}
        fixedWidth
        className={styles.tabIcon}
      />
    ),
  },
  {
    key: 3,
    label: "Versions",
    icon: (
      <FontAwesomeIcon
        icon={faCodeBranch}
        fixedWidth
        className={styles.tabIcon}
      />
    ),
  },
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
    tabContent = <PackageChangeLog packageId={packageData.name} />;
  } else if (currentTab === 3) {
    tabContent = <PackageVersions />;
  }
  return tabContent;
}
