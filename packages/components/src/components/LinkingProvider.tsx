/**
 * TODO: a preface about how and why the linking is handled.
 *
 * To add a new link type, follow the 4 required steps defined below.
 */
import React from "react";

// STEP 1 of adding new link definitions:
// If the new link uses any props not already listed here, add them.
export interface ThunderstoreLinkProps {
  community?: string;
  package?: string;
}

// STEP 2 of adding new link definitions:
// If any new properties were added to ThunderstoreLinkProps, add a
// dummy value for them here (the value doesn't matter). This is used to
// strip the props so they don't get passed to HTML elements in React
// implementations. Second, redundant declaration as an object is
// required since the stripping is done during runtime.
export const thunderstoreLinkProps: ThunderstoreLinkProps = {
  community: "",
  package: "",
};

// Accepting any and all props is required to keep the linking
// implementation-agnostic. E.g. an implementation with Chakra has all
// kinds of custom properties.
interface AnyProps {
  [key: string]: string | number | boolean;
}

type Output = React.ReactElement | null;
type NoRequiredProps = (props: AnyProps) => Output;

// STEP 3 of adding bew link definitions:
// Declare and document any links used in the components here.
export interface LinkLibrary {
  /** Creates a link pointing to URL prop */
  Anonymous: (props: AnyProps & { url: string }) => Output;
  /** Site's frontpage */
  Index: NoRequiredProps;
  /** Package's detail view */
  Package: (props: AnyProps & { community: string; package: string }) => Output;
}

const noop = () => null;

// STEP 4 of adding new link definitions:
// Define the link as no-op for default implementation.
const library: LinkLibrary = {
  Anonymous: noop,
  Index: noop,
  Package: noop,
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
