import { Title } from "../../../Title/Title";
import { DataTable } from "../../../DataTable/DataTable";
import { formatInteger } from "../../../../utils/utils";
import { Button } from "../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoltLightning } from "@fortawesome/pro-solid-svg-icons";

interface PackageVersion {
  versionNumber: string;
  uploadDate: string;
  downloads: number;
}

export function PackageVersions() {
  const packageVersions: PackageVersion[] = getPackageVersions();

  return (
    <div>
      <Title text="Versions" size="smaller" />
      <DataTable
        headers={["Versions", "Upload date", "Downloads", "Actions"]}
        dataRows={getPackageVersionsMapped(packageVersions)}
      />
    </div>
  );
}

PackageVersions.displayName = "PackageVersions";

function getPackageVersions() {
  return [
    { versionNumber: "1.2.3", uploadDate: "07/04/2022", downloads: 11599 },
    { versionNumber: "1.2.2", uploadDate: "07/04/2022", downloads: 11599 },
    { versionNumber: "1.2.1", uploadDate: "07/04/2022", downloads: 11599 },
    { versionNumber: "1.1.0", uploadDate: "07/04/2022", downloads: 11599 },
  ];
}

function getPackageVersionsMapped(packageVersionList: PackageVersion[]) {
  return packageVersionList.map((packageVersion: PackageVersion) => {
    return [
      packageVersion.versionNumber,
      packageVersion.uploadDate,
      formatInteger(packageVersion.downloads),
      <>
        <Button
          paddingSize="medium"
          fontSize="medium"
          label="Download"
          colorScheme="transparentAccent"
        />
        <Button
          paddingSize="medium"
          fontSize="medium"
          leftIcon={<FontAwesomeIcon icon={faBoltLightning} fixedWidth />}
          label="Install"
          colorScheme="accent"
        />
      </>,
    ];
  });
}
