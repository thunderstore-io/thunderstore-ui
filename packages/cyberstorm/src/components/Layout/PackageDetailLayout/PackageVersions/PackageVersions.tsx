import styles from "./PackageVersions.module.css";
import * as Button from "../../../Button/";
import { Table, Sort } from "../../../Table/Table";

export function PackageVersions() {
  return (
    <div>
      <div className={styles.title}>Versions</div>
      <Table
        headers={columns}
        rows={packageVersionData}
        sortDirection={Sort.ASC}
        variant="itemList"
      />
    </div>
  );
}

PackageVersions.displayName = "PackageVersions";

const columns = [
  { value: "Version", disableSort: false },
  { value: "Upload date", disableSort: false },
  { value: "Downloads", disableSort: false },
  { value: "", disableSort: true },
  { value: "", disableSort: true },
];

const a = 115191;
const b = 342563;
const c = 75163;
const d = 678538;

const packageVersionData = [
  [
    { value: "1.1.0", sortValue: "1.1.0" },
    { value: "2022-02-25", sortValue: "2022-02-25" },
    { value: a.toLocaleString(), sortValue: a },
    { value: getDownload("1.1.0"), sortValue: 0 },
    { value: getInstall("1.1.0"), sortValue: 0 },
  ],
  [
    { value: "1.2.1", sortValue: "1.2.1" },
    { value: "2022-02-26", sortValue: "2022-02-26" },
    { value: b.toLocaleString(), sortValue: b },
    { value: getDownload("1.2.1"), sortValue: 0 },
    { value: getInstall("1.2.1"), sortValue: 0 },
  ],
  [
    { value: "1.2.2", sortValue: "1.2.2" },
    { value: "2022-02-27", sortValue: "2022-02-27" },
    { value: c.toLocaleString(), sortValue: c },
    { value: getDownload("1.2.3"), sortValue: 0 },
    { value: getInstall("1.2.3"), sortValue: 0 },
  ],
  [
    { value: "1.2.3", sortValue: "1.2.3" },
    { value: "2022-02-28", sortValue: "2022-02-28" },
    { value: d.toLocaleString(), sortValue: d },
    { value: getDownload("1.2.3"), sortValue: 0 },
    { value: getInstall("1.2.3"), sortValue: 0 },
  ],
];

function getDownload(versionNumber: string) {
  return (
    <Button.Root
      paddingSize="medium"
      variant="transparentAccent"
      onClick={() => {
        console.log("Download " + versionNumber);
      }}
    >
      <Button.ButtonLabel>Download</Button.ButtonLabel>
    </Button.Root>
  );
}

function getInstall(versionNumber: string) {
  return (
    <Button.Root
      paddingSize="large"
      variant="primary"
      onClick={() => {
        console.log("Install " + versionNumber);
      }}
    >
      <Button.ButtonLabel>Install</Button.ButtonLabel>
    </Button.Root>
  );
}
