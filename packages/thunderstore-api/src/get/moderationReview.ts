import { z } from "zod";

import { apiFetch } from "../apiFetch";
import type { RequestConfig } from "../index";

export const reviewListingSchema = z.object({
  id: z.number(),
  community_identifier: z.string(),
  community_name: z.string(),
  namespace: z.string(),
  name: z.string(),
  review_status: z.enum(["unreviewed", "approved", "rejected"]),
  is_review_requested: z.boolean(),
  last_updated: z.string().datetime(),
  icon_url: z.string().nullable(),
  rejection_reason: z.string(),
  internal_notes: z.string(),
});

export const reviewCommunitySchema = z.object({
  identifier: z.string(),
  name: z.string(),
  count: z.number(),
});

export const moderationReviewResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(reviewListingSchema),
  communities: z.array(reviewCommunitySchema),
});

export type ReviewListing = z.infer<typeof reviewListingSchema>;
export type ReviewCommunity = z.infer<typeof reviewCommunitySchema>;
export type ModerationReviewResponse = z.infer<
  typeof moderationReviewResponseSchema
>;

export async function fetchModerationReviewListings(props: {
  config: () => RequestConfig;
  page?: number;
  q?: string;
  reviewStatus?: ReviewListing["review_status"];
  community?: string;
}): Promise<ModerationReviewResponse> {
  const { config, page = 1, q, reviewStatus, community } = props;
  const search = new URLSearchParams();
  search.set("page", String(page));
  if (q) search.set("q", q);
  if (reviewStatus) search.set("review_status", reviewStatus);
  if (community) search.set("community", community);

  return await apiFetch({
    args: {
      config,
      path: `/api/cyberstorm/moderation/review/packages/?${search.toString()}`,
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: moderationReviewResponseSchema,
  });
}
