import type { packageDependencySchema } from "@thunderstore/thunderstore-api";
import "./ListingDependency.css";
import { formatToDisplayName, Image, NewLink } from "@thunderstore/cyberstorm";

export interface ListingDependencyProps {
  dependency: typeof packageDependencySchema._type;
  // TODO: Remove when package versiond detail is available
  domain: string;
}

export function ListingDependency(props: ListingDependencyProps) {
  const { dependency, domain } = props;

  return (
    <div className="listing-dependency">
      <Image
        src={dependency.icon_url}
        cardType="package"
        square={true}
        intrinsicWidth={80}
        intrinsicHeight={80}
        rootClasses="listing-dependency__image"
      />
      <div>
        <div className="listing-dependency__info">
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Package"
            community={dependency.community_identifier}
            namespace={dependency.namespace}
            package={dependency.name}
            rootClasses="listing-dependency__name"
          >
            {formatToDisplayName(dependency.name)}
          </NewLink>
          <span className="listing-dependency__title">
            <span className="listing-dependency__title__by">by</span>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="Team"
              team={dependency.namespace}
              csVariant="primary"
            >
              {dependency.namespace}
            </NewLink>
          </span>
        </div>
        <div className="listing-dependency__description">
          {dependency.description}
        </div>
        <div className="listing-dependency__version">
          <span>Version:</span>
          <NewLink
            // TODO: Remove when package versiond detail is available
            primitiveType="link"
            href={`${domain}/c/${dependency.community_identifier}/p/${dependency.namespace}/${dependency.name}/v/${dependency.version_number}/`}
            // primitiveType="cyberstormLink"
            // linkId="PackageVersion"
            // community={dependency.community_identifier}
            // namespace={dependency.namespace}
            // package={dependency.name}
            // version={dependency.version_number}
            title={`${formatToDisplayName(dependency.name)} - ${
              dependency.version_number
            }`}
            csVariant="cyber"
          >
            {dependency.version_number}
          </NewLink>
        </div>
      </div>
    </div>
  );
}

ListingDependency.displayName = "ListingDependency";
