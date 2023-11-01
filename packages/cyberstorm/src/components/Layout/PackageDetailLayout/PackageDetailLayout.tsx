"use client";
import styles from "./PackageDetailLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import {
  CommunitiesLink,
  CommunityLink,
  PackageDependantsLink,
  TeamLink,
} from "../../Links/Links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Button from "../../Button/";
import { Title } from "../../Title/Title";
import { Dialog } from "../../Dialog/Dialog";
import { PackageManagementForm } from "./PackageManagementForm/PackageManagementForm";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { MetaInfoItemList } from "../../MetaInfoItemList/MetaInfoItemList";
import {
  faDonate,
  faDownload,
  faCog,
  faThumbsUp,
  faFlag,
} from "@fortawesome/pro-solid-svg-icons";
import { faUsers } from "@fortawesome/pro-regular-svg-icons";
import { PackageDependencyList } from "./PackageDependencyList/PackageDependencyList";
import { CopyButton } from "../../CopyButton/CopyButton";
import { formatInteger } from "../../../utils/utils";
import { useState } from "react";
import { Tabs } from "../../Tabs/Tabs";
import { PackageChangeLog } from "./PackageChangeLog/PackageChangeLog";
import { PackageVersions } from "./PackageVersions/PackageVersions";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faCodeBranch,
  faFileLines,
  faFilePlus,
} from "@fortawesome/pro-regular-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import { Package } from "@thunderstore/dapper/types";
import { PackageTagList } from "./PackageTagList/PackageTagList";
import { PackageTeamMemberList } from "./PackageTeamMemberList/PackageTeamMemberList";
import { ThunderstoreLogo } from "../../../svg/svg";
import { usePromise } from "@thunderstore/use-promise";

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
      <TeamLink
        key="team"
        community={packageData.community}
        team={packageData.team.name}
      >
        <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faUsers} />
          </Button.ButtonIcon>
          <Button.ButtonLabel>{packageData.team.name}</Button.ButtonLabel>
        </Button.Root>
      </TeamLink>
    );
  }
  if (packageData.gitHubLink) {
    packageDetailsMeta.push(
      <a key="github" href={packageData.gitHubLink}>
        <Button.Root>
          <Button.ButtonLabel>GitHub</Button.ButtonLabel>
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faGithub} />
          </Button.ButtonIcon>
        </Button.Root>
      </a>
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
          Packages
          <TeamLink
            community={packageData.community}
            team={packageData.team.name}
          >
            {packageData.team.name}
          </TeamLink>
          {packageData.name}
        </BreadCrumbs>
      }
      header={
        <div className={styles.packageInfo}>
          <PageHeader
            title={packageData.name}
            image={
              <img
                className={styles.modImage}
                alt={packageData.name}
                src={packageData.imageSource}
              />
            }
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
                <Button.Root paddingSize="large" colorScheme="success">
                  <Button.ButtonLabel>Save changes</Button.ButtonLabel>
                </Button.Root>
              }
              additionalFooterContent={
                packageData.isDeprecated ? (
                  <Button.Root paddingSize="large" colorScheme="default">
                    <Button.ButtonLabel>Undeprecate</Button.ButtonLabel>
                  </Button.Root>
                ) : (
                  <Button.Root paddingSize="large" colorScheme="warning">
                    <Button.ButtonLabel>Deprecate</Button.ButtonLabel>
                  </Button.Root>
                )
              }
              trigger={
                <Button.Root colorScheme="primary" paddingSize="medium">
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faCog} />
                  </Button.ButtonIcon>
                  <Button.ButtonLabel>Manage</Button.ButtonLabel>
                </Button.Root>
              }
            />
            <a className={styles.installButton} href="/">
              <Button.Root plain paddingSize="huge" colorScheme="fancyAccent">
                <Button.ButtonIcon iconSize="tslogo_install_button">
                  <ThunderstoreLogo />
                </Button.ButtonIcon>
                <Button.ButtonLabel fontSize="huge" fontWeight="800">
                  Install
                </Button.ButtonLabel>
              </Button.Root>
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
              <Button.Root plain colorScheme="primary" paddingSize="medium">
                <Button.ButtonIcon>
                  <FontAwesomeIcon icon={faDownload} />
                </Button.ButtonIcon>
                <Button.ButtonLabel>Download</Button.ButtonLabel>
              </Button.Root>
            </a>
            <Button.Root
              tooltipText="Donate to author"
              colorScheme="primary"
              paddingSize="mediumSquare"
            >
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faDonate} />
              </Button.ButtonIcon>
            </Button.Root>
            <Button.Root
              tooltipText="Like"
              colorScheme="primary"
              paddingSize="mediumSquare"
            >
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faThumbsUp} />
              </Button.ButtonIcon>
            </Button.Root>
            <Button.Root
              tooltipText="Report"
              colorScheme="primary"
              paddingSize="mediumSquare"
            >
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faFlag} />
              </Button.ButtonIcon>
            </Button.Root>
          </div>
          <MetaInfoItemList metaInfoData={metaInfoData} />
          <PackageTagList tags={packageData.categories} />
          <PackageDependencyList namespace={namespace} community={community} />
          <PackageTeamMemberList
            community={packageData.community}
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
    icon: <FontAwesomeIcon icon={faFileLines} className={styles.tabIcon} />,
  },
  {
    key: 2,
    label: "Changelog",
    icon: <FontAwesomeIcon icon={faFilePlus} className={styles.tabIcon} />,
  },
  {
    key: 3,
    label: "Versions",
    icon: <FontAwesomeIcon icon={faCodeBranch} className={styles.tabIcon} />,
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
