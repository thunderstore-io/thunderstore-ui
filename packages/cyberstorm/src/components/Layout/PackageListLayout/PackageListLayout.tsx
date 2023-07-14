import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommunitiesLink, CommunityLink } from "../../Links/Links";
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
import { useDapper } from "@thunderstore/dapper";
import usePromise from "react-promise-suspense";

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

  const dapper = useDapper();
  const communityData = usePromise(dapper.getCommunity, [communityId]);

  return (
    <BaseLayout
      backGroundImageSource={
        communityData.community.background_image_url ||
        "/images/community_bg.png"
      }
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={communityData.community.name}>
            {communityData.community.name}
          </CommunityLink>
        </BreadCrumbs>
      }
      header={
        <PageHeader
          title={communityData.community.name}
          description={communityData.community.description}
          image={
            <CommunityImage
              src={
                communityData.community.portrait_image_url || "/images/game.png"
              }
            />
          }
          meta={[
            <MetaItem
              key="meta-packages"
              label={
                formatInteger(communityData.community.total_package_count) +
                " Packages"
              }
              icon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
              colorScheme="accent"
              size="bold_large"
            />,
            <MetaItem
              key="meta-downloads"
              label={
                formatInteger(communityData.community.total_download_count) +
                " Downloads"
              }
              icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
              colorScheme="accent"
              size="bold_large"
            />,
            <MetaItem
              key="meta-servers"
              label={
                formatInteger(communityData.community.total_server_count) +
                " Servers"
              }
              icon={<FontAwesomeIcon icon={faServer} fixedWidth />}
              colorScheme="accent"
              size="bold_large"
            />,
            <Link
              key="meta-link"
              leftIcon={<FontAwesomeIcon icon={faDiscord} fixedWidth />}
              label="Join our community"
              externalUrl="https://discord.thunderstore.io/"
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
