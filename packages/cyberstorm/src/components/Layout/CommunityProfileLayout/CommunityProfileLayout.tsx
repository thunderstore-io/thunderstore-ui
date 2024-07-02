"use client";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUpRightFromSquare,
  faBoxOpen,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import { BaseLayout } from "../BaseLayout/BaseLayout";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import * as Button from "../../Button/";
import { ImageWithFallback } from "../../ImageWithFallback/ImageWithFallback";
import { CyberstormLink } from "../../Links/Links";
import { MetaItem } from "../../MetaItem/MetaItem";
import { PackageSearch } from "../../PackageSearch/PackageSearch";
import { formatInteger } from "../../../utils/utils";

interface Props {
  communityId: string;
}

/**
 * View for showing Community's package listing.
 */
export function CommunityProfileLayout(props: Props) {
  const { communityId } = props;

  const dapper = useDapper();
  const community = usePromise(dapper.getCommunity, [communityId]);
  const filters = usePromise(dapper.getCommunityFilters, [communityId]);

  const listingType = { kind: "community" as const, communityId };

  return (
    <BaseLayout
      backGroundImageSource={community.background_image_url}
      breadCrumb={
        <BreadCrumbs>
          <CyberstormLink linkId="Communities">Communities</CyberstormLink>
          <CyberstormLink linkId="Community" community={community.identifier}>
            {community.name}
          </CyberstormLink>
        </BreadCrumbs>
      }
      header={
        <PageHeader
          title={community.name}
          description={community.description}
          image={
            <ImageWithFallback
              src={community.cover_image_url}
              type="community"
            />
          }
          meta={[
            <MetaItem
              key="meta-packages"
              label={`${formatInteger(community.total_package_count)} packages`}
              icon={<FontAwesomeIcon icon={faBoxOpen} />}
              colorScheme="accent"
              size="bold_large"
            />,
            <MetaItem
              key="meta-downloads"
              label={`${formatInteger(
                community.total_download_count
              )} downloads`}
              icon={<FontAwesomeIcon icon={faDownload} />}
              colorScheme="accent"
              size="bold_large"
            />,
            community.discord_url ? (
              <a key="meta-link" href="{community.discord_url}">
                <Button.Root colorScheme="transparentPrimary">
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faDiscord} />
                  </Button.ButtonIcon>
                  <Button.ButtonLabel>Join our community</Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </Button.ButtonIcon>
                </Button.Root>
              </a>
            ) : null,
          ]}
        />
      }
      mainContent={
        <PackageSearch
          listingType={listingType}
          packageCategories={filters.package_categories}
          sections={filters.sections}
        />
      }
    />
  );
}

CommunityProfileLayout.displayName = "CommunityProfileLayout";
