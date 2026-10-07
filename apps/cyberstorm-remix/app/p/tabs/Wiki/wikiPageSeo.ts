import { createSeo } from "cyberstorm/utils/meta";

import { formatToDisplayName } from "@thunderstore/cyberstorm";

/**
 * Title and card for one page of a package's wiki. Reads from the specific to
 * the general — the page, then the tab it belongs to, then the package — so a
 * wiki page is recognisable in a tab strip or a result list without being
 * mistaken for the package itself.
 */
export function wikiPageSeo(
  pageTitle: string,
  packageId: string | undefined,
  packageName: string
) {
  const heading = `${pageTitle} · Wiki · ${formatToDisplayName(
    packageId ?? ""
  )}`;
  return createSeo({
    descriptors: [
      { title: `${heading} · Thunderstore` },
      {
        name: "description",
        content: `${pageTitle} — wiki for ${packageName}`,
      },
      { property: "og:title", content: heading },
    ],
  });
}
