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
import * as Dialog from "../../Dialog/";
import { PackageManagementForm } from "./PackageManagementForm/PackageManagementForm";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { MetaInfoItemList } from "../../MetaInfoItemList/MetaInfoItemList";
import {
  faDonate,
  faDownload,
  faCog,
  faThumbsUp,
  faFlag,
  faCodeBranch,
  faFileLines,
  faFilePlus,
  faArrowUpRight,
  faBoxes,
} from "@fortawesome/pro-solid-svg-icons";
import { faUsers } from "@fortawesome/pro-regular-svg-icons";
import { PackageDependencyList } from "./PackageDependencyList/PackageDependencyList";
import { CopyButton } from "../../CopyButton/CopyButton";
import { formatFileSize, formatInteger } from "../../../utils/utils";
import { useState } from "react";
import { Tabs } from "../../Tabs/Tabs";
import { PackageChangeLog } from "./PackageChangeLog/PackageChangeLog";
import { PackageVersions } from "./PackageVersions/PackageVersions";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import { Package } from "@thunderstore/dapper/types";
import { PackageTagList } from "./PackageTagList/PackageTagList";
import { PackageTeamMemberList } from "./PackageTeamMemberList/PackageTeamMemberList";
import { ThunderstoreLogo } from "../../../svg/svg";
import { usePromise } from "@thunderstore/use-promise";
import { WrapperCard } from "../../WrapperCard/WrapperCard";
import { Tag } from "../../Tag/Tag";
import { Icon } from "../../Icon/Icon";
import { PLACEHOLDER } from "../Developers/MarkdownPreview/MarkdownPlaceholder";
import markdownStyles from "../../Markdown/Markdown.module.css";

export interface PackageDetailLayoutProps {
  community: string;
  namespace: string;
  packageName: string;
  managementDialogIsOpen?: boolean;
}

/**
 * Cyberstorm PackageDetail Layout
 *
 * TODO: Use community.background_image_url as the background
 * TODO: Change BaseLayout.backGroundImageSource to accept null rather
 *       than undefined if image URLs are not available, as this is what
 *       backend returns. (Unless we have a default image.)
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

  const mappedPackageTagList = packageData.categories.map((category) => {
    return (
      <Tag
        colorScheme="borderless_no_hover"
        size="mediumPlus"
        key={category.name}
        label={category.name.toUpperCase()}
      />
    );
  });

  const packageDetailsMeta = [
    <TeamLink
      key="team"
      community={packageData.community_identifier}
      team={packageData.namespace}
    >
      <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
        <Button.ButtonIcon>
          <FontAwesomeIcon icon={faUsers} />
        </Button.ButtonIcon>
        <Button.ButtonLabel>{packageData.namespace}</Button.ButtonLabel>
      </Button.Root>
    </TeamLink>,
  ];

  if (packageData.gitHubLink) {
    packageDetailsMeta.push(
      <a key="github" href={packageData.gitHubLink}>
        <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faGithub} />
          </Button.ButtonIcon>
          <Button.ButtonLabel>GitHub</Button.ButtonLabel>
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faArrowUpRight} />
          </Button.ButtonIcon>
        </Button.Root>
      </a>
    );
  }
  if (packageData.discordLink) {
    packageDetailsMeta.push(
      <a key="discord" href={packageData.discordLink}>
        <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faDiscord} />
          </Button.ButtonIcon>
          <Button.ButtonLabel>Discord</Button.ButtonLabel>
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faArrowUpRight} />
          </Button.ButtonIcon>
        </Button.Root>
      </a>
    );
  }

  return (
    <BaseLayout
      backGroundImageSource={packageData.icon_url || undefined}
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={packageData.community_identifier}>
            {packageData.community_name}
          </CommunityLink>
          Packages
          <TeamLink
            community={packageData.community_identifier}
            team={packageData.namespace}
          >
            {packageData.namespace}
          </TeamLink>
          {packageData.name}
        </BreadCrumbs>
      }
      header={
        <div className={styles.packageInfo}>
          <PageHeader
            title={packageData.name}
            image={
              packageData.icon_url ? (
                <img
                  className={styles.modImage}
                  alt=""
                  src={packageData.icon_url}
                />
              ) : undefined
            }
            description={packageData.shortDescription}
            meta={packageDetailsMeta}
          />
          <div className={styles.headerActions}>
            <Dialog.Root
              defaultOpen={managementDialogIsOpen}
              title="Manage Package"
              trigger={
                <Button.Root colorScheme="primary" paddingSize="medium">
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faCog} />
                  </Button.ButtonIcon>
                  <Button.ButtonLabel>Manage</Button.ButtonLabel>
                </Button.Root>
              }
            >
              <PackageManagementForm packageData={packageData} />
            </Dialog.Root>
            <a className={styles.installButton} href="/">
              <Button.Root plain paddingSize="huge" colorScheme="fancyAccent">
                <Button.ButtonIcon iconSize="big">
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
          <WrapperCard
            title="Categories"
            content={
              <div className={styles.categoriesCard}>
                {mappedPackageTagList}
              </div>
            }
            headerIcon={
              <Icon>
                <FontAwesomeIcon icon={faBoxes} />
              </Icon>
            }
          />
          <PackageTagList packageData={packageData} />
          <PackageDependencyList namespace={namespace} community={community} />
          <PackageTeamMemberList
            community={packageData.community_identifier}
            teamName={packageData.namespace}
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
      content: <>{packageData.last_updated}</>,
    },
    {
      key: "2",
      label: "First Updated",
      content: <>{packageData.firstUploaded}</>,
    },
    {
      key: "3",
      label: "Downloads",
      content: <>{formatInteger(packageData.download_count)}</>,
    },
    {
      key: "4",
      label: "Likes",
      content: <>{formatInteger(packageData.rating_count)}</>,
    },
    {
      key: "5",
      label: "Size",
      content: <>{formatFileSize(packageData.size)}</>,
    },
    {
      key: "6",
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
      key: "7",
      label: "Dependants",
      content: (
        <PackageDependantsLink
          community={packageData.community_identifier}
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
  const placeholder = PLACEHOLDER();
  let tabContent = null;
  if (currentTab === 1) {
    tabContent = (
      <div
        dangerouslySetInnerHTML={{ __html: placeholder }}
        className={markdownStyles.root}
      />
    );
  } else if (currentTab === 2) {
    tabContent = <PackageChangeLog packageId={packageData.name} />;
  } else if (currentTab === 3) {
    tabContent = <PackageVersions />;
  }
  return tabContent;
}
