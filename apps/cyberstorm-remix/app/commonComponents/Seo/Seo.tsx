import { findMatchWithSeoInMatches } from "cyberstorm/utils/meta";
import { useMatches } from "react-router";

export function Seo() {
  const matches = useMatches();
  const match = findMatchWithSeoInMatches(matches);

  if (!match) return null;

  return (
    <>
      {match.descriptors.map((descriptor, index) => {
        if ("title" in descriptor && typeof descriptor.title === "string") {
          const title = match.prefix
            ? `${match.prefix} | ${descriptor.title}`
            : descriptor.title;
          return <title key={index}>{title}</title>;
        }
        if ("charSet" in descriptor && typeof descriptor.charSet === "string") {
          return <meta key={index} charSet={descriptor.charSet} />;
        }
        if (
          "property" in descriptor &&
          typeof descriptor.property === "string" &&
          typeof descriptor.content === "string"
        ) {
          return (
            <meta
              key={descriptor.property}
              property={descriptor.property}
              content={descriptor.content}
            />
          );
        }
        if (
          "name" in descriptor &&
          typeof descriptor.name === "string" &&
          typeof descriptor.content === "string"
        ) {
          return (
            <meta
              key={descriptor.name}
              name={descriptor.name}
              content={descriptor.content}
            />
          );
        }
        if (
          "httpEquiv" in descriptor &&
          typeof descriptor.httpEquiv === "string" &&
          typeof descriptor.content === "string"
        ) {
          return (
            <meta
              key={descriptor.httpEquiv}
              httpEquiv={descriptor.httpEquiv}
              content={descriptor.content}
            />
          );
        }
        if (
          "script:ld+json" in descriptor &&
          typeof descriptor["script:ld+json"] === "object"
        ) {
          // Sanitize JSON-LD to prevent script injection (via closing script tags)
          // and ensure valid JS string parsing for line/paragraph separators.
          const jsonLd = JSON.stringify(descriptor["script:ld+json"])
            .replace(/</g, "\\u003c")
            .replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029");
          return (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: jsonLd,
              }}
            />
          );
        }
        if ("tagName" in descriptor) {
          if (descriptor.tagName === "link") {
            const { tagName, ...rest } = descriptor;
            return <link key={index} {...rest} />;
          }
          if (descriptor.tagName === "meta") {
            const { tagName, ...rest } = descriptor;
            return <meta key={index} {...rest} />;
          }
        }
        return <meta key={index} {...descriptor} />;
      })}
    </>
  );
}
