import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faBoxOpen, faDownload } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import { BaseLayout } from "../BaseLayout/BaseLayout";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import PackageSearchLayout from "../PackageSearchLayout/PackageSearchLayout";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import * as Button from "../../Button/";
import { CommunityImage } from "../../CommunityImage/CommunityImage";
import { Icon } from "../../Icon/Icon";
import { CommunitiesLink, CommunityLink } from "../../Links/Links";
import { MetaItem } from "../../MetaItem/MetaItem";
import { formatInteger } from "../../../utils/utils";

interface PackageListLayoutProps {
  communityId: string;
}

/**
 * View for showing Community's package listing.
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
              src={communityData.community.icon_url ?? "/images/game.png"}
            />
          }
          meta={[
            <MetaItem
              key="meta-packages"
              label={
                formatInteger(communityData.community.total_package_count) +
                " packages"
              }
              icon={
                <Icon>
                  <FontAwesomeIcon icon={faBoxOpen} />
                </Icon>
              }
              colorScheme="accent"
              size="bold_large"
            />,
            <MetaItem
              key="meta-downloads"
              label={
                formatInteger(communityData.community.total_download_count) +
                " downloads"
              }
              icon={
                <Icon>
                  <FontAwesomeIcon icon={faDownload} />
                </Icon>
              }
              colorScheme="accent"
              size="bold_large"
            />,
            <a key="meta-link" href="https://discord.thunderstore.io/">
              <Button.Root colorScheme="transparentPrimary">
                <Button.ButtonIcon>
                  <Icon>
                    <FontAwesomeIcon icon={faDiscord} />
                  </Icon>
                </Button.ButtonIcon>
                <Button.ButtonLabel>Join our community</Button.ButtonLabel>
              </Button.Root>
            </a>,
          ]}
        />
      }
      mainContent={<PackageSearchLayout communityId={communityId} />}
    />
  );
}

PackageListLayout.displayName = "PackageListLayout";
