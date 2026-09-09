import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { faLips } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Heading, NewIcon, NewTag } from "@thunderstore/cyberstorm";
import { type DapperTsInterface } from "@thunderstore/dapper-ts";

import "./PackageCategoriesAndTags.css";

type PackageDetailListing = Awaited<
  ReturnType<DapperTsInterface["getPackageListingDetails"]>
>;
type PackageDetailCommunity = Awaited<
  ReturnType<DapperTsInterface["getCommunity"]>
>;

function categoryTags(
  listing: PackageDetailListing,
  community: PackageDetailCommunity
) {
  return listing.categories.map((category) => {
    return (
      <NewTag
        key={category.name}
        csMode="cyberstormLink"
        linkId="Community"
        community={community.identifier}
        queryParams={`includedCategories=${category.id}`}
        csSize="small"
        csVariant="primary"
      >
        {category.name}
      </NewTag>
    );
  });
}

/**
 * Sidebar box on the package detail page listing the package's categories
 * (filterable links) and, under a separate "Tags" heading, its non-filterable
 * status tags (Deprecated / NSFW). Renders nothing when neither is present.
 */
export function PackageCategoriesAndTags(props: {
  listing: PackageDetailListing;
  community: PackageDetailCommunity;
}) {
  const { listing, community } = props;

  const categories = categoryTags(listing, community);
  const hasCategories = categories.length > 0;
  const hasTags = listing.is_deprecated || listing.is_nsfw;

  if (!hasCategories && !hasTags) {
    return null;
  }

  return (
    <div className="package-categories-and-tags">
      {hasCategories ? (
        <div className="package-categories-and-tags__section">
          <Heading csLevel="4" csSize="4">
            Categories
          </Heading>
          <div className="package-categories-and-tags__body">{categories}</div>
        </div>
      ) : null}
      {hasTags ? (
        <div className="package-categories-and-tags__section">
          <Heading csLevel="4" csSize="4">
            Tags
          </Heading>
          <div className="package-categories-and-tags__body">
            {listing.is_deprecated ? (
              <NewTag csSize="small" csModifiers={["dark"]} csVariant="yellow">
                <NewIcon noWrapper csMode="inline">
                  <FontAwesomeIcon icon={faWarning} />
                </NewIcon>
                Deprecated
              </NewTag>
            ) : null}
            {listing.is_nsfw ? (
              <NewTag csSize="small" csModifiers={["dark"]} csVariant="pink">
                <NewIcon noWrapper csMode="inline">
                  <FontAwesomeIcon icon={faLips} />
                </NewIcon>
                NSFW
              </NewTag>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

PackageCategoriesAndTags.displayName = "PackageCategoriesAndTags";
