import { faArrowUpRight, faUsers } from "@fortawesome/pro-solid-svg-icons";
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

import { Island } from "../../commonComponents/Island/Island";
import { PageHeader } from "../../commonComponents/PageHeader/PageHeader";
import { OverrideMigrationNotice } from "./OverrideMigrationNotice";
import "./SubmissionResult.css";

export interface SubmissionResultProps {
  submissionStatusResult: PackageSubmissionResult;
  carryReadmeOverride: boolean;
}

export function SubmissionResult({
  submissionStatusResult,
  carryReadmeOverride,
}: SubmissionResultProps) {
  const { package_version: version, available_communities: communities } =
    submissionStatusResult;
  return (
    <Island rootClasses="upload__submission-result">
      <PageHeader
        headingLevel="1"
        headingSize="3"
        image={version.icon}
        description={version.description}
        variant="detailed"
        meta={
          <>
            <span className="page-header__meta-item">
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faUsers} />
              </NewIcon>
              By {version.namespace}
            </span>
            {version.website_url ? (
              <NewLink
                primitiveType="link"
                href={version.website_url}
                csVariant="cyber"
                rootClasses="page-header__meta-item"
              >
                {version.website_url}
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faArrowUpRight} />
                </NewIcon>
              </NewLink>
            ) : null}
          </>
        }
      >
        {version.name}
      </PageHeader>

      <OverrideMigrationNotice
        namespace={version.namespace}
        packageName={version.name}
        newVersion={version.version_number}
        autoCarry={carryReadmeOverride}
      />

      <NewTable
        titleRowContent={
          <>
            <Heading csLevel="3" csSize="3">
              Success!
            </Heading>
            <p>
              The package is listed in {communities.length}{" "}
              {communities.length !== 1 ? "communities" : "community"}:
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
        rows={communities.map((listing) => [
          {
            value: listing.community.name,
            sortValue: listing.community.name,
          },
          {
            value: (
              <NewLink
                primitiveType="link"
                href={`/c/${listing.community.identifier}/p/${version.namespace}/${version.name}/`}
                target="_blank"
                rel="noopener noreferrer"
                csVariant="cyber"
              >
                View listing
              </NewLink>
            ),
            sortValue: listing.url,
          },
          {
            value: (
              <div className="submission-result__categories">
                {listing.categories.map((c) => (
                  <NewTag key={c.slug} csSize="small">
                    {c.name}
                  </NewTag>
                ))}
              </div>
            ),
            sortValue: listing.categories.map((c) => c.name).join(", "),
          },
        ])}
        sortDirection={NewTableSort.ASC}
        csModifiers={["alignLastColumnRight"]}
      />
    </Island>
  );
}
