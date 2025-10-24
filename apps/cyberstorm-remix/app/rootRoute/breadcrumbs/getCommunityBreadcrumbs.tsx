import { isRecord, NewBreadCrumbsLink } from "@thunderstore/cyberstorm";
import { Suspense } from "react";
import { Await, type UIMatch } from "react-router";

export function getCommunityBreadcrumb(
  communityPage: UIMatch | undefined,
  isNotLast: boolean
) {
  if (!communityPage) return null;
  return (
    <>
      {isRecord(communityPage.data) &&
      Object.prototype.hasOwnProperty.call(communityPage.data, "community") ? (
        <Suspense
          fallback={
            <span>
              <span>Loading...</span>
            </span>
          }
        >
          <Await resolve={communityPage.data.community}>
            {(resolvedValue) => {
              let label: string | undefined = undefined;
              let icon = undefined;
              if (isRecord(resolvedValue)) {
                label =
                  Object.prototype.hasOwnProperty.call(resolvedValue, "name") &&
                  typeof resolvedValue.name === "string"
                    ? resolvedValue.name
                    : communityPage.params.communityId;
                icon =
                  Object.prototype.hasOwnProperty.call(
                    resolvedValue,
                    "community_icon_url"
                  ) && typeof resolvedValue.community_icon_url === "string" ? (
                    <img
                      src={resolvedValue.community_icon_url}
                      loading="lazy"
                      decoding="async"
                      alt=""
                    />
                  ) : undefined;
              }
              if (!label) label = communityPage.params.communityId;
              return isNotLast ? (
                <NewBreadCrumbsLink
                  primitiveType="cyberstormLink"
                  linkId="Community"
                  community={communityPage.params.communityId}
                  csVariant="cyber"
                >
                  {icon}
                  {label}
                </NewBreadCrumbsLink>
              ) : (
                <span>
                  <span>
                    {icon}
                    {label}
                  </span>
                </span>
              );
            }}
          </Await>
        </Suspense>
      ) : null}
    </>
  );
}
