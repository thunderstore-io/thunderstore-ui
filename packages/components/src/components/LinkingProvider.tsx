/**
 * TODO: a preface about how and why the linking is handled.
 */
import React from "react";

// TODO: See if we can get rid of any.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LinkGetter = (props: any) => React.ReactElement | null;

// Declare and document any links used in the components here.
export interface LinkLibrary {
  /** Creates a link from whatever is passed in urlParams */
  Anonymous: LinkGetter;
  /** Site's frontpage */
  Index: LinkGetter;
  /** Package's detail view */
  Package: LinkGetter;
}

const noop = () => null;

const library: LinkLibrary = {
  Anonymous: noop,
  Index: noop,
  Package: noop,
};

// Define LinkingContext with the no-op LinkLibrary as the default
// value. If no overriding provider is defined in the context where the
// components are used, they will use this default implementation, which
// means the links are not rendered at all.
export const LinkingContext = React.createContext(library);
LinkingContext.displayName = "LinkingContext";

export const LinkingProvider = LinkingContext.Provider;

/**
 * Template tag function for defining URL paths.
 *
 * Allows defining URL template and replacing the placeholders with
 * positional arguments later. Throws an error if the number of given
 * arguments don't match with the number of placeholders.
 *
 * Examples:
 * ```js
 * UrlTemplate`/users/${0}/settings`("autti");
 * // "/users/autti/settings"
 *
 * const template = UrlTemplate`/community/${0}/package/${1}`;
 * const params = ["MyCommunity", "GloriousPackage"];
 * t(...params);
 * // "/community/MyCommunity/package/GloriousPackage"
 * ```
 */
export const UrlTemplate = (
  strings: TemplateStringsArray,
  ...keys: number[]
) => {
  return (...values: string[]): string => {
    const expected = keys.length;
    const actual = values?.length ?? 0;
    if (actual !== expected) {
      const e = `Expected ${expected} URL parameter(s) but received ${actual}`;
      throw new Error(e);
    }

    const result = [strings[0]];
    keys.forEach((_key, i) => {
      result.push((values ?? [])[i], strings[i + 1]);
    });

    return result.join("");
  };
};

export type UrlTemplateType = (...values: string[]) => string;
