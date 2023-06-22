import styles from "./PackageVersions.module.css";
import { Title } from "../../../Title/Title";
import { Button } from "../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning } from "@fortawesome/pro-solid-svg-icons";
import { DataTable } from "../../../DataTable/DataTable";

export function PackageVersions() {
  return (
    <div>
      <Title text="Versions" size="smaller" />
      <DataTable<PackageVersionData>
        ascending={false}
        columns={columns}
        data={getPackageVersionData()}
      />
    </div>
  );
}

PackageVersions.displayName = "PackageVersions";

type PackageVersionData = {
  id: number;
  versionNumber: string;
  uploadData: string;
  downloads: number;
};

const columns = [
  {
    name: "Version",
    style: {
      color: "var(--color-text--default)",
      fontWeight: 700,
    },
    selector: (row) => row.versionNumber,
  },
  {
    name: "Upload date",
    style: {
      color: "var(--color-text--secondary)",
      fontWeight: 500,
    },
    selector: (row) => row.uploadData,
  },
  {
    name: "Downloads",
    style: {
      color: "var(--color-text--secondary)",
      fontWeight: 500,
    },
    selector: (row) => row.downloads,
  },
  {
    name: "",
    width: "274px",
    selector: (row) => row.actions,
  },
];

function getPackageVersionData(): PackageVersionData[] {
  return [
    {
      id: 1,
      versionNumber: "1.1.0",
      uploadData: "2022-02-26",
      downloads: 115199,
      actions: getActions("1.1.0"),
    },
    {
      id: 2,
      versionNumber: "1.2.1",
      uploadData: "2022-02-26",
      downloads: 75163,
      actions: getActions("1.2.1"),
    },
    {
      id: 3,
      versionNumber: "1.2.2",
      uploadData: "2022-02-26",
      downloads: 342563,
      actions: getActions("1.2.2"),
    },
    {
      id: 4,
      versionNumber: "1.2.3",
      uploadData: "2022-02-26",
      downloads: 678538,
      actions: getActions("1.2.3"),
    },
  ];
}

function getActions(versionNumber: string) {
  return (
    <div className={styles.actionButtons}>
      <Button
        paddingSize="large"
        fontSize="medium"
        label="Download"
        colorScheme="transparentAccent"
        onclick={() => {
          console.log("Download " + versionNumber);
        }}
      />
      <Button
        paddingSize="large"
        fontSize="medium"
        leftIcon={<FontAwesomeIcon icon={faBoltLightning} fixedWidth />}
        label="Install"
        colorScheme="primary"
        onclick={() => {
          console.log("Install " + versionNumber);
        }}
      />
    </div>
  );
}
