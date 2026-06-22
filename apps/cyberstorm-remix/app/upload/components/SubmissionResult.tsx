import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Heading,
  NewIcon,
  NewLink,
  NewTable,
  NewTableSort,
  NewTag,
} from "@thunderstore/cyberstorm";
import { type PackageSubmissionResult } from "@thunderstore/dapper/types";
import { faArrowUpRight, faUsers } from "@thunderstore/icons";

import { Island } from "../../commonComponents/Island/Island";
import { PageHeader } from "../../commonComponents/PageHeader/PageHeader";
import "./SubmissionResult.css";

export interface SubmissionResultProps {
  submissionStatusResult: PackageSubmissionResult;
}

export function SubmissionResult({
  submissionStatusResult,
}: SubmissionResultProps) {
  return (
    <Island rootClasses="upload__submission-result">
      <PageHeader
        headingLevel="1"
        headingSize="3"
        image={submissionStatusResult.package_version.icon}
        description={submissionStatusResult.package_version.description}
        variant="detailed"
        meta={
          <>
            <span className="page-header__meta-item">
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faUsers} />
              </NewIcon>
              By {submissionStatusResult.package_version.namespace}
            </span>
            {submissionStatusResult.package_version.website_url ? (
              <NewLink
                primitiveType="link"
                href={submissionStatusResult.package_version.website_url}
                csVariant="cyber"
                rootClasses="page-header__meta-item"
              >
                {submissionStatusResult.package_version.website_url}
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faArrowUpRight} />
                </NewIcon>
              </NewLink>
            ) : null}
          </>
        }
      >
        {submissionStatusResult.package_version.name}
      </PageHeader>

      <NewTable
        titleRowContent={
          <>
            <Heading csLevel="3" csSize="3">
              Success!
            </Heading>
            <p>
              The package is listed in{" "}
              {submissionStatusResult.available_communities.length}{" "}
              {submissionStatusResult.available_communities.length !== 1
                ? "communities"
                : "community"}
              :
            </p>
          </>
        }
        headers={[
          {
            value: "Community",
            disableSort: false,
            columnClasses: "versions__version",
          },
          {
            value: "Link",
            disableSort: true,
            columnClasses: "versions__upload-date",
          },
          {
            value: "Categories",
            disableSort: true,
            columnClasses: "versions__downloads",
          },
        ]}
        rows={submissionStatusResult.available_communities.map((v) => [
          {
            value: v.community.name,
            sortValue: v.community.name,
          },
          {
            value: (
              <NewLink
                primitiveType="link"
                href={`/c/${v.community.identifier}/p/${submissionStatusResult.package_version.namespace}/${submissionStatusResult.package_version.name}/`}
                target="_blank"
                csVariant="cyber"
              >
                View listing
              </NewLink>
            ),
            sortValue: v.url,
          },
          {
            value: (
              <div className="submission-result__categories">
                {v.categories.map((c) => (
                  <NewTag key={c.slug} csSize="small">
                    {c.name}
                  </NewTag>
                ))}
              </div>
            ),
            sortValue: v.categories.map((c) => c.name).join(", "),
          },
        ])}
        sortDirection={NewTableSort.ASC}
        csModifiers={["alignLastColumnRight"]}
      />
    </Island>
  );
}
