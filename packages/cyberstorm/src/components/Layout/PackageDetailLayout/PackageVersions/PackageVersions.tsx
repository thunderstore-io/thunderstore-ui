import styles from "./PackageVersions.module.css";
import { Button } from "../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning } from "@fortawesome/pro-solid-svg-icons";
import { DataTable } from "../../../DataTable/DataTable";

export function PackageVersions() {
  return (
    <div>
      <div className={styles.title}>Versions</div>
      <DataTable
        headers={columns}
        rows={packageVersionData}
        sortDirection={1}
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
];

const packageVersionData = [
  [
    { value: "1.1.0", sortValue: "1.1.0" },
    { value: "2022-02-25", sortValue: "2022-02-25" },
    { value: 115191, sortValue: 115191 },
    { value: getActions("1.1.0"), sortValue: 0 },
  ],
  [
    { value: "1.2.1", sortValue: "1.2.1" },
    { value: "2022-02-26", sortValue: "2022-02-26" },
    { value: 75163, sortValue: 75163 },
    { value: getActions("1.2.1"), sortValue: 0 },
  ],
  [
    { value: "1.2.2", sortValue: "1.2.2" },
    { value: "2022-02-27", sortValue: "2022-02-27" },
    { value: 342563, sortValue: 342563 },
    { value: getActions("1.2.2"), sortValue: 0 },
  ],
  [
    { value: "1.2.3", sortValue: "1.2.3" },
    { value: "2022-02-28", sortValue: "2022-02-28" },
    { value: 678538, sortValue: 678538 },
    { value: getActions("1.2.3"), sortValue: 0 },
  ],
];

function getActions(versionNumber: string) {
  return (
    <div className={styles.actionButtons}>
      <Button
        paddingSize="large"
        fontSize="medium"
        label="Download"
        colorScheme="transparentAccent"
        onClick={() => {
          console.log("Download " + versionNumber);
        }}
      />
      <Button
        paddingSize="large"
        fontSize="medium"
        leftIcon={<FontAwesomeIcon icon={faBoltLightning} fixedWidth />}
        label="Install"
        colorScheme="primary"
        onClick={() => {
          console.log("Install " + versionNumber);
        }}
      />
    </div>
  );
}
