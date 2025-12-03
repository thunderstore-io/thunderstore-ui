import { assert, describe, it } from "vitest";

import type { CurrentUser } from "@thunderstore/dapper";

import { isTeamOwner } from "../permissions";

describe("utils.permissions.isTeamOwner", () => {
  it("returns false if user is unauthenticated", () => {
    const actual = isTeamOwner("test-team", undefined);

    assert.isFalse(actual);
  });

  it("returns false if user does not belong to team", () => {
    const user = {
      teams_full: [{ name: "other-team", role: "owner", member_count: 1 }],
    };

    const actual = isTeamOwner("test-team", user as CurrentUser);

    assert.isFalse(actual);
  });

  it("returns false if user is non-owner member", () => {
    const user = {
      teams_full: [{ name: "test-team", role: "member", member_count: 2 }],
    };

    const actual = isTeamOwner("test-team", user as CurrentUser);

    assert.isFalse(actual);
  });

  it("returns true if user is owner of team", () => {
    const user = {
      teams_full: [
        { name: "other-team", role: "member", member_count: 1 },
        { name: "test-team", role: "owner", member_count: 3 },
      ],
    };

    const actual = isTeamOwner("test-team", user as CurrentUser);

    assert.isTrue(actual);
  });
});
