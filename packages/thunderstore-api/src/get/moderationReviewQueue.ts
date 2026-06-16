import { z } from "zod";

import { apiFetch } from "../apiFetch";
import type { RequestConfig } from "../index";

export const reviewQueuePackageSchema = z.object({
  id: z.number(),
  community_identifier: z.string(),
  community_name: z.string(),
  namespace: z.string(),
  name: z.string(),
  review_status: z.enum(["unreviewed", "approved", "rejected"]),
  is_review_requested: z.boolean(),
  last_updated: z.string().datetime(),
  icon_url: z.string().nullable(),
});

export const moderationReviewQueueResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(reviewQueuePackageSchema),
});

export type ReviewQueuePackage = z.infer<typeof reviewQueuePackageSchema>;
export type ModerationReviewQueueResponse = z.infer<
  typeof moderationReviewQueueResponseSchema
>;

export async function fetchModerationReviewQueue(props: {
  config: () => RequestConfig;
  page?: number;
  q?: string;
}): Promise<ModerationReviewQueueResponse> {
  const { config, page = 1, q } = props;
  const search = new URLSearchParams();
  search.set("page", String(page));
  if (q) search.set("q", q);

  return await apiFetch({
    args: {
      config,
      path: `api/cyberstorm/moderation/review-queue/packages/?${search.toString()}`,
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: moderationReviewQueueResponseSchema,
  });
}
