import { z } from "zod";

import { apiFetch } from "../apiFetch";
import type { RequestConfig } from "../index";

export const reviewQueueBulkActionDataSchema = z.object({
  package_listing_ids: z.array(z.number()),
  // The three review_status values plus "review-queue" (sets is_review_requested).
  status: z.enum(["unreviewed", "approved", "rejected", "review-queue"]),
  rejection_reason: z.string().optional(),
  internal_notes: z.string().nullable().optional(),
});

export type ReviewQueueBulkActionData = z.infer<
  typeof reviewQueueBulkActionDataSchema
>;

export async function moderationReviewQueueBulkAction(props: {
  config: () => RequestConfig;
  data: ReviewQueueBulkActionData;
}) {
  const { config, data } = props;

  return await apiFetch({
    args: {
      config,
      path: "api/cyberstorm/moderation/review-queue/packages/bulk-action/",
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: reviewQueueBulkActionDataSchema,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
