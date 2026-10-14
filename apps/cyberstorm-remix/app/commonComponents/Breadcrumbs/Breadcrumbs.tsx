import { useMatches } from "react-router";

import { NewBreadCrumbs } from "@thunderstore/cyberstorm";

import { breadcrumbTrail } from "./breadcrumbTrail";

/**
 * The breadcrumb bar for the current route. Hidden on the home page, which has
 * no trail beyond Home. `breadcrumbTrail` supplies every crumb after Home.
 */
export function Breadcrumbs() {
  const matches = useMatches();

  if (matches.some((match) => match.id === "rootIndex")) {
    return null;
  }

  return <NewBreadCrumbs>{breadcrumbTrail(matches)}</NewBreadCrumbs>;
}
