import type { Community, PackageListing } from "@thunderstore/dapper/types";

import catHeim from "../assets/catheim.png";
import goblin from "../assets/goblin.png";

export const packageIcon = goblin;
export const communityImage = catHeim;

export const modPackage = {
  community_identifier: "valheim",
  namespace: "Team",
  name: "cool-mod",
  description: "A cool mod",
  icon_url: goblin,
  download_count: 12345,
  rating_count: 678,
  categories: [
    { id: "ui", name: "UI", slug: "ui" },
    { id: "qol", name: "QoL", slug: "qol" },
  ],
  is_pinned: true,
  is_nsfw: false,
  is_deprecated: false,
  // Years old, so RelativeTime stays on one rounded year ("4 years ago")
  // until the next half-year boundary. A recent timestamp would move every capture.
  last_updated: "2023-01-01T00:00:00Z",
  size: 1234567,
  slug: "cool-mod",
} as PackageListing;

export const plainPackage = {
  ...modPackage,
  name: "plain-mod",
  slug: "plain-mod",
  description: "No badges",
  is_pinned: false,
  categories: [],
} as PackageListing;

export const community = {
  name: "Valheim",
  identifier: "valheim",
  short_description:
    "A survival sandbox for 1-10 players, set in a Viking purgatory.",
  description:
    "A survival sandbox for 1-10 players, set in a Viking purgatory.",
  wiki_url: "#",
  discord_url: "#",
  datetime_created: "2021-02-02T12:00:00Z",
  hero_image_url: catHeim,
  cover_image_url: catHeim,
  icon_url: catHeim,
  community_icon_url: catHeim,
  total_package_count: 1200,
  total_download_count: 34000,
} as Community;

export const selectOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "downloads", label: "Most downloaded" },
];

export const searchOptions = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
];

export const tableHeaders = [
  { value: "Name", disableSort: false },
  { value: "Downloads", disableSort: true },
];

export const tableRows = [
  [
    { value: "Cool mod", sortValue: "Cool mod" },
    { value: "12 345", sortValue: 12345 },
  ],
  [
    { value: "Plain mod", sortValue: "Plain mod" },
    { value: "80", sortValue: 80 },
  ],
];
