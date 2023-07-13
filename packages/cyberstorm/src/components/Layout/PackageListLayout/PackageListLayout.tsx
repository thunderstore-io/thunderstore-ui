import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommunitiesLink, CommunityLink } from "../../Links/Links";
import { getCommunityDummyData } from "@thunderstore/dapper/src/implementations/dummy/generate";
import { PackagePreview } from "@thunderstore/dapper/src/schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { MetaItem } from "../../MetaItem/MetaItem";
import { formatInteger } from "../../../utils/utils";
import {
  faBoxOpen,
  faDownload,
  faServer,
} from "@fortawesome/pro-regular-svg-icons";
import { Link } from "../../Link/Link";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { CommunityImage } from "../../CommunityImage/CommunityImage";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";

export interface PackageListLayoutProps {
  isLoading?: boolean;
  communityId: string;
  packageData?: PackagePreview[];
}

/**
 * Cyberstorm PackageList Layout
 */
export function PackageListLayout(props: PackageListLayoutProps) {
  const { communityId } = props;

  const communityData = getCommunityData(communityId);

  return (
    <BaseLayout
      backGroundImageSource={
        communityData.backgroundImageSource
          ? communityData.backgroundImageSource
          : "/images/community_bg.png"
      }
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={communityData.name}>
            {communityData.name}
          </CommunityLink>
        </BreadCrumbs>
      }
      header={
        <PageHeader
          title={communityData.name}
          description={communityData.description}
          image={
            <CommunityImage
              src={
                communityData.imageSource
                  ? communityData.imageSource
                  : "/images/game.png"
              }
            />
          }
          meta={[
            <MetaItem
              key="meta-packages"
              label={formatInteger(communityData.packageCount) + " Packages"}
              icon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
              colorScheme="accent"
              size="bold_large"
            />,
            <MetaItem
              key="meta-downloads"
              label={formatInteger(communityData.downloadCount) + " Downloads"}
              icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
              colorScheme="accent"
              size="bold_large"
            />,
            <MetaItem
              key="meta-servers"
              label={formatInteger(communityData.serverCount) + " Servers"}
              icon={<FontAwesomeIcon icon={faServer} fixedWidth />}
              colorScheme="accent"
              size="bold_large"
            />,
            <Link
              key="meta-link"
              leftIcon={<FontAwesomeIcon icon={faDiscord} fixedWidth />}
              label="Join our community"
              externalUrl="https://discord.gg/5MbXZvd"
              size="bold"
            />,
          ]}
        />
      }
      mainContent={<PackageSearchLayout communityId={communityId} />}
    />
  );
}

PackageListLayout.displayName = "PackageListLayout";

function getCommunityData(communityId: string) {
  return getCommunityDummyData(communityId);
}
