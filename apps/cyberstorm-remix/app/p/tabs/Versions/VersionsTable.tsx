import { rowSemverCompare } from "cyberstorm/utils/semverCompare";

import {
  Heading,
  LocalDateTime,
  NewLink,
  NewTable,
  type NewTableLabels,
  NewTableSort,
} from "@thunderstore/cyberstorm";
import type { PackageVersion } from "@thunderstore/dapper/types";

import "./Versions.css";
import {
  DownloadLink,
  EditedTag,
  InstallLink,
  ModManagerBanner,
} from "./common";

export function VersionsTable({
  versions,
  communityId,
  namespaceId,
  packageId,
}: {
  versions: PackageVersion[];
  communityId?: string;
  namespaceId?: string;
  packageId?: string;
}) {
  return (
    <div className="package-versions">
      <ModManagerBanner />
      <div className="package-versions__table-wrapper">
        <NewTable
          titleRowContent={
            <Heading csSize="3" csLevel="3">
              Versions
            </Heading>
          }
          headers={columns}
          rows={versions.map((version) => [
            {
              value: (
                <>
                  <NewLink
                    primitiveType="cyberstormLink"
                    linkId="PackageVersion"
                    package={packageId}
                    community={communityId}
                    namespace={namespaceId}
                    version={version.version_number}
                    csVariant="primary"
                  >
                    {version.version_number}
                  </NewLink>
                  {version.is_edited ? <EditedTag /> : null}
                </>
              ),
              sortValue: version.version_number,
            },
            {
              value: <LocalDateTime time={version.datetime_created} />,
              sortValue: version.datetime_created,
            },
            {
              value: version.download_count.toLocaleString(),
              sortValue: version.download_count,
            },
            {
              value: (
                <div className="package-versions__actions">
                  <DownloadLink {...version} />
                  <InstallLink {...version} />
                </div>
              ),
              sortValue: 0,
            },
          ])}
          sortDirection={NewTableSort.DESC}
          csModifiers={["alignLastColumnRight"]}
          customSortCompare={{ 0: rowSemverCompare }}
        />
      </div>
    </div>
  );
}

export const columns: NewTableLabels = [
  {
    value: "Version",
    disableSort: false,
    columnClasses: "package-versions__version",
  },
  {
    value: "Upload date",
    disableSort: false,
    columnClasses: "package-versions__upload-date",
  },
  {
    value: "Downloads",
    disableSort: false,
    columnClasses: "package-versions__downloads",
  },
  { value: "Actions", disableSort: true },
];
