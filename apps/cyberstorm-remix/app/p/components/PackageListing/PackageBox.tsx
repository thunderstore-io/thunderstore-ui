import { Heading, NewIcon, NewTag } from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { faLips } from "@fortawesome/pro-solid-svg-icons";
import TeamMembers from "app/p/components/TeamMembers/TeamMembers";
import {
  type PackageListingDetails,
  type Community,
} from "@thunderstore/dapper/types";

type PackageBoxProps = {
  listing: PackageListingDetails;
  community: Community | Promise<Community>;
  domain: string;
};

function packageTags(
  listing: PackageListingDetails,
  community: Community | Promise<Community>
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

export function PackageBox({ listing, community, domain }: PackageBoxProps) {
  const pt = packageTags(listing, community);

  return (
    <>
      {pt.length > 0 || listing.is_deprecated || listing.is_nsfw ? (
        <div className="package-listing-sidebar__categories">
          <div className="package-listing-sidebar__header">
            <Heading csLevel="4" csSize="4">
              Categories
            </Heading>
          </div>
          {pt.length > 0 ? (
            <div className="package-listing-sidebar__body">{pt}</div>
          ) : null}
          {listing.is_deprecated || listing.is_nsfw ? (
            <div className="package-listing-sidebar__body">
              {listing.is_deprecated ? (
                <NewTag
                  csSize="small"
                  csModifiers={["dark"]}
                  csVariant="yellow"
                >
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
          ) : null}
        </div>
      ) : null}
      {listing.team?.members?.length > 0 ? (
        <TeamMembers listing={listing} domain={domain} />
      ) : null}
    </>
  );
}
