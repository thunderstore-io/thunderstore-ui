import { NewLink, Tabs } from "@thunderstore/cyberstorm";
import { type PackageListingDetails } from "@thunderstore/dapper/types";

type PackageTabsProps = {
  listing: PackageListingDetails;
  currentTab: string;
};

function tabClass(currentTab: string, tab: string) {
  return `tabs-item${currentTab === tab ? " tabs-item--current" : ""}`;
}

export function PackageTabs({ listing, currentTab }: PackageTabsProps) {
  return (
    <Tabs>
      <NewLink
        key="description"
        primitiveType="cyberstormLink"
        linkId="Package"
        community={listing.community_identifier}
        namespace={listing.namespace}
        package={listing.name}
        aria-current={currentTab === "details"}
        rootClasses={tabClass(currentTab, "details")}
      >
        Details
      </NewLink>
      <NewLink
        key="required"
        primitiveType="cyberstormLink"
        linkId="PackageRequired"
        community={listing.community_identifier}
        namespace={listing.namespace}
        package={listing.name}
        aria-current={currentTab === "required"}
        rootClasses={tabClass(currentTab, "required")}
      >
        Required ({listing.dependency_count})
      </NewLink>
      <NewLink
        key="wiki"
        primitiveType="cyberstormLink"
        linkId="PackageWiki"
        community={listing.community_identifier}
        namespace={listing.namespace}
        package={listing.name}
        aria-current={currentTab === "wiki"}
        rootClasses={tabClass(currentTab, "wiki")}
      >
        Wiki
      </NewLink>
      <NewLink
        key="changelog"
        primitiveType="cyberstormLink"
        linkId="PackageChangelog"
        community={listing.community_identifier}
        namespace={listing.namespace}
        package={listing.name}
        aria-current={currentTab === "changelog"}
        disabled={!listing.has_changelog}
        rootClasses={tabClass(currentTab, "changelog")}
      >
        Changelog
      </NewLink>
      <NewLink
        key="versions"
        primitiveType="cyberstormLink"
        linkId="PackageVersions"
        community={listing.community_identifier}
        namespace={listing.namespace}
        package={listing.name}
        aria-current={currentTab === "versions"}
        rootClasses={tabClass(currentTab, "versions")}
      >
        Versions
      </NewLink>
      <NewLink
        key="source"
        primitiveType="cyberstormLink"
        linkId="PackageSource"
        community={listing.community_identifier}
        namespace={listing.namespace}
        package={listing.name}
        aria-current={currentTab === "source"}
        rootClasses={tabClass(currentTab, "source")}
      >
        Analysis
      </NewLink>
    </Tabs>
  );
}
