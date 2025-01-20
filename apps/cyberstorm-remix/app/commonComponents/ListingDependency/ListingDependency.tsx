import "./ListingDependency.css";
import { dependencyShema } from "@thunderstore/dapper-ts";
import { Image, NewLink } from "@thunderstore/cyberstorm";

export interface ListingDependencyProps {
  dependency: typeof dependencyShema._type;
  // TODO: Remove when package versiond detail is available
  domain: string;
}

export function ListingDependency(props: ListingDependencyProps) {
  const { dependency, domain } = props;

  return (
    <div className="nimbus-commoncomponents-listingdependency">
      <Image
        src={dependency.icon_url}
        cardType="package"
        square={true}
        intrinsicWidth={80}
        intrinsicHeight={80}
        rootClasses="nimbus-commoncomponents-listingdependency__image"
      />
      <div className="nimbus-commoncomponents-listingdependency__body">
        <div className="nimbus-commoncomponents-listingdependency__info">
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Package"
            community={dependency.community_identifier}
            namespace={dependency.namespace}
            package={dependency.name}
            rootClasses="nimbus-commoncomponents-listingdependency__info__name"
          >
            {dependency.name}
          </NewLink>
          <span className="nimbus-commoncomponents-listingdependency__info__title">
            <span className="nimbus-commoncomponents-listingdependency__info__by">
              by
            </span>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="Team"
              team={dependency.namespace}
              rootClasses="nimbus-commoncomponents-listingdependency__info__author"
              csVariant="primary"
            >
              {dependency.namespace}
            </NewLink>
          </span>
        </div>
        <div className="nimbus-commoncomponents-listingdependency__description">
          {dependency.description}
        </div>
        <div className="nimbus-commoncomponents-listingdependency__version">
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
            title={`${dependency.name} - ${dependency.version_number}`}
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
