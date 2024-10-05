import { LinkLibrary } from "@thunderstore/cyberstorm";
import React from "react";

interface CyberstormLinkProps {
  children?: React.ReactNode;
}

export interface ThunderstoreLinkProps {
  community?: string;
  namespace?: string;
  package?: string;
  version?: string;
  team?: string;
  user?: string;
}

interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    CyberstormLinkProps,
    ThunderstoreLinkProps {
  className?: string;
  queryParams?: string;
  url: string;
  "data-color"?: string;
  "data-size"?: string;
  "data-variant"?: string;
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
    const fProps =
      forwardedProps as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        onClick={linkOnClick}
        href={`${url}${q}`}
        {...fProps}
        className={className}
        ref={forwardedRef}
        data-color={props["data-color"]}
        data-size={props["data-size"]}
        data-variant={props["data-variant"]}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = "Link";

function linkOnClick(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

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
    <Link {...p} url={"/developers/manifest-validator/"} ref={p.customRef} />
  ),
  MarkdownPreview: (p) => (
    <Link {...p} url={"/developers/markdown-preview/"} ref={p.customRef} />
  ),
  Package: (p) => (
    <Link
      {...p}
      url={`/c/${p.community}/p/${p.namespace}/${p.package}/`}
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
  PackageFormatDocs: (p) => (
    <Link {...p} url={"/developers/package-format-docs/"} ref={p.customRef} />
  ),
  PackageUpload: (p) => (
    <Link {...p} url={"/developers/upload-package/"} ref={p.customRef} />
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
