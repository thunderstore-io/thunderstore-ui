import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Versions.css";
import {
  NewTableSort,
  NewButton,
  NewIcon,
  NewTable,
  type NewTableLabels,
  Heading,
  NewAlert,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import { Await, type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { versionsSchema } from "@thunderstore/dapper-ts/src/methods/package";
import { DapperTs } from "@thunderstore/dapper-ts";
import semverGt from "semver/functions/gt";
import semverLt from "semver/functions/lt";
import semverValid from "semver/functions/valid";
import {
  type TableCompareColumnMeta,
  type TableRow,
} from "@thunderstore/cyberstorm/src/newComponents/Table/Table";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    return {
      versions: dapper.getPackageVersions(params.namespaceId, params.packageId),
    };
  }
  return {
    status: "error",
    message: "Failed to load versions",
    versions: versionsSchema.parse({}),
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    return {
      versions: dapper.getPackageVersions(params.namespaceId, params.packageId),
    };
  }
  return {
    status: "error",
    message: "Failed to load versions",
    versions: versionsSchema.parse({}),
  };
}

type ConfirmedSemverStringType = string;

export const isSemver = (s: string): s is ConfirmedSemverStringType => {
  if (semverValid(s)) {
    return true;
  } else {
    return false;
  }
};

function rowSemverCompare(
  a: TableRow,
  b: TableRow,
  columnMeta: TableCompareColumnMeta
) {
  if (isSemver(String(a[0].sortValue)) && isSemver(String(b[0].sortValue))) {
    if (semverLt(String(a[0].sortValue), String(b[0].sortValue))) {
      return columnMeta.direction;
    }
    if (semverGt(String(a[0].sortValue), String(b[0].sortValue))) {
      return -columnMeta.direction;
    }
  }
  return 0;
}

export default function Versions() {
  const { status, message, versions } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "error") {
    return <div>{message}</div>;
  }

  return (
    <Suspense fallback={<SkeletonBox className="package-versions__skeleton" />}>
      <Await resolve={versions}>
        {(resolvedValue) => (
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
                rows={resolvedValue.map((v) => [
                  { value: v.version_number, sortValue: v.version_number },
                  {
                    value: new Date(v.datetime_created).toUTCString(),
                    sortValue: v.datetime_created,
                  },
                  {
                    value: v.download_count.toLocaleString(),
                    sortValue: v.download_count,
                  },
                  {
                    value: (
                      <div className="package-versions__actions">
                        <DownloadLink {...v} />
                        <InstallLink {...v} />
                      </div>
                    ),
                    sortValue: 0,
                  },
                ])}
                sortDirection={NewTableSort.ASC}
                csModifiers={["alignLastColumnRight"]}
                customSortCompare={{ 0: rowSemverCompare }}
              />
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

const columns: NewTableLabels = [
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

const ModManagerBanner = () => (
  <NewAlert csVariant="info">
    Please note that the install buttons only work if you have compatible client
    software installed, such as the{" "}
    <a href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager">
      Thunderstore Mod Manager.
    </a>{" "}
    Otherwise use the zip download links instead.
  </NewAlert>
);

const DownloadLink = (props: { download_url: string }) => (
  <NewButton
    csVariant="secondary"
    csModifiers={["ghost"]}
    csSize="small"
    primitiveType="link"
    href={props.download_url}
  >
    <NewIcon noWrapper csMode="inline">
      <FontAwesomeIcon icon={faDownload} />
    </NewIcon>
    Download
  </NewButton>
);

const InstallLink = (props: { install_url: string }) => (
  <NewButton
    csVariant="accent"
    csSize="small"
    primitiveType="link"
    href={props.install_url}
  >
    <NewIcon csMode="inline">
      <ThunderstoreLogo />
    </NewIcon>
    Install
  </NewButton>
);
