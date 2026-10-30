import { type ReactNode, Suspense } from "react";
import { Await, type UIMatch } from "react-router";

import {
  Image,
  NewBreadCrumbsItem,
  type NewCyberstormLinkProps,
  isRecord,
} from "@thunderstore/cyberstorm";

type CrumbLink = Omit<
  NewCyberstormLinkProps,
  "children" | "csVariant" | "primitiveType" | "rootClasses"
>;

type MatchLookup = (id: string) => UIMatch | undefined;

/**
 * One crumb. Pass `link` when the crumb leads somewhere; otherwise it renders
 * as text, which is how the current page is shown.
 */
function crumb(key: string, label: ReactNode, link?: CrumbLink) {
  if (!link) {
    return <NewBreadCrumbsItem key={key}>{label}</NewBreadCrumbsItem>;
  }

  return (
    <NewBreadCrumbsItem key={key} {...link} primitiveType="cyberstormLink">
      {label}
    </NewBreadCrumbsItem>
  );
}

/**
 * Crumbs for the current route, in display order. Home is added by
 * `BreadCrumbs`. Entries are null when that part of the trail does not apply;
 * the list drops those before it numbers the crumbs.
 */
export function breadcrumbTrail(matches: UIMatch[]): ReactNode[] {
  const byId = new Map(matches.map((match) => [match.id, match]));
  const match = (id: string) => byId.get(id);

  return [
    settingsCrumbs(match),
    teamsCrumbs(match),
    match("upload/upload") ? crumb("upload", "Upload") : null,
    communitiesCrumb(match),
    communityCrumb(match),
    packageListingCrumb(match),
    packageVersionCrumbs(match),
    packageVersionWithoutCommunityCrumbs(match),
    packageTailCrumb(match),
    toolsCrumb(match),
    match("login/login") ? crumb("login", "Log in") : null,
  ];
}

/**
 * Settings, plus Account when that tab is open. Settings links through to
 * Account.
 */
function settingsCrumbs(match: MatchLookup): ReactNode {
  if (!match("settings/user/Settings")) return null;
  const account = match("settings/user/Account/Account");

  return [
    crumb("settings", "Settings", account ? { linkId: "Settings" } : undefined),
    account ? crumb("account", "Account") : null,
  ];
}

/** Teams, the open team's name, and the active team-settings tab. */
function teamsCrumbs(match: MatchLookup): ReactNode {
  const team = match("settings/teams/team/teamSettings");
  if (!match("settings/teams/Teams") && !team) return null;

  let tab: ReactNode = null;
  if (match("settings/teams/team/tabs/Profile/Profile")) {
    tab = crumb("profile", "Profile");
  } else if (match("settings/teams/team/tabs/Members/Members")) {
    tab = crumb("members", "Members");
  } else if (
    match("settings/teams/team/tabs/ServiceAccounts/ServiceAccounts")
  ) {
    tab = crumb("service-accounts", "Service Accounts");
  } else if (match("settings/teams/team/tabs/Settings/Settings")) {
    tab = crumb("settings", "Settings");
  }

  return [
    crumb("teams", "Teams", { linkId: "Teams" }),
    team
      ? crumb("team", team.params.namespaceId, {
          linkId: "TeamSettings",
          team: team.params.namespaceId,
        })
      : null,
    tab,
  ];
}

/**
 * Communities. Links onward on a community page, a package's dependants, or a
 * team's packages, and is the current page on the communities list.
 */
function communitiesCrumb(match: MatchLookup): ReactNode {
  const community = match("c/Community");
  const dependants = match("p/dependants/Dependants");
  const team = match("p/team/Team");
  if (!match("communities/communities") && !community && !dependants && !team) {
    return null;
  }

  return crumb(
    "communities",
    "Communities",
    community || dependants || team ? { linkId: "Communities" } : undefined
  );
}

/**
 * The community name, once its loader resolves. Uses the community id when the
 * payload has no name, and the icon when the payload includes one. Links onward
 * on package, version, dependants, and team pages.
 */
function communityCrumb(match: MatchLookup): ReactNode {
  const listing = match("p/packageListing");
  const dependants = match("p/dependants/Dependants");
  const team = match("p/team/Team");
  const version = match("p/packageListingVersion");
  const community =
    match("c/Community") || listing || dependants || team || version;
  if (
    !community ||
    !isRecord(community.data) ||
    !Object.prototype.hasOwnProperty.call(community.data, "community")
  ) {
    return null;
  }

  const linked = Boolean(listing || dependants || team || version);

  return (
    <Suspense
      key="community"
      fallback={crumb("community-loading", "Loading...")}
    >
      <Await resolve={community.data.community}>
        {(resolvedValue) => {
          const record = isRecord(resolvedValue) ? resolvedValue : null;
          const name = !record
            ? undefined
            : typeof record.name === "string"
              ? record.name
              : community.params.communityId;
          const icon =
            record && typeof record.community_icon_url === "string" ? (
              <Image
                src={record.community_icon_url}
                square
                alt=""
                rootClasses="breadcrumbs__community-icon"
              />
            ) : null;

          return crumb(
            "community",
            [icon, name],
            linked
              ? {
                  linkId: "Community",
                  community: community.params.communityId,
                }
              : undefined
          );
        }}
      </Await>
    </Suspense>
  );
}

/**
 * The package name. Text on the package page, and a link back to it from the
 * dependants page.
 */
function packageListingCrumb(match: MatchLookup): ReactNode {
  const listing = match("p/packageListing");
  if (listing) return crumb("listing", listing.params.packageId);

  const dependants = match("p/dependants/Dependants");
  if (!dependants) return null;

  return crumb("package", dependants.params.packageId, packageLink(dependants));
}

/** The package name, linking back to the package, and the open version. */
function packageVersionCrumbs(match: MatchLookup): ReactNode {
  const version = match("p/packageListingVersion");
  if (!version) return null;

  return [
    crumb("package", version.params.packageId, packageLink(version)),
    crumb("version", version.params.packageVersion),
  ];
}

/** Link back to a package from its version or dependants page. */
function packageLink(page: UIMatch): CrumbLink {
  return {
    linkId: "Package",
    community: page.params.communityId,
    namespace: page.params.namespaceId,
    package: page.params.packageId,
  };
}

/**
 * Namespace, package, and version for the community-agnostic package URL.
 * That route is disabled; the trail still covers it if it is matched.
 */
function packageVersionWithoutCommunityCrumbs(match: MatchLookup): ReactNode {
  const version = match("p/packageVersionWithoutCommunity");
  if (!version) return null;

  return [
    crumb("namespace", version.params.namespaceId),
    crumb("package", version.params.packageId),
    crumb("version", version.params.packageVersion),
  ];
}

/**
 * Dependants on the dependants page, or the namespace on a team's package list.
 */
function packageTailCrumb(match: MatchLookup): ReactNode {
  if (match("p/dependants/Dependants"))
    return crumb("dependants", "Dependants");
  const team = match("p/team/Team");
  if (!team) return null;
  return crumb("namespace", team.params.namespaceId);
}

/** Manifest Validator or Markdown Preview, whichever tool is open. */
function toolsCrumb(match: MatchLookup): ReactNode {
  if (match("tools/manifest-validator/manifestValidator")) {
    return crumb("manifest-validator", "Manifest Validator");
  }
  if (match("tools/markdown-preview/markdownPreview")) {
    return crumb("markdown-preview", "Markdown Preview");
  }
  return null;
}
