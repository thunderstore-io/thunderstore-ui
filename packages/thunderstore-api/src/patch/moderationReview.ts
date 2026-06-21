import { z } from "zod";

import { apiFetch } from "../apiFetch";
import type { RequestConfig } from "../index";

export const reviewBulkUpdateDataSchema = z.object({
  package_listing_ids: z.array(z.number()),
  status: z.enum(["unreviewed", "approved", "rejected"]),
  rejection_reason: z.string().optional(),
  internal_notes: z.string().nullable().optional(),
});

export type ReviewBulkUpdateData = z.infer<typeof reviewBulkUpdateDataSchema>;

export async function moderationReviewBulkUpdate(props: {
  config: () => RequestConfig;
  data: ReviewBulkUpdateData;
}) {
  const { config, data } = props;

  return await apiFetch({
    args: {
      config,
      path: "/api/cyberstorm/moderation/review/packages/",
      request: {
        method: "PATCH",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      bodyRaw: data,
      useSession: true,
    },
    requestSchema: reviewBulkUpdateDataSchema,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
