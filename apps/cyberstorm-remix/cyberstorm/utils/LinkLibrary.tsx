import { type PropsWithChildren } from "react";
import React from "react";
import { Link as RRLink, type LinkProps as RRLinkProps } from "react-router";

import type {
  LinkLibrary,
  ThunderstoreLinkProps,
} from "@thunderstore/cyberstorm";

import { getPublicEnvVariables } from "../security/publicEnvVariables";

// Returns true when the current document is NOT being served by the React Router
// app, in which case in-app <Link> navigations need to force a full document
// load (otherwise React Router would intercept clicks and try to handle
// routes that only exist on the React Router side). We treat
// VITE_BETA_SITE_URL as the canonical React Router app origin: if the current
// hostname matches it, we know we are inside the React Router app and SPA
// navigation is safe. This intentionally allows the React Router app to be served
// from either the beta subdomain (e.g. new.thunderstore.io) or the base
// domain (e.g. thunderstore.dev in QA).
// TODO: Remove usage of VITE_BETA_SITE_URL as the canonical React Router origin
// once the React Router app is deployed to the base domain in production, and
// update the name of the env variable to reflect its new purpose.
export function shouldReloadDocument(
  hostname = typeof window !== "undefined"
    ? window.location.hostname
    : undefined
): boolean {
  if (hostname === undefined) return false;
  const { VITE_BETA_SITE_URL } = getPublicEnvVariables(["VITE_BETA_SITE_URL"]);
  if (!VITE_BETA_SITE_URL) return false;
  try {
    return hostname !== new URL(VITE_BETA_SITE_URL).hostname;
  } catch {
    return false;
  }
}

interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    PropsWithChildren,
    Omit<RRLinkProps, "to">,
    ThunderstoreLinkProps {
  className?: string;
  queryParams?: string;
  url: string;
  customRef?: React.ForwardedRef<HTMLAnchorElement>;
  version?: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props: LinkProps, forwardedRef?: React.ForwardedRef<HTMLAnchorElement>) => {
    const {
      children,
      queryParams,
      className,
      url,
      customRef,
      ...forwardedProps
    } = props;
    const q = queryParams ? `?${queryParams}` : "";
    delete forwardedProps.package;
    delete forwardedProps.community;
    delete forwardedProps.namespace;
    delete forwardedProps.team;
    delete forwardedProps.user;
    delete forwardedProps.version;
    delete forwardedProps.wikipageslug;
    const fProps =
      forwardedProps as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <RRLink
        to={`${url}${q}`}
        // passHref
        {...fProps}
        className={className}
        ref={forwardedRef}
        reloadDocument={shouldReloadDocument()}
      >
        {children}
      </RRLink>
    );
  }
);

Link.displayName = "Link";

const library: LinkLibrary = {
  Anonymous: (p) => <Link {...p} ref={p.customRef} />,
  Communities: (p) => <Link {...p} url="/communities/" ref={p.customRef} />,
  Community: (p) => (
    <Link {...p} url={`/c/${p.community}/`} ref={p.customRef} />
  ),
  CommunityPackages: (p) => (
    <Link {...p} url={`/c/${p.community}/packages/`} ref={p.customRef} />
  ),
  Index: (p) => <Link {...p} url={"/communities"} ref={p.customRef} />, // /communities temporarily the frontpage
  ManifestValidator: (p) => (
    <Link {...p} url={"/tools/manifest-v1-validator/"} ref={p.customRef} />
  ),
  MarkdownPreview: (p) => (
    <Link {...p} url={"/tools/markdown-preview/"} ref={p.customRef} />
  ),
  Package: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/`}
      ref={p.customRef}
    />
  ),
  PackageRequired: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/required`}
      ref={p.customRef}
    />
  ),
  PackageWiki: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/wiki`}
      ref={p.customRef}
    />
  ),
  PackageWikiNewPage: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/wiki/new`}
      ref={p.customRef}
    />
  ),
  PackageWikiPage: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/wiki/${p.wikipageslug}`}
      ref={p.customRef}
    />
  ),
  PackageWikiPageEdit: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/wiki/${p.wikipageslug}/edit`}
      ref={p.customRef}
    />
  ),
  PackageChangelog: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/changelog`}
      ref={p.customRef}
    />
  ),
  PackageVersions: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/versions`}
      ref={p.customRef}
    />
  ),
  PackageSource: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/source`}
      ref={p.customRef}
    />
  ),
  PackageDependants: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/dependants/`}
      ref={p.customRef}
    />
  ),
  PackageVersion: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/v/${p.version}/`}
      ref={p.customRef}
    />
  ),
  PackageVersionRequired: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/v/${p.version}/required`}
      ref={p.customRef}
    />
  ),
  PackageVersionVersions: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/v/${p.version}/versions`}
      ref={p.customRef}
    />
  ),
  PackageVersionWithoutCommunity: (p) => (
    <Link
      {...p}
      url={`/p/${p.namespace}/${p.package}/v/${p.version}/`}
      ref={p.customRef}
    />
  ),
  PackageVersionWithoutCommunityRequired: (p) => (
    <Link
      {...p}
      url={`/p/${p.namespace}/${p.package}/v/${p.version}/required`}
      ref={p.customRef}
    />
  ),
  PackageVersionWithoutCommunityVersions: (p) => (
    <Link
      {...p}
      url={`/p/${p.namespace}/${p.package}/v/${p.version}/versions`}
      ref={p.customRef}
    />
  ),
  PackageFormatDocs: (p) => (
    <Link
      {...p}
      url={"https://wiki.thunderstore.io/mods/creating-a-package"}
      ref={p.customRef}
    />
  ),
  PackageUpload: (p) => (
    <Link {...p} url={"/package/create/"} ref={p.customRef} />
  ),
  PrivacyPolicy: (p) => (
    <Link {...p} url={"/privacy-policy/"} ref={p.customRef} />
  ),
  Settings: (p) => <Link {...p} url={`/settings/`} ref={p.customRef} />,
  SettingsAccount: (p) => (
    <Link {...p} url={`/settings/account/`} ref={p.customRef} />
  ),
  Team: (p) => (
    <Link {...p} url={`/c/${p.community}/p/${p.team}/`} ref={p.customRef} />
  ),
  Teams: (p) => <Link {...p} url={`/teams/`} ref={p.customRef} />,
  TeamSettings: (p) => (
    <Link {...p} url={`/teams/${p.team}`} ref={p.customRef} />
  ),
  TeamSettingsMembers: (p) => (
    <Link {...p} url={`/teams/${p.team}/members`} ref={p.customRef} />
  ),
  TeamSettingsServiceAccounts: (p) => (
    <Link {...p} url={`/teams/${p.team}/service-accounts`} ref={p.customRef} />
  ),
  TeamSettingsSettings: (p) => (
    <Link {...p} url={`/teams/${p.team}/settings`} ref={p.customRef} />
  ),
  TermsOfService: (p) => (
    <Link {...p} url={"/terms-of-service/"} ref={p.customRef} />
  ),
  User: (p) => <Link {...p} url={`/u/${p.user}/`} ref={p.customRef} />,
};

export { library as LinkLibrary };
