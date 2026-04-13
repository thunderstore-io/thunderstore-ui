import { Suspense, useMemo } from "react";
import { Await, type UIMatch, useMatches } from "react-router";

import {
  NewBreadCrumbs,
  NewBreadCrumbsLink,
  isRecord,
} from "@thunderstore/cyberstorm";

export function Breadcrumbs() {
  const matches = useMatches();

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
  const communityPage = matches.find((m) => m.id === "c/Community");
  const packageListingPage = matches.find((m) => m.id === "p/packageListing");
  const packageVersionPage = matches.find(
    (m) => m.id === "p/packageListingVersion"
  );
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
  const loginPage = matches.find((m) => m.id === "login/login");

  const communityBreadcrumb = useMemo(
    () =>
      getCommunityBreadcrumb(
        communityPage ||
          packageListingPage ||
          packageDependantsPage ||
          packageTeamPage ||
          packageVersionPage ||
          packageEditPage,
        Boolean(packageListingPage) ||
          Boolean(packageDependantsPage) ||
          Boolean(packageTeamPage) ||
          Boolean(packageVersionPage) ||
          Boolean(packageEditPage)
      ),
    [
      communityPage,
      packageListingPage,
      packageDependantsPage,
      packageTeamPage,
      packageVersionPage,
      packageEditPage,
    ]
  );
  const packageListingBreadcrumb = useMemo(
    () =>
      getPackageListingBreadcrumb(
        packageListingPage,
        packageEditPage,
        packageDependantsPage
      ),
    [packageListingPage, packageEditPage, packageDependantsPage]
  );

  const userSettingsBreadcrumb = useMemo(() => {
    if (!userSettingsPage) return null;
    return (
      <>
        {userSettingsAccountPage ? (
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
        )}
        {userSettingsAccountPage ? (
          <span>
            <span>Account</span>
          </span>
        ) : null}
      </>
    );
  }, [userSettingsPage, userSettingsAccountPage]);

  const teamsBreadcrumb = useMemo(() => {
    if (!teamsPage && !teamSettingsPage) return null;
    return (
      <>
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Teams"
          csVariant="cyber"
        >
          Teams
        </NewBreadCrumbsLink>
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
        {teamSettingsProfilePage ? (
          <span>
            <span>Profile</span>
          </span>
        ) : null}
        {teamSettingsMembersPage ? (
          <span>
            <span>Members</span>
          </span>
        ) : null}
        {teamSettingsServiceAccountsPage ? (
          <span>
            <span>Service Accounts</span>
          </span>
        ) : null}
        {teamSettingsSettingsPage ? (
          <span>
            <span>Settings</span>
          </span>
        ) : null}
      </>
    );
  }, [
    teamsPage,
    teamSettingsPage,
    teamSettingsProfilePage,
    teamSettingsMembersPage,
    teamSettingsServiceAccountsPage,
    teamSettingsSettingsPage,
  ]);

  const uploadBreadcrumb = useMemo(() => {
    if (!uploadPage) return null;
    return (
      <span>
        <span>Upload</span>
      </span>
    );
  }, [uploadPage]);

  const communitiesBreadcrumb = useMemo(() => {
    if (
      !communitiesPage &&
      !communityPage &&
      !packageDependantsPage &&
      !packageTeamPage
    )
      return null;
    return communityPage || packageDependantsPage || packageTeamPage ? (
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
    );
  }, [communitiesPage, communityPage, packageDependantsPage, packageTeamPage]);

  const packageVersionBreadcrumb = useMemo(() => {
    if (!packageVersionPage) return null;
    return (
      <>
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Package"
          community={packageVersionPage.params.communityId}
          namespace={packageVersionPage.params.namespaceId}
          package={packageVersionPage.params.packageId}
          csVariant="cyber"
        >
          {packageVersionPage.params.packageId}
        </NewBreadCrumbsLink>
        <span>
          <span>{packageVersionPage.params.packageVersion}</span>
        </span>
      </>
    );
  }, [packageVersionPage]);

  const packageVersionWithoutCommunityBreadcrumb = useMemo(() => {
    if (!packageVersionWithoutCommunityPage) return null;
    return (
      <>
        <span>
          <span>{packageVersionWithoutCommunityPage.params.namespaceId}</span>
        </span>
        <span>
          <span>{packageVersionWithoutCommunityPage.params.packageId}</span>
        </span>
        <span>
          <span>
            {packageVersionWithoutCommunityPage.params.packageVersion}
          </span>
        </span>
      </>
    );
  }, [packageVersionWithoutCommunityPage]);

  const miscPackageBreadcrumb = useMemo(() => {
    return (
      <>
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
      </>
    );
  }, [packageEditPage, packageDependantsPage, packageTeamPage]);

  const toolsBreadcrumb = useMemo(() => {
    return (
      <>
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
      </>
    );
  }, [packageFormatDocsPage, manifestValidatorPage, markdownPreviewPage]);

  const loginBreadcrumb = useMemo(() => {
    if (!loginPage) return null;
    return (
      <span>
        <span>Log in</span>
      </span>
    );
  }, [loginPage]);

  return (
    <NewBreadCrumbs>
      {userSettingsBreadcrumb}
      {teamsBreadcrumb}
      {uploadBreadcrumb}
      {communitiesBreadcrumb}
      {communityBreadcrumb}
      {packageListingBreadcrumb}
      {packageVersionBreadcrumb}
      {packageVersionWithoutCommunityBreadcrumb}
      {miscPackageBreadcrumb}
      {toolsBreadcrumb}
      {loginBreadcrumb}
    </NewBreadCrumbs>
  );
}

function getCommunityBreadcrumb(
  communityPage: UIMatch | undefined,
  isNotLast: boolean
) {
  if (!communityPage) return null;
  return (
    <>
      {isRecord(communityPage.data) &&
      Object.prototype.hasOwnProperty.call(communityPage.data, "community") ? (
        <Suspense
          fallback={
            <span>
              <span>Loading...</span>
            </span>
          }
        >
          <Await resolve={communityPage.data.community}>
            {(resolvedValue) => {
              let label = undefined;
              let icon = undefined;
              if (isRecord(resolvedValue)) {
                label =
                  Object.prototype.hasOwnProperty.call(resolvedValue, "name") &&
                  typeof resolvedValue.name === "string"
                    ? resolvedValue.name
                    : communityPage.params.communityId;
                icon =
                  Object.prototype.hasOwnProperty.call(
                    resolvedValue,
                    "community_icon_url"
                  ) && typeof resolvedValue.community_icon_url === "string" ? (
                    <img src={resolvedValue.community_icon_url} alt="" />
                  ) : undefined;
              }
              return isNotLast ? (
                <NewBreadCrumbsLink
                  primitiveType="cyberstormLink"
                  linkId="Community"
                  community={communityPage.params.communityId}
                  csVariant="cyber"
                >
                  {icon}
                  {label}
                </NewBreadCrumbsLink>
              ) : (
                <span>
                  <span>
                    {icon}
                    {label}
                  </span>
                </span>
              );
            }}
          </Await>
        </Suspense>
      ) : null}
    </>
  );
}

function getPackageListingBreadcrumb(
  packageListingPage: UIMatch | undefined,
  packageEditPage: UIMatch | undefined,
  packageDependantsPage: UIMatch | undefined
) {
  if (!packageListingPage && !packageEditPage && !packageDependantsPage)
    return null;
  return (
    <>
      {packageListingPage ? (
        <span>
          <span>{packageListingPage.params.packageId}</span>
        </span>
      ) : null}
      {packageEditPage ? (
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Package"
          community={packageEditPage.params.communityId}
          namespace={packageEditPage.params.namespaceId}
          package={packageEditPage.params.packageId}
          csVariant="cyber"
        >
          {packageEditPage.params.packageId}
        </NewBreadCrumbsLink>
      ) : null}
      {packageDependantsPage ? (
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Package"
          community={packageDependantsPage.params.communityId}
          namespace={packageDependantsPage.params.namespaceId}
          package={packageDependantsPage.params.packageId}
          csVariant="cyber"
        >
          {packageDependantsPage.params.packageId}
        </NewBreadCrumbsLink>
      ) : null}
    </>
  );
}
