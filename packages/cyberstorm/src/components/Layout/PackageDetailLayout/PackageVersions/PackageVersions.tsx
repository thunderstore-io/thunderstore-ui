import styles from "./PackageVersions.module.css";
import { Button } from "../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning } from "@fortawesome/pro-solid-svg-icons";
import { DataTable } from "../../../DataTable/DataTable";

export function PackageVersions() {
  return (
    <div>
      <div className={styles.title}>Versions</div>
      <DataTable headers={columns} rows={packageVersionData} />
    </div>
  );
}

PackageVersions.displayName = "PackageVersions";

const columns = ["Version", "Upload date", "Downloads", ""];

const packageVersionData = [
  ["1.1.0", "2022-02-26", 115199, getActions("1.1.0")],
  ["1.2.1", "2022-02-26", 75163, getActions("1.2.1")],
  ["1.2.2", "2022-02-26", 342563, getActions("1.2.2")],
  ["1.2.3", "2022-02-26", 678538, getActions("1.2.3")],
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
