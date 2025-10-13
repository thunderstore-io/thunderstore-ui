import { type PackageVersionDependency } from "@thunderstore/thunderstore-api";
import "./ListingDependency.css";
import { formatToDisplayName, Image, NewLink } from "@thunderstore/cyberstorm";

export interface ListingDependencyProps {
  dependency: PackageVersionDependency;
  communityId?: string;
}

export function ListingDependency(props: ListingDependencyProps) {
  const { dependency, communityId } = props;

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
          {communityId ? (
            <NewLink
              primitiveType="cyberstormLink"
              linkId="PackageVersion"
              community={communityId}
              namespace={dependency.namespace}
              package={dependency.name}
              version={dependency.version_number}
              rootClasses="listing-dependency__name"
            >
              {formatToDisplayName(dependency.name)}
            </NewLink>
          ) : (
            <NewLink
              primitiveType="cyberstormLink"
              linkId="PackageVersionWithoutCommunity"
              namespace={dependency.namespace}
              package={dependency.name}
              version={dependency.version_number}
              rootClasses="listing-dependency__name"
            >
              {formatToDisplayName(dependency.name)}
            </NewLink>
          )}
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
          {communityId ? (
            <NewLink
              primitiveType="cyberstormLink"
              linkId="PackageVersion"
              community={communityId}
              namespace={dependency.namespace}
              package={dependency.name}
              version={dependency.version_number}
              title={`${formatToDisplayName(dependency.name)} - ${
                dependency.version_number
              }`}
              csVariant="cyber"
            >
              {dependency.version_number}
            </NewLink>
          ) : (
            <NewLink
              primitiveType="cyberstormLink"
              linkId="PackageVersionWithoutCommunity"
              namespace={dependency.namespace}
              package={dependency.name}
              version={dependency.version_number}
              title={`${formatToDisplayName(dependency.name)} - ${
                dependency.version_number
              }`}
              csVariant="cyber"
            >
              {dependency.version_number}
            </NewLink>
          )}
        </div>
      </div>
    </div>
  );
}

ListingDependency.displayName = "ListingDependency";
