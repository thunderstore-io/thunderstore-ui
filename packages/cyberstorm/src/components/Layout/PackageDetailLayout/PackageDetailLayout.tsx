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
import { usePromise } from "@thunderstore/use-promise";

import { PackageChangeLog } from "./PackageChangeLog/PackageChangeLog";
import styles from "./PackageDetailLayout.module.css";
import { PackageDependencyList } from "./PackageDependencyList/PackageDependencyList";
import { PackageManagementForm } from "./PackageManagementForm/PackageManagementForm";
import { PackageMetaItems } from "./PackageMetaItems/PackageMetaItems";
import { PackageTagList } from "./PackageTagList/PackageTagList";
import { PackageTeamMemberList } from "./PackageTeamMemberList/PackageTeamMemberList";
import { PackageVersions } from "./PackageVersions/PackageVersions";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { PLACEHOLDER } from "../Developers/MarkdownPreview/MarkdownPlaceholder";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import * as Button from "../../Button/";
import { CommunitiesLink, CommunityLink, TeamLink } from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import * as Dialog from "../../Dialog";
import { Icon } from "../../Icon/Icon";
import markdownStyles from "../../Markdown/Markdown.module.css";
import Tabs from "../../NewTabs/Tabs";
import { Tag } from "../../Tag/Tag";
import { WrapperCard } from "../../WrapperCard/WrapperCard";
import { ThunderstoreLogo } from "../../../svg/svg";
import { getDownloadUrl, getInstallUrl } from "../../../utils/utils";

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
  const displayName = packageName.replace(/_/g, " ");

  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackage, [
    communityId,
    namespaceId,
    packageName,
  ]);

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
          {displayName}
        </BreadCrumbs>
      }
      header={
        <div className={styles.packageInfo}>
          <PageHeader
            title={displayName}
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
            <Dialog.Root title="Manage Package" trigger={<ManageButton />}>
              <PackageManagementForm isDeprecated={packageData.is_deprecated} />
            </Dialog.Root>
            <a
              href={getInstallUrl(packageData)}
              className={styles.installButton}
            >
              <InstallButton />
            </a>
          </div>
        </div>
      }
      mainContent={
        <Tabs>
          <Tabs.Tab name="details" label="Details" icon={faFileLines}>
            <div
              dangerouslySetInnerHTML={{ __html: PLACEHOLDER() }}
              className={markdownStyles.root}
            />
          </Tabs.Tab>

          <Tabs.Tab name="changelog" label="Changelog" icon={faFilePlus}>
            <PackageChangeLog packageId={packageData.name} />
          </Tabs.Tab>

          <Tabs.Tab name="versions" label="Versions" icon={faCodeBranch}>
            <PackageVersions />
          </Tabs.Tab>
        </Tabs>
      }
      rightSidebarContent={
        <div className={styles.metaInfo}>
          <div className={styles.metaButtonWrapper}>
            <a
              href={getDownloadUrl(packageData)}
              className={styles.metaDownloadButton}
            >
              <DownloadButton />
            </a>
            <DonateButton onClick={TODO} />
            <LikeButton onClick={TODO} />
            <ReportButton onClick={TODO} />
          </div>
          <PackageMetaItems package={packageData} />
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

const TODO = () => Promise.resolve();

interface Clickable {
  onClick: () => Promise<void>;
}

const LikeButton = (props: Clickable) => (
  <Button.Root
    onClick={props.onClick}
    tooltipText="Like"
    colorScheme="primary"
    paddingSize="mediumSquare"
  >
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faThumbsUp} />
    </Button.ButtonIcon>
  </Button.Root>
);

const DonateButton = (props: Clickable) => (
  <Button.Root
    onClick={props.onClick}
    tooltipText="Donate to author"
    colorScheme="primary"
    paddingSize="mediumSquare"
  >
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faDonate} />
    </Button.ButtonIcon>
  </Button.Root>
);

const ReportButton = (props: Clickable) => (
  <Button.Root
    onClick={props.onClick}
    tooltipText="Report"
    colorScheme="primary"
    paddingSize="mediumSquare"
  >
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faFlag} />
    </Button.ButtonIcon>
  </Button.Root>
);

const ManageButton = () => (
  <Button.Root colorScheme="primary" paddingSize="medium">
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faCog} />
    </Button.ButtonIcon>
    <Button.ButtonLabel>Manage</Button.ButtonLabel>
  </Button.Root>
);

const InstallButton = () => (
  <Button.Root plain paddingSize="huge" colorScheme="fancyAccent">
    <Button.ButtonIcon iconSize="big">
      <ThunderstoreLogo />
    </Button.ButtonIcon>
    <Button.ButtonLabel fontSize="huge" fontWeight="800">
      Install
    </Button.ButtonLabel>
  </Button.Root>
);

const DownloadButton = () => (
  <Button.Root plain colorScheme="primary" paddingSize="medium">
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faDownload} />
    </Button.ButtonIcon>
    <Button.ButtonLabel>Download</Button.ButtonLabel>
  </Button.Root>
);
