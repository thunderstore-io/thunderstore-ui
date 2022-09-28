import { ModPackage, Package } from "../api/models";

export const packagesToModPackages = (pkgs: Package[]): ModPackage[] =>
  pkgs.map((p) => ({
    iconUrl: p.versions[0].icon, // Latest version is listed first.
    id: p.full_name,
    ownerName: p.owner,
    packageName: p.name,
    versionNumbers: p.versions.map((v) => v.version_number),
  }));
