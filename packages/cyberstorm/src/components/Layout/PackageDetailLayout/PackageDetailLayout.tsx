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
import { Tooltip } from "../../Tooltip/Tooltip";
import { usePromise } from "@thunderstore/use-promise";
import { Icon } from "../../Icon/Icon";

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
        <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
          <Button.Icon>
            <Icon>
              <FontAwesomeIcon icon={faUsers} />
            </Icon>
          </Button.Icon>
          <Button.Label>{packageData.team.name}</Button.Label>
        </Button.Root>
      </TeamLink>
    );
  }
  if (packageData.gitHubLink) {
    packageDetailsMeta.push(
      <a key="2" href={packageData.gitHubLink}>
        <Button.Root>
          <Button.Label>GitHub</Button.Label>
          <Button.Icon>
            <Icon>
              <FontAwesomeIcon icon={faGithub} />
            </Icon>
          </Button.Icon>
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
          {packageData.name}
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
                <Button.Root paddingSize="large" colorScheme="success">
                  <Button.Label>Save changes</Button.Label>
                </Button.Root>
              }
              additionalFooterContent={
                packageData.isDeprecated ? (
                  <Button.Root paddingSize="large" colorScheme="default">
                    <Button.Label>Undeprecate</Button.Label>
                  </Button.Root>
                ) : (
                  <Button.Root paddingSize="large" colorScheme="warning">
                    <Button.Label>Deprecate</Button.Label>
                  </Button.Root>
                )
              }
              trigger={
                <Button.Root
                  colorScheme="transparentDefault"
                  paddingSize="large"
                >
                  <Button.Icon>
                    <Icon>
                      <FontAwesomeIcon icon={faCog} />
                    </Icon>
                  </Button.Icon>
                  <Button.Label>Manage</Button.Label>
                </Button.Root>
              }
            />
            <a className={styles.installButton} href="/">
              <Button.Root plain paddingSize="huge" colorScheme="fancyAccent">
                <Button.Icon>
                  <ThunderstoreLogo />
                </Button.Icon>
                <Button.Label fontSize="huge" fontWeight="800">
                  Install
                </Button.Label>
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
                <Button.Icon>
                  <FontAwesomeIcon icon={faDownload} />
                </Button.Icon>
                <Button.Label>Download</Button.Label>
              </Button.Root>
            </a>
            <Tooltip content="Donate to author" side="bottom">
              <Button.Root colorScheme="primary" paddingSize="mediumSquare">
                <Button.Icon>
                  <Icon>
                    <FontAwesomeIcon icon={faDonate} />
                  </Icon>
                </Button.Icon>
              </Button.Root>
            </Tooltip>
            <Tooltip content="Like" side="bottom">
              <Button.Root colorScheme="primary" paddingSize="mediumSquare">
                <Button.Icon>
                  <Icon>
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </Icon>
                </Button.Icon>
              </Button.Root>
            </Tooltip>
            <Tooltip content="Report" side="bottom">
              <Button.Root colorScheme="primary" paddingSize="mediumSquare">
                <Button.Icon>
                  <Icon>
                    <FontAwesomeIcon icon={faFlag} />
                  </Icon>
                </Button.Icon>
              </Button.Root>
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
      <Icon>
        <FontAwesomeIcon
          icon={faFileLines}
          fixedWidth
          className={styles.tabIcon}
        />
      </Icon>
    ),
  },
  {
    key: 2,
    label: "Changelog",
    icon: (
      <Icon>
        <FontAwesomeIcon
          icon={faFilePlus}
          fixedWidth
          className={styles.tabIcon}
        />
      </Icon>
    ),
  },
  {
    key: 3,
    label: "Versions",
    icon: (
      <Icon>
        <FontAwesomeIcon
          icon={faCodeBranch}
          fixedWidth
          className={styles.tabIcon}
        />
      </Icon>
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
