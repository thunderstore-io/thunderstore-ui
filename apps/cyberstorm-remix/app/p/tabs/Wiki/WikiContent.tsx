import "./Wiki.css";

import { type PackageWikiPageResponseData } from "@thunderstore/thunderstore-api";
import {
  Heading,
  NewButton,
  NewIcon,
  RelativeTime,
} from "@thunderstore/cyberstorm";
import {
  faArrowLeftLong,
  faArrowRightLong,
  faCalendarDay,
  faEdit,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, Suspense } from "react";
import { Markdown } from "~/commonComponents/Markdown/Markdown";
import { Await } from "react-router";

interface WikiContentProps {
  page: PackageWikiPageResponseData;
  communityId: string;
  namespaceId: string;
  packageId: string;
  previousPage?: string;
  nextPage?: string;
  canManage?: Promise<boolean>;
}

export const WikiContent = memo(function WikiContent({
  page,
  communityId,
  namespaceId,
  packageId,
  previousPage,
  nextPage,
  canManage,
}: WikiContentProps) {
  return (
    <>
      <div className="package-wiki-content__header">
        <div className="package-wiki-content__title">
          <Heading csLevel="3">{page.title}</Heading>
          <div className="package-wiki-content__meta">
            <span className="package-wiki-content__meta-date">
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faCalendarDay} />
              </NewIcon>
              <RelativeTime
                time={page.datetime_created}
                suppressHydrationWarning
              />
            </span>
            <span>
              <i>
                Updated{" "}
                <RelativeTime
                  time={page.datetime_updated}
                  suppressHydrationWarning
                />
              </i>
            </span>
          </div>
        </div>
        <Suspense>
          <Await resolve={canManage}>
            {(resolvedValue) =>
              resolvedValue ? (
                <div className="package-wiki-content__actions">
                  <NewButton
                    csSize="small"
                    primitiveType="cyberstormLink"
                    linkId="PackageWikiPageEdit"
                    community={communityId}
                    namespace={namespaceId}
                    package={packageId}
                    wikipageslug={page.slug}
                  >
                    <NewIcon csMode="inline" noWrapper>
                      <FontAwesomeIcon icon={faEdit} />
                    </NewIcon>
                    Edit
                  </NewButton>
                </div>
              ) : null
            }
          </Await>
        </Suspense>
      </div>
      <div className="package-wiki-content__body">
        <Markdown input={page.markdown_content} />
        {/* <div className="markdown-wrapper">
          <div
            dangerouslySetInnerHTML={{ __html: page.markdown_content }}
            className="markdown"
          />
        </div> */}
      </div>
      <div className="package-wiki-content__footer">
        {previousPage ? (
          <NewButton
            csModifiers={["ghost"]}
            csVariant="secondary"
            primitiveType="cyberstormLink"
            linkId="PackageWikiPage"
            community={communityId}
            namespace={namespaceId}
            package={packageId}
            wikipageslug={previousPage}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faArrowLeftLong} />
            </NewIcon>
            Previous Page
          </NewButton>
        ) : (
          <NewButton
            csModifiers={["ghost", "disabled"]}
            csVariant="secondary"
            disabled={true}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faArrowLeftLong} />
            </NewIcon>
            Previous Page
          </NewButton>
        )}
        {nextPage ? (
          <NewButton
            csModifiers={["ghost"]}
            csVariant="secondary"
            primitiveType="cyberstormLink"
            linkId="PackageWikiPage"
            community={communityId}
            namespace={namespaceId}
            package={packageId}
            wikipageslug={nextPage}
          >
            Next Page
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faArrowRightLong} />
            </NewIcon>
          </NewButton>
        ) : (
          <NewButton
            csModifiers={["ghost", "disabled"]}
            csVariant="secondary"
            disabled={true}
          >
            Next Page
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faArrowRightLong} />
            </NewIcon>
          </NewButton>
        )}
      </div>
    </>
  );
});
