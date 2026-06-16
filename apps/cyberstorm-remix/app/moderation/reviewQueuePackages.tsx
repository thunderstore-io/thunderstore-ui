import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";
import { getCanonicalUrl } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { useState } from "react";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";
import { Page } from "~/commonComponents/Page/Page";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import {
  EmptyState,
  NewAlert,
  NewButton,
  NewLink,
  NewSelect,
  NewTag,
  type SelectOption,
  formatToDisplayName,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type ModerationReviewQueueResponse,
  type ReviewQueueBulkActionData,
  extractApiErrorMessage,
  fetchModerationReviewQueue,
  isApiError,
  moderationReviewQueueBulkAction,
} from "@thunderstore/thunderstore-api";

import { type OutletContextShape } from "../root";
import type { Route } from "./+types/reviewQueuePackages";
import "./reviewQueuePackages.css";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

type BulkStatus = ReviewQueueBulkActionData["status"];

const reviewStatusTagVariant = {
  approved: "green",
  rejected: "red",
  unreviewed: "yellow",
} as const;

const statusOptions: SelectOption<BulkStatus>[] = [
  { value: "approved", label: "Approve" },
  { value: "rejected", label: "Reject" },
  { value: "unreviewed", label: "Mark unreviewed" },
  { value: "review-queue", label: "Keep in review queue" },
];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const tools = getSessionTools();
  const currentUser = await tools?.getSessionCurrentUser(true);
  const url = new URL(request.url);

  if (!currentUser?.username) {
    return redirectToLogin(url.pathname + url.search + url.hash);
  }

  const config = () => ({
    apiHost: tools.getConfig().apiHost,
    sessionId: tools.getConfig().sessionId,
  });
  const page = Number(url.searchParams.get("page")) || 1;
  const q = url.searchParams.get("q") ?? undefined;

  const seo = createSeo({
    descriptors: [
      { title: "Package review queue | Thunderstore" },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: getCanonicalUrl(request) },
    ],
  });

  try {
    const queue = await fetchModerationReviewQueue({ config, page, q });
    return { queue, forbidden: false, seo };
  } catch (error) {
    if (isApiError(error) && error.response.status === 403) {
      return { queue: null, forbidden: true, seo };
    }
    throw error;
  }
}

clientLoader.hydrate = true;

export default function ReviewQueuePackages() {
  const loaderData = useLoaderData<typeof clientLoader>();
  const queue: ModerationReviewQueueResponse | null =
    loaderData && "queue" in loaderData ? loaderData.queue : null;
  const forbidden = Boolean(
    loaderData && "forbidden" in loaderData && loaderData.forbidden
  );

  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();
  const revalidator = useRevalidator();

  const results = queue?.results ?? [];
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<BulkStatus>("approved");
  const [applying, setApplying] = useState(false);

  const allSelected = results.length > 0 && selected.size === results.length;

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === results.length
        ? new Set()
        : new Set(results.map((item) => item.id))
    );
  }

  async function applyBulk() {
    if (selected.size === 0) {
      toast.addToast({
        csVariant: "warning",
        children: "Select at least one package first.",
        duration: 4000,
      });
      return;
    }
    setApplying(true);
    try {
      await moderationReviewQueueBulkAction({
        config: outletContext.dapper.config,
        data: { package_listing_ids: [...selected], status },
      });
      toast.addToast({
        csVariant: "success",
        children: `Updated ${selected.size} package(s).`,
        duration: 4000,
      });
      setSelected(new Set());
      revalidator.revalidate();
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(error as Error),
        duration: 8000,
      });
    } finally {
      setApplying(false);
    }
  }

  return (
    <Page>
      <PageHeader headingLevel="1" headingSize="2">
        Package review queue
      </PageHeader>

      {forbidden ? (
        <NewAlert csVariant="danger">
          You don&apos;t have moderation permissions in any community.
        </NewAlert>
      ) : results.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Icon>
            <FontAwesomeIcon icon={faClipboardCheck} />
          </EmptyState.Icon>
          <EmptyState.Title>Queue is empty</EmptyState.Title>
          <EmptyState.Message>
            No packages are currently awaiting review.
          </EmptyState.Message>
        </EmptyState.Root>
      ) : (
        <>
          <div className="review-queue__toolbar">
            <div className="review-queue__toolbar-field">
              <span className="review-queue__toolbar-label">
                Set status of selected
              </span>
              <NewSelect
                options={statusOptions}
                value={status}
                onChange={(value) => setStatus(value)}
                csSize="small"
              />
            </div>
            <NewButton
              csVariant="accent"
              onClick={applyBulk}
              disabled={applying || selected.size === 0}
            >
              Apply
            </NewButton>
            <span className="review-queue__selected-count">
              {selected.size} selected · {queue?.count ?? results.length} in
              queue
            </span>
          </div>

          <div className="review-queue__table">
            <div className="review-queue__row review-queue__row--header">
              <input
                type="checkbox"
                className="review-queue__checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all"
              />
              <span />
              <span>Package</span>
              <span>Community</span>
              <span>Status</span>
            </div>
            {results.map((item) => (
              <div className="review-queue__row" key={item.id}>
                <input
                  type="checkbox"
                  className="review-queue__checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => toggle(item.id)}
                  aria-label={`Select ${item.name}`}
                />
                <img
                  className="review-queue__icon"
                  src={item.icon_url ?? undefined}
                  alt=""
                />
                <div className="review-queue__package">
                  <NewLink
                    primitiveType="cyberstormLink"
                    linkId="Package"
                    community={item.community_identifier}
                    namespace={item.namespace}
                    package={item.name}
                    csVariant="primary"
                    rootClasses="review-queue__package-name"
                  >
                    {formatToDisplayName(item.name)}
                  </NewLink>
                  <span className="review-queue__package-namespace">
                    by {item.namespace}
                  </span>
                </div>
                <span>{item.community_name}</span>
                <NewTag
                  csVariant={reviewStatusTagVariant[item.review_status]}
                  csSize="small"
                >
                  {item.review_status}
                </NewTag>
              </div>
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
