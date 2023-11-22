"use client";
import { faUsers } from "@fortawesome/pro-regular-svg-icons";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDapper } from "@thunderstore/dapper";
import { Package } from "@thunderstore/dapper/types";
import { usePromise } from "@thunderstore/use-promise";
import { useState } from "react";

import { PackageChangeLog } from "./PackageChangeLog/PackageChangeLog";
import styles from "./PackageDetailLayout.module.css";
import { PackageDependencyList } from "./PackageDependencyList/PackageDependencyList";
import { PackageManagementForm } from "./PackageManagementForm/PackageManagementForm";
import { PackageTagList } from "./PackageTagList/PackageTagList";
import { PackageTeamMemberList } from "./PackageTeamMemberList/PackageTeamMemberList";
import { PackageVersions } from "./PackageVersions/PackageVersions";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { PLACEHOLDER } from "../Developers/MarkdownPreview/MarkdownPlaceholder";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import * as Button from "../../Button/";
import {
  CommunitiesLink,
  CommunityLink,
  PackageDependantsLink,
  TeamLink,
} from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { CopyButton } from "../../CopyButton/CopyButton";
import * as Dialog from "../../Dialog";
import { Icon } from "../../Icon/Icon";
import markdownStyles from "../../Markdown/Markdown.module.css";
import { MetaInfoItemList } from "../../MetaInfoItemList/MetaInfoItemList";
import { Tabs } from "../../Tabs/Tabs";
import { Tag } from "../../Tag/Tag";
import { WrapperCard } from "../../WrapperCard/WrapperCard";
import { ThunderstoreLogo } from "../../../svg/svg";
import { formatFileSize, formatInteger } from "../../../utils/utils";

export interface Props {
  communityId: string;
  namespaceId: string;
  packageName: string;
}

/**
 * Cyberstorm PackageDetail Layout
 *
 * TODO: Use community.background_image_url as the background
 * TODO: Change BaseLayout.backGroundImageSource to accept null rather
 *       than undefined if image URLs are not available, as this is what
 *       backend returns. (Unless we have a default image.)
 */
export function PackageDetailLayout(props: Props) {
  const { communityId, namespaceId, packageName } = props;

  const [currentTab, setCurrentTab] = useState(1);
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackage, [
    communityId,
    namespaceId,
    packageName,
  ]);

  const metaInfoData = getMetaInfoData(packageData);

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

    <a key="website" href={packageData.website_url}>
      <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
        <Button.ButtonLabel>{packageData.website_url}</Button.ButtonLabel>
        <Button.ButtonIcon>
          <FontAwesomeIcon icon={faArrowUpRight} />
        </Button.ButtonIcon>
      </Button.Root>
    </a>,
  ];

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
            description={packageData.description}
            meta={packageDetailsMeta}
          />
          <div className={styles.headerActions}>
            <Dialog.Root
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
              <PackageManagementForm isDeprecated={packageData.is_deprecated} />
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
          <PackageDependencyList
            namespace={namespaceId}
            community={communityId}
          />
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
      label: "First Uploaded",
      content: <>{packageData.datetime_created}</>,
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
            title={packageData.full_version_name}
            className={styles.dependencyString}
          >
            {packageData.full_version_name}
          </div>
          <CopyButton text={packageData.full_version_name} />
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
            {packageData.dependant_count + " other mods"}
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
