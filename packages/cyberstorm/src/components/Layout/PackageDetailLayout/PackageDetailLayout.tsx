"use client";
import styles from "./PackageDetailLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import {
  CommunitiesLink,
  CommunityLink,
  PackageLink,
  TeamLink,
} from "../../Links/Links";
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
import { Package } from "../../../schema";
import { useState } from "react";
import { Tabs } from "../../Tabs/Tabs";
import { PackageChangeLog } from "./PackageChangeLog/PackageChangeLog";
import { PackageVersions } from "./PackageVersions/PackageVersions";
import { Link } from "../../Link/Link";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faCodeBranch,
  faFileLines,
  faFilePlus,
} from "@fortawesome/pro-regular-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import { PackageTagList } from "./PackageTagList/PackageTagList";
import { PackageTeamMemberList } from "./PackageTeamMemberList/PackageTeamMemberList";
import { ThunderstoreLogo } from "../../../svg/svg";
import { getPackageDummyData } from "../../../dummyData";

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
  const packageData = dapper.getPackage(community, namespace, packageName);
  const metaInfoData = getMetaInfoData(packageData);

  const [currentTab, setCurrentTab] = useState(1);

  const packageDetailsMeta = [];
  if (packageData.author) {
    packageDetailsMeta.push(
      <TeamLink team={packageData.team.name}>
        <PlainButton
          colorScheme="transparentPrimary"
          size="mediumTight"
          label={packageData.team.name}
          leftIcon={<FontAwesomeIcon icon={faUsers} fixedWidth />}
        />
      </TeamLink>
    );
  }
  if (packageData.gitHubLink) {
    packageDetailsMeta.push(
      <Link
        externalUrl={packageData.gitHubLink}
        label="GitHub"
        leftIcon={<FontAwesomeIcon icon={faGithub} fixedWidth />}
      />
    );
  }

  return (
    <BaseLayout
      backGroundImageSource={packageData.imageSource}
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
                <Button label="Save changes" colorScheme="accent" />
              }
              additionalFooterContent={
                <Button label="Deprecate" colorScheme="warning" />
              }
              trigger={
                <Button
                  colorScheme="transparentDefault"
                  leftIcon={<FontAwesomeIcon icon={faCog} fixedWidth />}
                  label="Manage"
                />
              }
            />
            <a href="/">
              <div className={styles.installButton}>
                <PlainButton
                  size="large"
                  label="Install"
                  colorScheme="accent"
                  leftIcon={
                    <div className={styles.installButtonIcon}>
                      <ThunderstoreLogo />
                    </div>
                  }
                />
              </div>
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
            <div className={styles.metaDownloadButton}>
              <Button
                colorScheme="primary"
                leftIcon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
                label="Download"
              />
            </div>
            <Button
              colorScheme="primary"
              size="mediumIcon"
              leftIcon={<FontAwesomeIcon icon={faDonate} fixedWidth />}
            />
            <Button
              colorScheme="primary"
              size="mediumIcon"
              leftIcon={<FontAwesomeIcon icon={faThumbsUp} fixedWidth />}
            />
            <Button
              colorScheme="primary"
              size="mediumIcon"
              leftIcon={<FontAwesomeIcon icon={faFlag} fixedWidth />}
            />
          </div>
          <MetaInfoItemList metaInfoData={metaInfoData} />
          <PackageTagList tags={packageData.categories} />
          <PackageDependencyList
            packages={[
              getPackageDummyData("1"),
              getPackageDummyData("2"),
              getPackageDummyData("3"),
              getPackageDummyData("4"),
            ]}
          />
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
          <div className={styles.dependencyString}>
            {packageData.dependencyString}
          </div>
          <CopyButton text={packageData.dependencyString} />
        </div>
      ),
    },
  ];
}

const tabs = [
  {
    key: 1,
    label: "Description",
    icon: <FontAwesomeIcon icon={faFileLines} fixedWidth />,
  },
  {
    key: 2,
    label: "ChangeLog",
    icon: <FontAwesomeIcon icon={faFilePlus} fixedWidth />,
  },
  {
    key: 3,
    label: "Versions",
    icon: <FontAwesomeIcon icon={faCodeBranch} fixedWidth />,
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
