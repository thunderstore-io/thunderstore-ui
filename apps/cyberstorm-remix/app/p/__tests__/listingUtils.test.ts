import { describe, expect, test } from "vitest";

import type { PackagePermissions } from "@thunderstore/dapper/types";

import { canViewPackageAnalytics } from "../listingUtils";

function permissions(
  overrides: Partial<PackagePermissions["permissions"]>
): PackagePermissions {
  return {
    package: {
      community_id: "test-community",
      namespace_id: "Cool_Team",
      package_name: "Cool_Package",
    },
    permissions: {
      can_manage: false,
      can_manage_wiki: false,
      can_manage_deprecation: false,
      can_manage_categories: false,
      can_deprecate: false,
      can_undeprecate: false,
      can_unlist: false,
      can_moderate: false,
      can_view_package_admin_page: false,
      can_view_listing_admin_page: false,
      ...overrides,
    },
  };
}

describe("canViewPackageAnalytics", () => {
  test("is true for a member of the owning team", () => {
    expect(
      canViewPackageAnalytics(permissions({ can_manage_wiki: true }))
    ).toBe(true);
  });

  test("is false for a signed-in user with no package permissions", () => {
    expect(canViewPackageAnalytics(permissions({}))).toBe(false);
  });

  test("is false for an anonymous visitor", () => {
    expect(canViewPackageAnalytics(undefined)).toBe(false);
  });

  test("is false for a community moderator outside the team", () => {
    expect(
      canViewPackageAnalytics(
        permissions({
          can_moderate: true,
          can_manage: true,
          can_manage_categories: true,
        })
      )
    ).toBe(false);
  });

  test("is false for a superuser who can unlist but is not on the team", () => {
    expect(
      canViewPackageAnalytics(
        permissions({ can_manage: true, can_unlist: true })
      )
    ).toBe(false);
  });
});
