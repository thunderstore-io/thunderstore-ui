import { PageHeader } from "app/commonComponents/PageHeader/PageHeader";
import {
  NewIcon,
  NewLink,
  formatToDisplayName,
} from "@thunderstore/cyberstorm";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type PackageListingDetails } from "@thunderstore/dapper/types";

type PackageHeaderProps = {
  packageListing: PackageListingDetails;
};

export function PackageHeader({ packageListing }: PackageHeaderProps) {
  return (
    <PageHeader
      headingLevel="1"
      headingSize="3"
      image={packageListing.icon_url}
      description={packageListing.description}
      variant="detailed"
      meta={
        <>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Team"
            community={packageListing.community_identifier}
            team={packageListing.namespace}
            csVariant="cyber"
            rootClasses="page-header__meta-item"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faUsers} />
            </NewIcon>
            {packageListing.namespace}
          </NewLink>
          {packageListing.website_url ? (
            <NewLink
              primitiveType="link"
              href={packageListing.website_url}
              csVariant="cyber"
              rootClasses="page-header__meta-item"
            >
              {packageListing.website_url}
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faArrowUpRight} />
              </NewIcon>
            </NewLink>
          ) : null}
        </>
      }
    >
      {formatToDisplayName(packageListing.name)}
    </PageHeader>
  );
}
