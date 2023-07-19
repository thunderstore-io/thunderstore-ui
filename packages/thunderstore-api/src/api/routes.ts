import { RequestConfig } from "../config";
import { R } from "../utils/router";

function apiFetch(path: string) {
  return fetch(path, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

const routes = {
  v1: R((community: string) => `c/${community}/api/v1/`, {
    bot: R("bot/", {
      deprecateMod: R("deprecate-mod/"),
    }),
    currentUser: R("current-user/", {
      info: R("info/", undefined, apiFetch),
    }),
    package: R(
      "package/",
      {
        detail: R(
          (uuid4: string) => `${uuid4}/`,
          {
            rate: R("rate/"),
          },
          apiFetch
        ),
      },
      apiFetch
    ),
  }),
};

export function packageList(args: {
  config: RequestConfig;
  community_identifier: string;
}) {
  return routes.v1(args.community_identifier).package.resolve();
}

export function packageDetail(args: {
  config: RequestConfig;
  community_identifier: string;
  uuid4: string;
}) {
  return routes
    .v1(args.community_identifier)
    .package.detail(args.uuid4)
    .resolve();
}

export type RatingTargetState = "rated" | "unrated";

export function packageRate(args: {
  config: RequestConfig;
  community_identifier: string;
  uuid4: string;
  payload: {
    target_state: RatingTargetState;
  };
}) {
  const url = routes
    .v1(args.community_identifier)
    .package.detail(args.uuid4)
    .rate.resolve();
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(args.payload),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}
