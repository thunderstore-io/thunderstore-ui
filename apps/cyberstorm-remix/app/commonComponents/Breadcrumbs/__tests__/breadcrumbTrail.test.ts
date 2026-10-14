import { Children, type ReactNode, isValidElement } from "react";
import type { UIMatch } from "react-router";
import { describe, expect, it } from "vitest";

import { breadcrumbTrail } from "../breadcrumbTrail";

function route(id: string, params: Record<string, string> = {}): UIMatch {
  return {
    id,
    params,
    data: undefined,
    pathname: "/",
    handle: undefined,
  } as UIMatch;
}

function readCrumbs(nodes: ReactNode) {
  return Children.toArray(nodes).map((node) => {
    if (!isValidElement<{ children?: ReactNode; linkId?: string }>(node)) {
      throw new Error("Expected a crumb element");
    }
    return {
      label: node.props.children,
      linkId: node.props.linkId,
    };
  });
}

describe("breadcrumbTrail", () => {
  it("shows no crumbs when nothing matches", () => {
    expect(readCrumbs(breadcrumbTrail([]))).toEqual([]);
  });

  it.each([
    ["upload/upload", "Upload"],
    ["login/login", "Log in"],
    ["communities/communities", "Communities"],
    ["tools/manifest-validator/manifestValidator", "Manifest Validator"],
    ["tools/markdown-preview/markdownPreview", "Markdown Preview"],
  ])("marks %s as text", (id, label) => {
    expect(readCrumbs(breadcrumbTrail([route(id)]))).toEqual([
      { label, linkId: undefined },
    ]);
  });

  it("shows Settings as text, and links it when Account follows", () => {
    expect(
      readCrumbs(breadcrumbTrail([route("settings/user/Settings")]))
    ).toEqual([{ label: "Settings", linkId: undefined }]);

    expect(
      readCrumbs(
        breadcrumbTrail([
          route("settings/user/Settings"),
          route("settings/user/Account/Account"),
        ])
      )
    ).toEqual([
      { label: "Settings", linkId: "Settings" },
      { label: "Account", linkId: undefined },
    ]);
  });

  it("shows the open team tab after the team links", () => {
    expect(
      readCrumbs(
        breadcrumbTrail([
          route("settings/teams/team/teamSettings", { namespaceId: "Team" }),
          route("settings/teams/team/tabs/Profile/Profile"),
        ])
      )
    ).toEqual([
      { label: "Teams", linkId: "Teams" },
      { label: "Team", linkId: "TeamSettings" },
      { label: "Profile", linkId: undefined },
    ]);
  });

  it("shows a package name as text and a version after a package link", () => {
    const params = {
      communityId: "riskofrain2",
      namespaceId: "Team",
      packageId: "BepInEx",
    };

    expect(
      readCrumbs(breadcrumbTrail([route("p/packageListing", params)]))
    ).toEqual([{ label: "BepInEx", linkId: undefined }]);

    expect(
      readCrumbs(
        breadcrumbTrail([
          route("p/packageListingVersion", {
            ...params,
            packageVersion: "1.2.3",
          }),
        ])
      )
    ).toEqual([
      { label: "BepInEx", linkId: "Package" },
      { label: "1.2.3", linkId: undefined },
    ]);
  });

  it("ends the dependants and team trails on their text crumb", () => {
    const params = {
      communityId: "riskofrain2",
      namespaceId: "Team",
      packageId: "BepInEx",
    };

    expect(
      readCrumbs(breadcrumbTrail([route("p/dependants/Dependants", params)]))
    ).toEqual([
      { label: "Communities", linkId: "Communities" },
      { label: "BepInEx", linkId: "Package" },
      { label: "Dependants", linkId: undefined },
    ]);

    expect(readCrumbs(breadcrumbTrail([route("p/team/Team", params)]))).toEqual(
      [
        { label: "Communities", linkId: "Communities" },
        { label: "Team", linkId: undefined },
      ]
    );
  });

  it("shows namespace, package, and version without a community", () => {
    expect(
      readCrumbs(
        breadcrumbTrail([
          route("p/packageVersionWithoutCommunity", {
            namespaceId: "Team",
            packageId: "BepInEx",
            packageVersion: "1.2.3",
          }),
        ])
      )
    ).toEqual([
      { label: "Team", linkId: undefined },
      { label: "BepInEx", linkId: undefined },
      { label: "1.2.3", linkId: undefined },
    ]);
  });
});
