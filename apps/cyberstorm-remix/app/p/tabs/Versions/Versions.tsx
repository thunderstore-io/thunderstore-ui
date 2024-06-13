import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faBoltLightning } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../../../Markdown.module.css";
import { Table, Sort, Alert, Button } from "@thunderstore/cyberstorm";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { ApiError } from "@thunderstore/thunderstore-api";
import { useLoaderData } from "@remix-run/react";
import { versionsSchema } from "@thunderstore/dapper-ts/src/methods/package";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const dapper = await getDapper();
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
        // REMIX TODO: Add sentry
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
      const dapper = await getDapper(true);
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
        // REMIX TODO: Add sentry
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

export default function Versions() {
  const { status, message, versions } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "error") {
    return <div>{message}</div>;
  }

  const tableRows = versions.map((v) => [
    { value: v.version_number, sortValue: v.version_number },
    {
      value: new Date(v.datetime_created).toLocaleDateString(),
      sortValue: v.datetime_created,
    },
    { value: v.download_count.toLocaleString(), sortValue: v.download_count },
    { value: <DownloadLink {...v} />, sortValue: 0 },
    { value: <InstallLink {...v} />, sortValue: 0 },
  ]);

  return (
    <div>
      <ModManagerBanner />
      <div className={styles.title}>Versions</div>
      <Table
        headers={columns}
        rows={tableRows}
        sortDirection={Sort.ASC}
        variant="itemListSmall"
      />
    </div>
  );
}

const columns = [
  { value: "Version", disableSort: false },
  { value: "Upload date", disableSort: false },
  { value: "Downloads", disableSort: false },
  { value: "", disableSort: true },
  { value: "", disableSort: true },
];

const ModManagerBanner = () => (
  <Alert
    content={
      <span>
        Please note that the install buttons only work if you have compatible
        client software installed, such as the{" "}
        <a
          href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager"
          className={styles.alertLink}
        >
          Thunderstore Mod Manager.
        </a>{" "}
        Otherwise use the zip download links instead.
      </span>
    }
    variant={"info"}
    icon={<FontAwesomeIcon icon={faCircleExclamation} />}
  />
);

const DownloadLink = (props: { download_url: string }) => (
  <a href={props.download_url}>
    <Button.Root plain paddingSize="large" colorScheme="transparentAccent">
      <Button.ButtonLabel>Download</Button.ButtonLabel>
    </Button.Root>
  </a>
);

const InstallLink = (props: { install_url: string }) => (
  <a href={props.install_url}>
    <Button.Root plain paddingSize="large" colorScheme="primary">
      <Button.ButtonIcon>
        <FontAwesomeIcon icon={faBoltLightning} />
      </Button.ButtonIcon>
      <Button.ButtonLabel>Install</Button.ButtonLabel>
    </Button.Root>
  </a>
);
