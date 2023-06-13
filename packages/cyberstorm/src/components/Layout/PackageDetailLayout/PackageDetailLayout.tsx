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
import { Button } from "../../Button/Button";
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
import { Link } from "../../Link/Link";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faCodeBranch,
  faFileLines,
  faFilePlus,
  faImages,
} from "@fortawesome/pro-regular-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { PackageImages } from "./PackageImages/PackageImages";
import { useDapper } from "@thunderstore/dapper";

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
        <Link
          label={packageData.team.name}
          leftIcon={<FontAwesomeIcon icon={faUser} fixedWidth />}
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
  {
    key: 1,
    label: "Description",
    icon: <FontAwesomeIcon icon={faFileLines} fixedWidth />,
  },
  {
    key: 2,
    label: "Images",
    icon: <FontAwesomeIcon icon={faImages} fixedWidth />,
  },
  {
    key: 3,
    label: "ChangeLog",
    icon: <FontAwesomeIcon icon={faFilePlus} fixedWidth />,
  },
  {
    key: 4,
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
    tabContent = (
      <PackageImages
        images={[
          { imageSource: packageData.imageSource, alt: "first" },
          { imageSource: packageData.imageSource, alt: "second" },
          { imageSource: packageData.imageSource, alt: "third" },
        ]}
      />
    );
  } else if (currentTab === 3) {
    tabContent = <PackageChangeLog packageId={packageData.name} />;
  } else if (currentTab === 4) {
    tabContent = <PackageVersions />;
  }
  return tabContent;
}
