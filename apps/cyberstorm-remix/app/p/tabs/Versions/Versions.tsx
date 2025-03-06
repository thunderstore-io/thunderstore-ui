import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Versions.css";
import {
  NewTableSort,
  NewButton,
  NewIcon,
  NewTable,
  NewTableRows,
  NewTableLabels,
  Heading,
  NewAlert,
} from "@thunderstore/cyberstorm";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ApiError } from "@thunderstore/thunderstore-api";
import { useLoaderData } from "@remix-run/react";
import { versionsSchema } from "@thunderstore/dapper-ts/src/methods/package";
import { DapperTs } from "@thunderstore/dapper-ts";
import semverGt from "semver/functions/gt";
import semverLt from "semver/functions/lt";
import semverValid from "semver/functions/valid";
import {
  TableCompareColumnMeta,
  TableRow,
} from "@thunderstore/cyberstorm/src/newComponents/Table/Table";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const dapper = new DapperTs(() => {
        return {
          apiHost: process.env.PUBLIC_API_URL,
          sessionId: undefined,
        };
      });
      return {
        status: "ok",
        message: "",
        versions: await dapper.getPackageVersions(
          params.namespaceId,
          params.packageId
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          status: "error",
          message: "Failed to load versions",
          versions: versionsSchema.parse({}),
        };
      } else {
        throw error;
      }
    }
  }
  return {
    status: "error",
    message: "Failed to load versions",
    versions: versionsSchema.parse({}),
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const dapper = window.Dapper;
      return {
        status: "ok",
        message: "",
        versions: await dapper.getPackageVersions(
          params.namespaceId,
          params.packageId
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          status: "error",
          message: "Failed to load versions",
          versions: versionsSchema.parse({}),
        };
      } else {
        throw error;
      }
    }
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

  const tableRows: NewTableRows = versions.map((v) => [
    { value: v.version_number, sortValue: v.version_number },
    {
      value: new Date(v.datetime_created).toUTCString(),
      sortValue: v.datetime_created,
    },
    { value: v.download_count.toLocaleString(), sortValue: v.download_count },
    {
      value: (
        <div className="versions__actions">
          <DownloadLink {...v} />
          <InstallLink {...v} />
        </div>
      ),
      sortValue: 0,
    },
  ]);

  return (
    <div className="versions">
      <ModManagerBanner />
      <div className="versions__table-wrapper">
        <NewTable
          titleRowContent={
            <Heading csSize="3" csLevel="3">
              Versions
            </Heading>
          }
          headers={columns}
          rows={tableRows}
          sortDirection={NewTableSort.ASC}
          csModifiers={["alignLastColumnRight"]}
          customSortCompare={{ 0: rowSemverCompare }}
        />
      </div>
    </div>
  );
}

const columns: NewTableLabels = [
  {
    value: "Version",
    disableSort: false,
    columnClasses: "versions__version",
  },
  {
    value: "Upload date",
    disableSort: false,
    columnClasses: "versions__upload-date",
  },
  {
    value: "Downloads",
    disableSort: false,
    columnClasses: "versions__downloads",
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
    csVariant="secondary"
    csSize="small"
    primitiveType="link"
    href={props.install_url}
  >
    <NewIcon noWrapper csMode="inline">
      <FontAwesomeIcon icon={faBoltLightning} />
    </NewIcon>
    Install
  </NewButton>
);
