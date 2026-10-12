import { useState } from "react";
import { useLocation } from "react-router";

type PageUrl = { pathname: string; search: string };

// Counts page changes: a new pathname, or the same pathname with only the page
// number changed. Search, sort and filter changes don't count.
export function useAdPageview(): number {
  const { pathname, search } = useLocation();
  const [seen, setSeen] = useState({ pathname, search, pageview: 0 });
  if (seen.pathname === pathname && seen.search === search) {
    return seen.pageview;
  }
  const pageview = isPageChange(seen, { pathname, search })
    ? seen.pageview + 1
    : seen.pageview;
  setSeen({ pathname, search, pageview });
  return pageview;
}

function isPageChange(from: PageUrl, to: PageUrl): boolean {
  if (from.pathname !== to.pathname) {
    return true;
  }
  const before = new URLSearchParams(from.search);
  const after = new URLSearchParams(to.search);
  if (before.get("page") === after.get("page")) {
    return false;
  }
  before.delete("page");
  after.delete("page");
  before.sort();
  after.sort();
  return before.toString() === after.toString();
}
