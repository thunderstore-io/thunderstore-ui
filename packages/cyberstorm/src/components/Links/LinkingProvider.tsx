"use client";
/**
 * Implementation-agnostic context provider for navigation.
 *
 * @thunderstore/cyberstorm aims to be reusable. Therefore the links
 * used in the components, by default, render nothing. It's up to the
 * app using the components to define how the links are rendered and
 * inject the definitions with a context provider that wraps the
 * components:
 *
 * 1. Create "myLinkLib" that implements the provided LinkLibrary interface.
 * 2. Wrap the components with <LinkingProvider value={myLinkLib}>.
 * 3. Components automatically use myLinkLib to determine how they
 *    should render any links the contain.
 *
 * To add a new link type, follow the 4 required steps defined below.
 */
import React, { ReactElement as RE } from "react";

// STEP 1 of adding new link definitions:
// If the new link uses any props not already listed here, add them.
export interface ThunderstoreLinkProps {
  community?: string;
  namespace?: string;
  package?: string;
  version?: string;
  team?: string;
  user?: string;
  wikipageslug?: string;
}

// STEP 2 of adding new link definitions:
// If any new properties were added to ThunderstoreLinkProps, add a
// dummy value for them here (the value doesn't matter). This is used to
// strip the props so they don't get passed to HTML elements in React
// implementations. Second, redundant declaration as an object is
// required since the stripping is done during runtime.
export const thunderstoreLinkProps: ThunderstoreLinkProps = {
  community: "",
  namespace: "",
  package: "",
  version: "",
  team: "",
  user: "",
  wikipageslug: "",
};

// Accepting any and all props is required to keep the linking
// implementation-agnostic. E.g. implementations with other libraries could require all
// kinds of custom props to be passed.
export interface AnyProps {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  queryParams?: string;
  className?: string;
}

type NoRequiredProps = (props: AnyProps) => RE | null;
type PackageProps = { community: string; namespace: string; package: string };
export type PackageVersionProps = {
  community: string;
  namespace: string;
  package: string;
  version: string;
};

// STEP 3 of adding bew link definitions:
// Declare and document any links used in the components here.
export interface LinkLibrary {
  /** Creates a link pointing to URL prop */
  Anonymous: (props: AnyProps & { url: string }) => RE | null;
  /** Community list view */
  Communities: NoRequiredProps;
  /** Community's frontpage */
  Community: (props: AnyProps & { community: string }) => RE | null;
  /** Community's package listing */
  CommunityPackages: (props: AnyProps & { community: string }) => RE | null;
  /** Site's frontpage */
  Index: NoRequiredProps;
  /** Manifest validator */
  ManifestValidator: NoRequiredProps;
  /** Markdown preview */
  MarkdownPreview: NoRequiredProps;
  /** Package's detail view */
  Package: (props: AnyProps & PackageProps) => RE | null;
  /** Package's required view */
  PackageRequired: (props: AnyProps & PackageProps) => RE | null;
  /** Package's wiki view */
  PackageWiki: (props: AnyProps & PackageProps) => RE | null;
  /** Package's wiki view */
  PackageWikiNewPage: (props: AnyProps & PackageProps) => RE | null;
  /** Package's wiki page view */
  PackageWikiPage: (
    props: AnyProps & PackageProps & { wikipageslug: string }
  ) => RE | null;
  /** Package's wiki page edit view */
  PackageWikiPageEdit: (
    props: AnyProps & PackageProps & { wikipageslug: string }
  ) => RE | null;
  /** Package's changelog view */
  PackageChangelog: (props: AnyProps & PackageProps) => RE | null;
  /** Package's versions view */
  PackageVersions: (props: AnyProps & PackageProps) => RE | null;
  /** Package's source view */
  PackageSource: (props: AnyProps & PackageProps) => RE | null;
  /** View listing other packages that depend on this package */
  PackageDependants: (props: AnyProps & PackageProps) => RE | null;
  /** Package format docs */
  PackageFormatDocs: NoRequiredProps;
  /** PackageVersion's detail view */
  PackageVersion: (props: AnyProps & PackageVersionProps) => RE | null;
  /** View for submitting new packages or versions */
  PackageUpload: NoRequiredProps;
  /** Privacy policy */
  PrivacyPolicy: NoRequiredProps;
  /** Settings */
  Settings: NoRequiredProps;
  /** Settings Account page */
  SettingsAccount: NoRequiredProps;
  /** Team's public profile page */
  Team: (props: AnyProps & { team: string }) => RE | null;
  /** Teams */
  Teams: NoRequiredProps;
  /** Team's settings profile page */
  TeamSettings: (props: AnyProps & { team: string }) => RE | null;
  /** Team's settings members page */
  TeamSettingsMembers: (props: AnyProps & { team: string }) => RE | null;
  /** Team's settings service accounts page */
  TeamSettingsServiceAccounts: (
    props: AnyProps & { team: string }
  ) => RE | null;
  /** Team's actual settings page */
  TeamSettingsSettings: (props: AnyProps & { team: string }) => RE | null;
  /** Terms of service */
  TermsOfService: NoRequiredProps;
  /** User */
  User: (props: AnyProps & { user: string }) => RE | null;
}

const noop = () => null;

// STEP 4 of adding new link definitions:
// Define the link as no-op for default implementation.
const library: LinkLibrary = {
  Anonymous: noop,
  Communities: noop,
  Community: noop,
  CommunityPackages: noop,
  Index: noop,
  ManifestValidator: noop,
  MarkdownPreview: noop,
  Package: noop,
  PackageRequired: noop,
  PackageWiki: noop,
  PackageWikiNewPage: noop,
  PackageWikiPage: noop,
  PackageWikiPageEdit: noop,
  PackageChangelog: noop,
  PackageVersions: noop,
  PackageSource: noop,
  PackageDependants: noop,
  PackageFormatDocs: noop,
  PackageVersion: noop,
  PackageUpload: noop,
  PrivacyPolicy: noop,
  User: noop,
  Settings: noop,
  SettingsAccount: noop,
  Team: noop,
  Teams: noop,
  TeamSettings: noop,
  TeamSettingsMembers: noop,
  TeamSettingsServiceAccounts: noop,
  TeamSettingsSettings: noop,
  TermsOfService: noop,
};

// OPTIONAL STEP 5 of adding new link definitions:
// Add the link to ./Links.tsx for easier importing.

// Define LinkingContext with the no-op LinkLibrary as the default
// value. If no overriding provider is defined in the context where the
// components are used, they will use this default implementation, which
// means the links are not rendered at all.
export const LinkingContext = React.createContext(library);
LinkingContext.displayName = "LinkingContext";

export const LinkingProvider = LinkingContext.Provider;
