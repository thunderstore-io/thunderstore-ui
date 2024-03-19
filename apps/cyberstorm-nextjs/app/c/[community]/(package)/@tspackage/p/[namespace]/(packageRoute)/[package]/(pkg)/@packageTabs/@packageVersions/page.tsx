"use client";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faBoltLightning } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "../Markdown.module.css";
import { Table, Sort, Alert, Button } from "@thunderstore/cyberstorm";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const versions = usePromise(dapper.getPackageVersions, [
    params.namespace,
    params.package,
  ]);

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
