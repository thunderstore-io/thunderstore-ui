import { NewBreadCrumbs, NewBreadCrumbsLink } from "@thunderstore/cyberstorm";
import { useMatches } from "react-router";
import { getCommunityBreadcrumb } from "./breadcrumbs/getCommunityBreadcrumbs";
import { getPackageListingBreadcrumb } from "./breadcrumbs/getPackageListingBreadcrumbs";
import { memo } from "react";
import { getPackageVersionBreadcrumbs } from "./breadcrumbs/getPackageVersionBreadcrumbs";

/** Layout component to provide common UI around all pages */
export const NimbusBreadcrumbs = memo(function NimbusBreadcrumbs(props: {
  matches: ReturnType<typeof useMatches>;
}) {
  const { matches } = props;
  const userSettingsPage = matches.find(
    (m) => m.id === "settings/user/Settings"
  );
  const userSettingsAccountPage = matches.find(
    (m) => m.id === "settings/user/Account/Account"
  );
  const teamsPage = matches.find((m) => m.id === "settings/teams/Teams");
  const teamSettingsPage = matches.find(
    (m) => m.id === "settings/teams/team/teamSettings"
  );
  const teamSettingsProfilePage = matches.find(
    (m) => m.id === "settings/teams/team/tabs/Profile/Profile"
  );
  const teamSettingsMembersPage = matches.find(
    (m) => m.id === "settings/teams/team/tabs/Members/Members"
  );
  const teamSettingsServiceAccountsPage = matches.find(
    (m) => m.id === "settings/teams/team/tabs/ServiceAccounts/ServiceAccounts"
  );
  const teamSettingsSettingsPage = matches.find(
    (m) => m.id === "settings/teams/team/tabs/Settings/Settings"
  );
  const communitiesPage = matches.find(
    (m) => m.id === "communities/communities"
  );
  const uploadPage = matches.find((m) => m.id === "upload/upload");
  const communityPage = matches.find((m) => m.id === "c/community");
  const packageListingPage = matches.find((m) => m.id === "p/packageListing");
  const packageVersionPage = matches.find((m) => m.id === "p/packageVersion");
  const packageVersionWithoutCommunityPage = matches.find(
    (m) => m.id === "p/packageVersionWithoutCommunity"
  );
  const packageEditPage = matches.find((m) => m.id === "p/packageEdit");
  const packageDependantsPage = matches.find(
    (m) => m.id === "p/dependants/Dependants"
  );
  const packageTeamPage = matches.find((m) => m.id === "p/team/Team");
  const packageFormatDocsPage = matches.find(
    (m) => m.id === "tools/package-format-docs/packageFormatDocs"
  );
  const manifestValidatorPage = matches.find(
    (m) => m.id === "tools/manifest-validator/manifestValidator"
  );
  const markdownPreviewPage = matches.find(
    (m) => m.id === "tools/markdown-preview/markdownPreview"
  );

  return (
    <NewBreadCrumbs>
      {/* User Settings */}
      {userSettingsPage ? (
        userSettingsAccountPage ? (
          <NewBreadCrumbsLink
            primitiveType="cyberstormLink"
            linkId="Settings"
            csVariant="cyber"
          >
            Settings
          </NewBreadCrumbsLink>
        ) : (
          <span>
            <span>Settings</span>
          </span>
        )
      ) : null}
      {/* User Settings account */}
      {userSettingsAccountPage ? (
        <span>
          <span>Account</span>
        </span>
      ) : null}
      {/* Teams */}
      {teamsPage || teamSettingsPage ? (
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Teams"
          csVariant="cyber"
        >
          Teams
        </NewBreadCrumbsLink>
      ) : null}
      {/* Team settings */}
      {teamSettingsPage ? (
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="TeamSettings"
          csVariant="cyber"
          team={teamSettingsPage.params.namespaceId}
        >
          {teamSettingsPage.params.namespaceId}
        </NewBreadCrumbsLink>
      ) : null}
      {/* Team Settings Profile */}
      {teamSettingsProfilePage ? (
        <span>
          <span>Profile</span>
        </span>
      ) : null}
      {/* Team Settings Members */}
      {teamSettingsMembersPage ? (
        <span>
          <span>Members</span>
        </span>
      ) : null}
      {/* Team Settings Service Accounts */}
      {teamSettingsServiceAccountsPage ? (
        <span>
          <span>Service Accounts</span>
        </span>
      ) : null}
      {/* Team Settings Settings */}
      {teamSettingsSettingsPage ? (
        <span>
          <span>Settings</span>
        </span>
      ) : null}
      {/* Upload */}
      {uploadPage ? (
        <span>
          <span>Upload</span>
        </span>
      ) : null}
      {/* Communities page */}
      {communitiesPage ||
      communityPage ||
      packageDependantsPage ||
      packageTeamPage ? (
        communityPage || packageDependantsPage || packageTeamPage ? (
          <NewBreadCrumbsLink
            primitiveType="cyberstormLink"
            linkId="Communities"
            csVariant="cyber"
          >
            Communities
          </NewBreadCrumbsLink>
        ) : (
          <span>
            <span>Communities</span>
          </span>
        )
      ) : null}
      {/* Community page */}
      {getCommunityBreadcrumb(
        communityPage ||
          packageListingPage ||
          packageDependantsPage ||
          packageTeamPage,
        Boolean(packageListingPage) ||
          Boolean(packageDependantsPage) ||
          Boolean(packageTeamPage)
      )}
      {/* Package listing page */}
      {getPackageListingBreadcrumb(
        packageListingPage,
        packageEditPage,
        packageDependantsPage
      )}
      {/* Package Version page */}
      {getPackageVersionBreadcrumbs(
        packageVersionPage,
        packageVersionWithoutCommunityPage
      )}
      {packageEditPage ? (
        <span>
          <span>Edit package</span>
        </span>
      ) : null}
      {packageDependantsPage ? (
        <span>
          <span>Dependants</span>
        </span>
      ) : null}
      {packageTeamPage ? (
        <span>
          <span>{packageTeamPage.params.namespaceId}</span>
        </span>
      ) : null}
      {packageFormatDocsPage ? (
        <span>
          <span>Package Format Docs</span>
        </span>
      ) : null}
      {manifestValidatorPage ? (
        <span>
          <span>Manifest Validator</span>
        </span>
      ) : null}
      {markdownPreviewPage ? (
        <span>
          <span>Markdown Preview</span>
        </span>
      ) : null}
    </NewBreadCrumbs>
  );
});
