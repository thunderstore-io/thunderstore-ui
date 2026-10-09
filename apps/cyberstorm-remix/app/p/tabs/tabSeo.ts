import { createSeo } from "cyberstorm/utils/meta";

import { formatToDisplayName } from "@thunderstore/cyberstorm";

/**
 * Title, description and og:title for one of a package's tabs.
 *
 * Each tab has a URL people link to, so it names itself rather than borrowing
 * the package's title. og:description, og:image and the canonical stay with the
 * package page above it; the canonical points at the package, since a tab is a
 * view of it rather than a page of its own. A tab loader only has the route
 * params, so the community's name is the parent's to supply; fetching it again
 * for a title would cost a request per tab.
 *
 * Return it from both loaders: a client loader's result replaces the server's,
 * so a tab whose name only the server knew shows the package's title as soon
 * as someone clicks through to it.
 */
export function packageTabSeo(
  tab: string,
  packageId: string | undefined,
  description?: string
) {
  const packageName = formatToDisplayName(packageId ?? "");
  const heading = `${tab} · ${packageName}`;
  return createSeo({
    descriptors: [
      { title: `${heading} · Thunderstore` },
      {
        name: "description",
        content: description ?? `${tab} for ${packageName}`,
      },
      { property: "og:title", content: heading },
    ],
  });
}
