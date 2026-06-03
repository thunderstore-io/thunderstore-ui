import { Suspense, useMemo } from "react";
import { Await, type UIMatch, useMatches } from "react-router";

import {
  Image,
  NewBreadCrumbs,
  NewBreadCrumbsItem,
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
          packageVersionPage,
        Boolean(packageListingPage) ||
          Boolean(packageDependantsPage) ||
          Boolean(packageTeamPage) ||
          Boolean(packageVersionPage)
      ),
    [
      communityPage,
      packageListingPage,
      packageDependantsPage,
      packageTeamPage,
      packageVersionPage,
    ]
  );
  const packageListingBreadcrumb = useMemo(
    () =>
      getPackageListingBreadcrumb(packageListingPage, packageDependantsPage),
    [packageListingPage, packageDependantsPage]
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
          <NewBreadCrumbsItem>Settings</NewBreadCrumbsItem>
        )}
        {userSettingsAccountPage ? (
          <NewBreadCrumbsItem>Account</NewBreadCrumbsItem>
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
          <NewBreadCrumbsItem>Profile</NewBreadCrumbsItem>
        ) : null}
        {teamSettingsMembersPage ? (
          <NewBreadCrumbsItem>Members</NewBreadCrumbsItem>
        ) : null}
        {teamSettingsServiceAccountsPage ? (
          <NewBreadCrumbsItem>Service Accounts</NewBreadCrumbsItem>
        ) : null}
        {teamSettingsSettingsPage ? (
          <NewBreadCrumbsItem>Settings</NewBreadCrumbsItem>
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
    return <NewBreadCrumbsItem>Upload</NewBreadCrumbsItem>;
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
      <NewBreadCrumbsItem>Communities</NewBreadCrumbsItem>
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
        <NewBreadCrumbsItem>
          {packageVersionPage.params.packageVersion}
        </NewBreadCrumbsItem>
      </>
    );
  }, [packageVersionPage]);

  const packageVersionWithoutCommunityBreadcrumb = useMemo(() => {
    if (!packageVersionWithoutCommunityPage) return null;
    return (
      <>
        <NewBreadCrumbsItem>
          {packageVersionWithoutCommunityPage.params.namespaceId}
        </NewBreadCrumbsItem>
        <NewBreadCrumbsItem>
          {packageVersionWithoutCommunityPage.params.packageId}
        </NewBreadCrumbsItem>
        <NewBreadCrumbsItem>
          {packageVersionWithoutCommunityPage.params.packageVersion}
        </NewBreadCrumbsItem>
      </>
    );
  }, [packageVersionWithoutCommunityPage]);

  const miscPackageBreadcrumb = useMemo(() => {
    return (
      <>
        {packageDependantsPage ? (
          <NewBreadCrumbsItem>Dependants</NewBreadCrumbsItem>
        ) : null}
        {packageTeamPage ? (
          <NewBreadCrumbsItem>
            {packageTeamPage.params.namespaceId}
          </NewBreadCrumbsItem>
        ) : null}
      </>
    );
  }, [packageDependantsPage, packageTeamPage]);

  const toolsBreadcrumb = useMemo(() => {
    return (
      <>
        {packageFormatDocsPage ? (
          <NewBreadCrumbsItem>Package Format Docs</NewBreadCrumbsItem>
        ) : null}
        {manifestValidatorPage ? (
          <NewBreadCrumbsItem>Manifest Validator</NewBreadCrumbsItem>
        ) : null}
        {markdownPreviewPage ? (
          <NewBreadCrumbsItem>Markdown Preview</NewBreadCrumbsItem>
        ) : null}
      </>
    );
  }, [packageFormatDocsPage, manifestValidatorPage, markdownPreviewPage]);

  const loginBreadcrumb = useMemo(() => {
    if (!loginPage) return null;
    return <NewBreadCrumbsItem>Log in</NewBreadCrumbsItem>;
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
          fallback={<NewBreadCrumbsItem>Loading...</NewBreadCrumbsItem>}
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
                  typeof resolvedValue.community_icon_url === "string" ? (
                    <Image
                      src={resolvedValue.community_icon_url}
                      square
                      alt=""
                      rootClasses="breadcrumbs__community-icon"
                    />
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
                <NewBreadCrumbsItem>
                  {icon}
                  {label}
                </NewBreadCrumbsItem>
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
  packageDependantsPage: UIMatch | undefined
) {
  if (!packageListingPage && !packageDependantsPage) return null;
  return (
    <>
      {packageListingPage ? (
        <NewBreadCrumbsItem>
          {packageListingPage.params.packageId}
        </NewBreadCrumbsItem>
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
