import { Schema, sanitize } from "hast-util-sanitize";
import { type Nodes } from "hast";

/**
 * Based on:
 * https://github.com/rehypejs/rehype-sanitize/blob/b3ee205aeda4e0fc276cb6664b2d6d339305fcd6/lib/index.js
 * https://github.com/syntax-tree/hast-util-sanitize/blob/7f30d9e6261583efc544ff6a93ba54ca6e53e1b5/lib/schema.js
 * and combined with https://github.com/thunderstore-io/Thunderstore/blob/2530f7383e80045ef5cf2d6e634adb5b4dd71d53/django/thunderstore/markdown/allowed_tags.py
 */

export function nimbusSanitize(options: Schema | null | undefined) {
  return function (tree: Nodes): Nodes {
    const result = sanitize(tree, { ...nimbusSanitizeSchema, ...options });
    return result;
  };
}

export const nimbusSanitizeSchema: Schema = {
  // Let's keep these here for now, so that people don't mess around with t elements.
  ancestors: {
    tbody: ["table"],
    td: ["table"],
    th: ["table"],
    thead: ["table"],
    tfoot: ["table"],
    tr: ["table"],
  },
  // These reflect the backend schema, but TODO: we should most likely widen the usable attributes.
  attributes: {
    a: ["href", "title"],
    abbr: ["title"],
    acronym: ["title"],
    img: ["src", "width", "height", "alt", "align"],
    th: ["align", "rowspan", "colspan"],
    td: ["align", "rowspan", "colspan"],
    h1: ["align"],
    h2: ["align"],
    h3: ["align"],
    h4: ["align"],
    h5: ["align"],
    h6: ["align"],
    p: ["align"],
    details: ["open"],
  },
  // Let's keep these here just in case someone tries to clobber, somehow.
  clobber: ["ariaDescribedBy", "ariaLabelledBy", "id", "name"],
  clobberPrefix: "user-content-",
  protocols: {
    cite: ["http", "https"],
    href: ["http", "https", "irc", "ircs", "mailto", "xmpp"],
    longDesc: ["http", "https"],
    src: ["http", "https"],
  },
  // Allthough this config isn't in the backend schema, let's keep it for added safety.
  strip: ["script"],
  tagNames: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "h7",
    "h8",
    "br",
    "b",
    "i",
    "strong",
    "em",
    "a",
    "pre",
    "code",
    "img",
    "tt",
    "div",
    "ins",
    "del",
    "sup",
    "sub",
    "p",
    "ol",
    "ul",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "blockquote",
    "dl",
    "dt",
    "dd",
    "kbd",
    "q",
    "samp",
    "var",
    "hr",
    "ruby",
    "rt",
    "rp",
    "li",
    "tr",
    "td",
    "th",
    "s",
    "strike",
    "summary",
    "details",
    "caption",
    "figure",
    "figcaption",
    "abbr",
    "bdo",
    "cite",
    "dfn",
    "mark",
    "small",
    "span",
    "time",
    "wbr",
  ],
};

// This is the default schema by GH, but we wanna mirror what is allowed by the backend as of this moment.
// // Couple of ARIA attributes allowed in several, but not all, places.
// const aria = ["ariaDescribedBy", "ariaLabel", "ariaLabelledBy"];

// export const nimbusSanitizeSchema: Schema = {
//   ancestors: {
//     tbody: ["table"],
//     td: ["table"],
//     th: ["table"],
//     thead: ["table"],
//     tfoot: ["table"],
//     tr: ["table"],
//   },
//   attributes: {
//     a: [
//       ...aria,
//       // Note: these 3 are used by GFM footnotes, they do work on all links.
//       "dataFootnoteBackref",
//       "dataFootnoteRef",
//       ["className", "data-footnote-backref"],
//       "href",
//     ],
//     blockquote: ["cite"],
//     // Note: this class is not normally allowed by GH, when manually writing
//     // `code` as HTML in markdown, they adds it some other way.
//     // We can’t do that, so we have to allow it.
//     code: [["className", /^language-./]],
//     del: ["cite"],
//     div: ["itemScope", "itemType"],
//     dl: [...aria],
//     // Note: this is used by GFM footnotes.
//     h2: [["className", "sr-only"]],
//     img: [...aria, "longDesc", "src"],
//     // Note: `input` is not normally allowed by GH, when manually writing
//     // it in markdown, they add it from tasklists some other way.
//     // We can’t do that, so we have to allow it.
//     input: [
//       ["disabled", true],
//       ["type", "checkbox"],
//     ],
//     ins: ["cite"],
//     // Note: this class is not normally allowed by GH, when manually writing
//     // `li` as HTML in markdown, they adds it some other way.
//     // We can’t do that, so we have to allow it.
//     li: [["className", "task-list-item"]],
//     // Note: this class is not normally allowed by GH, when manually writing
//     // `ol` as HTML in markdown, they adds it some other way.
//     // We can’t do that, so we have to allow it.
//     ol: [...aria, ["className", "contains-task-list"]],
//     q: ["cite"],
//     section: ["dataFootnotes", ["className", "footnotes"]],
//     source: ["srcSet"],
//     summary: [...aria],
//     table: [...aria],
//     // Note: this class is not normally allowed by GH, when manually writing
//     // `ol` as HTML in markdown, they adds it some other way.
//     // We can’t do that, so we have to allow it.
//     ul: [...aria, ["className", "contains-task-list"]],
//     "*": [
//       "abbr",
//       "accept",
//       "acceptCharset",
//       "accessKey",
//       "action",
//       "align",
//       "alt",
//       "axis",
//       "border",
//       "cellPadding",
//       "cellSpacing",
//       "char",
//       "charOff",
//       "charSet",
//       "checked",
//       "clear",
//       "colSpan",
//       "color",
//       "cols",
//       "compact",
//       "coords",
//       "dateTime",
//       "dir",
//       // Note: `disabled` is technically allowed on all elements by GH.
//       // But it is useless on everything except `input`.
//       // Because `input`s are normally not allowed, but we allow them for
//       // checkboxes due to tasklists, we allow `disabled` only there.
//       "encType",
//       "frame",
//       "hSpace",
//       "headers",
//       "height",
//       "hrefLang",
//       "htmlFor",
//       "id",
//       "isMap",
//       "itemProp",
//       "label",
//       "lang",
//       "maxLength",
//       "media",
//       "method",
//       "multiple",
//       "name",
//       "noHref",
//       "noShade",
//       "noWrap",
//       "open",
//       "prompt",
//       "readOnly",
//       "rev",
//       "rowSpan",
//       "rows",
//       "rules",
//       "scope",
//       "selected",
//       "shape",
//       "size",
//       "span",
//       "start",
//       "summary",
//       "tabIndex",
//       "title",
//       "useMap",
//       "vAlign",
//       "value",
//       "width",
//     ],
//   },
//   clobber: ["ariaDescribedBy", "ariaLabelledBy", "id", "name"],
//   clobberPrefix: "user-content-",
//   protocols: {
//     cite: ["http", "https"],
//     href: ["http", "https", "irc", "ircs", "mailto", "xmpp"],
//     longDesc: ["http", "https"],
//     src: ["http", "https"],
//   },
//   required: {
//     input: { disabled: true, type: "checkbox" },
//   },
//   strip: ["script"],
//   tagNames: [
//     "a",
//     "b",
//     "blockquote",
//     "br",
//     "code",
//     "dd",
//     "del",
//     "details",
//     "div",
//     "dl",
//     "dt",
//     "em",
//     "h1",
//     "h2",
//     "h3",
//     "h4",
//     "h5",
//     "h6",
//     "hr",
//     "i",
//     "img",
//     // Note: `input` is not normally allowed by GH, when manually writing
//     // it in markdown, they add it from tasklists some other way.
//     // We can’t do that, so we have to allow it.
//     "input",
//     "ins",
//     "kbd",
//     "li",
//     "ol",
//     "p",
//     "picture",
//     "pre",
//     "q",
//     "rp",
//     "rt",
//     "ruby",
//     "s",
//     "samp",
//     "section",
//     "source",
//     "span",
//     "strike",
//     "strong",
//     "sub",
//     "summary",
//     "sup",
//     "table",
//     "tbody",
//     "td",
//     "tfoot",
//     "th",
//     "thead",
//     "tr",
//     "tt",
//     "ul",
//     "var",
//   ],
// };
