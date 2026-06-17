import {
  faChevronDown,
  faChevronRight,
  faClipboardCheck,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CollapsibleMenu } from "app/commonComponents/Collapsible/Collapsible";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";
import { getCanonicalUrl } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { useEffect, useState } from "react";
import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
  useSearchParams,
} from "react-router";
import { Page } from "~/commonComponents/Page/Page";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import {
  EmptyState,
  NewAlert,
  NewButton,
  NewIcon,
  NewPagination,
  NewSelect,
  NewTag,
  type SelectOption,
  classnames,
  formatToDisplayName,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type ModerationReviewResponse,
  type ReviewBulkUpdateData,
  type ReviewListing,
  extractApiErrorMessage,
  fetchModerationReviewListings,
  isApiError,
  moderationReviewBulkUpdate,
} from "@thunderstore/thunderstore-api";

import { type OutletContextShape } from "../root";
import type { Route } from "./+types/reviewPackages";
import "./reviewPackages.css";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

type BulkStatus = ReviewBulkUpdateData["status"];
type ReviewStatus = ReviewListing["review_status"];

const reviewStatusTagVariant = {
  approved: "green",
  rejected: "red",
  unreviewed: "yellow",
} as const;

// Bulk action targets (what to set the selected listings to).
const statusOptions: SelectOption<BulkStatus>[] = [
  { value: "approved", label: "Approve" },
  { value: "rejected", label: "Reject" },
  { value: "unreviewed", label: "Unreviewed" },
];

const filterOptions: SelectOption<string>[] = [
  { value: "all", label: "All statuses" },
  { value: "unreviewed", label: "Unreviewed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const statusLabels: Record<ReviewStatus, string> = {
  unreviewed: "Unreviewed",
  approved: "Approved",
  rejected: "Rejected",
};

// Order of the collapsible status sections (most actionable first).
const statusOrder: ReviewStatus[] = ["unreviewed", "rejected", "approved"];

// Mirrors the backend ReviewListingPaginator.page_size.
const PER_PAGE = 20;

const isReviewStatus = (value: string): value is ReviewStatus =>
  value === "unreviewed" || value === "approved" || value === "rejected";

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
  const reviewStatusParam = url.searchParams.get("review_status") ?? "";
  const reviewStatus = isReviewStatus(reviewStatusParam)
    ? reviewStatusParam
    : undefined;
  const community = url.searchParams.get("community") ?? undefined;

  const seo = createSeo({
    descriptors: [
      { title: "Package review | Thunderstore" },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: getCanonicalUrl(request) },
    ],
  });

  // Always attempt the fetch and let the backend decide: the API returns 403
  // (no listings) when the user can't moderate any community. We never gate on
  // the client-side is_moderator flag here — the backend is the authority.
  try {
    const queue = await fetchModerationReviewListings({
      config,
      page,
      q,
      reviewStatus,
      community,
    });
    return { queue, forbidden: false, seo };
  } catch (error) {
    if (isApiError(error) && error.response.status === 403) {
      return { queue: null, forbidden: true, seo };
    }
    throw error;
  }
}

clientLoader.hydrate = true;

type Draft = { notes: string; reason: string };

export default function ReviewPackages() {
  const loaderData = useLoaderData<typeof clientLoader>();
  const queue: ModerationReviewResponse | null =
    loaderData && "queue" in loaderData ? loaderData.queue : null;
  const forbidden = Boolean(
    loaderData && "forbidden" in loaderData && loaderData.forbidden
  );

  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();
  const revalidator = useRevalidator();
  const [searchParams, setSearchParams] = useSearchParams();

  const results = queue?.results ?? [];
  const communities = queue?.communities ?? [];
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<BulkStatus>("approved");
  const [bulkReason, setBulkReason] = useState("");
  const [applying, setApplying] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [rowBusy, setRowBusy] = useState<Set<number>>(new Set());

  const activeFilter = searchParams.get("review_status") ?? "all";
  const activeCommunity = searchParams.get("community") ?? "all";
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalCount = queue?.count ?? results.length;

  const communityFilterOptions: SelectOption<string>[] = [
    { value: "all", label: "All communities" },
    ...communities.map((c) => ({
      value: c.identifier,
      label: `${c.name} (${c.count})`,
    })),
  ];

  // Reset transient UI when the visible packages change (pagination, search,
  // filter, or revalidation) so stale selection/edits can't apply to packages
  // that are no longer shown.
  const resultIdsKey = results.map((item) => item.id).join(",");
  useEffect(() => {
    setSelected(new Set());
    setExpanded(new Set());
    setDrafts({});
  }, [resultIdsKey]);

  const allSelected = results.length > 0 && selected.size === results.length;

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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

  function toggleExpanded(item: ReviewListing) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
        // Seed the editable draft from the listing's current context.
        setDrafts((d) =>
          d[item.id]
            ? d
            : {
                ...d,
                [item.id]: {
                  notes: item.internal_notes,
                  reason: item.rejection_reason,
                },
              }
        );
      }
      return next;
    });
  }

  function setDraft(id: number, patch: Partial<Draft>) {
    setDrafts((d) => {
      const current = d[id] ?? { notes: "", reason: "" };
      return { ...d, [id]: { ...current, ...patch } };
    });
  }

  function setRowBusyState(id: number, busy: boolean) {
    setRowBusy((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function updateUrl(mutate: (params: URLSearchParams) => void) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mutate(next);
        next.delete("page");
        return next;
      },
      { preventScrollReset: true }
    );
  }

  function changePage(page: number) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (page <= 1) next.delete("page");
        else next.set("page", String(page));
        return next;
      },
      { preventScrollReset: true }
    );
  }

  function applySearch() {
    updateUrl((next) => {
      const trimmed = searchInput.trim();
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
    });
  }

  function changeFilter(value: string) {
    updateUrl((next) => {
      if (value === "all") next.delete("review_status");
      else next.set("review_status", value);
    });
  }

  function changeCommunity(value: string) {
    updateUrl((next) => {
      if (value === "all") next.delete("community");
      else next.set("community", value);
    });
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
    if (status === "rejected" && !bulkReason.trim()) {
      toast.addToast({
        csVariant: "warning",
        children: "A rejection reason is required to reject packages.",
        duration: 4000,
      });
      return;
    }
    setApplying(true);
    try {
      await moderationReviewBulkUpdate({
        config: outletContext.dapper.config,
        data: {
          package_listing_ids: [...selected],
          status,
          rejection_reason: bulkReason,
        },
      });
      toast.addToast({
        csVariant: "success",
        children: `Updated ${selected.size} package(s).`,
        duration: 4000,
      });
      setSelected(new Set());
      setBulkReason("");
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

  async function applyRow(item: ReviewListing, rowStatus: BulkStatus) {
    const draft = drafts[item.id] ?? {
      notes: item.internal_notes,
      reason: item.rejection_reason,
    };
    if (rowStatus === "rejected" && !draft.reason.trim()) {
      toast.addToast({
        csVariant: "warning",
        children: "A rejection reason is required to reject this package.",
        duration: 4000,
      });
      return;
    }
    setRowBusyState(item.id, true);
    try {
      await moderationReviewBulkUpdate({
        config: outletContext.dapper.config,
        data: {
          package_listing_ids: [item.id],
          status: rowStatus,
          rejection_reason: draft.reason,
          internal_notes: draft.notes,
        },
      });
      toast.addToast({
        csVariant: "success",
        children: `${formatToDisplayName(item.name)} updated.`,
        duration: 4000,
      });
      revalidator.revalidate();
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(error as Error),
        duration: 8000,
      });
    } finally {
      setRowBusyState(item.id, false);
    }
  }

  const groups = statusOrder
    .map((groupStatus) => ({
      status: groupStatus,
      items: results.filter((item) => item.review_status === groupStatus),
    }))
    .filter((group) => group.items.length > 0);

  function renderRow(item: ReviewListing) {
    const isOpen = expanded.has(item.id);
    const draft = drafts[item.id] ?? {
      notes: item.internal_notes,
      reason: item.rejection_reason,
    };
    const busy = rowBusy.has(item.id);
    const packageUrl = `/c/${item.community_identifier}/p/${item.namespace}/${item.name}/`;

    return (
      <div className="review-queue__item" key={item.id}>
        <div className="review-queue__row">
          <input
            type="checkbox"
            className="review-queue__checkbox review-queue__cell-check"
            checked={selected.has(item.id)}
            onChange={() => toggle(item.id)}
            aria-label={`Select ${item.name}`}
          />
          <img
            className="review-queue__icon"
            src={item.icon_url ?? undefined}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <div className="review-queue__package">
            <span className="review-queue__package-name">
              {formatToDisplayName(item.name)}
            </span>
            <span className="review-queue__package-namespace">
              by {item.namespace}
            </span>
          </div>
          <div className="review-queue__meta">
            <span className="review-queue__community">
              {item.community_name}
            </span>
            <NewTag
              csVariant={reviewStatusTagVariant[item.review_status]}
              csSize="small"
            >
              {item.review_status}
            </NewTag>
          </div>
          <div className="review-queue__row-actions">
            <a
              className="review-queue__icon-button"
              href={packageUrl}
              target="_blank"
              rel="noreferrer"
              title="Open package in a new tab"
              aria-label="Open package in a new tab"
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faUpRightFromSquare} />
              </NewIcon>
            </a>
            <NewButton
              onClick={() => toggleExpanded(item)}
              tooltipText={isOpen ? "Collapse" : "Review"}
              aria-label={isOpen ? "Collapse" : "Review"}
              aria-expanded={isOpen}
              csSize="small"
              csVariant="secondary"
              csModifiers={["ghost", "only-icon"]}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon
                  icon={isOpen ? faChevronDown : faChevronRight}
                />
              </NewIcon>
            </NewButton>
          </div>
        </div>

        {isOpen ? (
          <div className="review-queue__expanded">
            <label className="review-queue__field">
              <span className="review-queue__field-label">Internal notes</span>
              <textarea
                className="review-queue__textarea"
                value={draft.notes}
                onChange={(e) => setDraft(item.id, { notes: e.target.value })}
                placeholder="Notes visible to moderators only"
              />
              {/* Kept next to the notes (away from Approve/Reject) so saving a
                  note can't be mistaken for a review decision. */}
              <div className="review-queue__notes-actions">
                <NewButton
                  csVariant="secondary"
                  csSize="small"
                  disabled={busy}
                  onClick={() => applyRow(item, item.review_status)}
                >
                  Save notes
                </NewButton>
              </div>
            </label>
            <label className="review-queue__field">
              <span className="review-queue__field-label">
                Rejection reason
                <span className="review-queue__field-hint">
                  (required to reject; shown to the author)
                </span>
              </span>
              <textarea
                className="review-queue__textarea"
                value={draft.reason}
                onChange={(e) => setDraft(item.id, { reason: e.target.value })}
                placeholder="Why this package is being rejected"
              />
            </label>
            <div className="review-queue__row-buttons">
              <NewButton
                csVariant="success"
                csSize="small"
                disabled={busy}
                onClick={() => applyRow(item, "approved")}
              >
                Approve
              </NewButton>
              <NewButton
                csVariant="danger"
                csSize="small"
                disabled={busy || !draft.reason.trim()}
                onClick={() => applyRow(item, "rejected")}
              >
                Reject
              </NewButton>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Page>
      <PageHeader headingLevel="1" headingSize="2">
        Package review
      </PageHeader>

      {forbidden ? (
        <NewAlert csVariant="danger">
          You don&apos;t have moderation permissions in any community.
        </NewAlert>
      ) : (
        <>
          <div className="review-queue__filters">
            <div className="review-queue__search-group">
              <input
                type="search"
                className="review-queue__search"
                placeholder="Search packages…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applySearch();
                }}
                aria-label="Search review queue"
              />
              <NewButton
                csVariant="secondary"
                csSize="small"
                onClick={applySearch}
              >
                Search
              </NewButton>
            </div>
            <div className="review-queue__filter-field">
              <NewSelect
                options={communityFilterOptions}
                value={activeCommunity}
                onChange={changeCommunity}
                aria-label="Filter by community"
                csSize="small"
              />
            </div>
            <div className="review-queue__filter-field">
              <NewSelect
                options={filterOptions}
                value={activeFilter}
                onChange={changeFilter}
                aria-label="Filter by status"
                csSize="small"
              />
            </div>
          </div>

          {results.length === 0 ? (
            <EmptyState.Root>
              <EmptyState.Icon>
                <FontAwesomeIcon icon={faClipboardCheck} />
              </EmptyState.Icon>
              <EmptyState.Title>Nothing to review</EmptyState.Title>
              <EmptyState.Message>
                No packages match the current filters.
              </EmptyState.Message>
            </EmptyState.Root>
          ) : (
            <>
              <p className="review-queue__summary">
                {totalCount} package{totalCount === 1 ? "" : "s"} awaiting
                review
              </p>

              <div
                className={classnames(
                  "review-queue__toolbar",
                  selected.size > 0
                    ? "review-queue__toolbar--active"
                    : undefined
                )}
              >
                <div className="review-queue__toolbar-selection">
                  <label className="review-queue__select-all">
                    <input
                      type="checkbox"
                      className="review-queue__checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all"
                    />
                    Select all
                  </label>
                  <span className="review-queue__selected-count">
                    {selected.size > 0
                      ? `${selected.size} selected`
                      : "Select packages for a bulk action"}
                  </span>
                  {selected.size > 0 ? (
                    <NewButton
                      csVariant="secondary"
                      csModifiers={["ghost"]}
                      csSize="small"
                      onClick={() => setSelected(new Set())}
                    >
                      Clear
                    </NewButton>
                  ) : null}
                </div>
                <div className="review-queue__toolbar-actions">
                  <div className="review-queue__bulk-select">
                    <NewSelect
                      options={statusOptions}
                      value={status}
                      onChange={(value) => setStatus(value)}
                      csSize="small"
                    />
                  </div>
                  {status === "rejected" ? (
                    <input
                      type="text"
                      className="review-queue__search"
                      placeholder="Rejection reason (required)"
                      value={bulkReason}
                      onChange={(e) => setBulkReason(e.target.value)}
                      aria-label="Bulk rejection reason"
                    />
                  ) : null}
                  <NewButton
                    csVariant="accent"
                    csSize="small"
                    onClick={applyBulk}
                    disabled={applying || selected.size === 0}
                  >
                    {selected.size > 0 ? `Apply to ${selected.size}` : "Apply"}
                  </NewButton>
                </div>
              </div>

              {groups.map((group) => (
                <CollapsibleMenu
                  key={group.status}
                  headerTitle={`${statusLabels[group.status]} (${
                    group.items.length
                  })`}
                  defaultOpen
                >
                  <div className="review-queue__table">
                    {group.items.map(renderRow)}
                  </div>
                </CollapsibleMenu>
              ))}

              {totalCount > PER_PAGE ? (
                <div className="review-queue__pagination">
                  <NewPagination
                    currentPage={currentPage}
                    onPageChange={changePage}
                    pageSize={PER_PAGE}
                    siblingCount={2}
                    totalCount={totalCount}
                  />
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </Page>
  );
}
