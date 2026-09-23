import {
  type RequestConfig,
  fetchPackageVersionReadmeOverrideRaw,
  fetchPackageVersions,
} from "@thunderstore/thunderstore-api";

export interface PreviousOverride {
  versionNumber: string;
  markdown: string;
}

// The browser caches the versions list for a minute, which can miss a version
// that was just uploaded.
function fetchVersionsUncached(
  config: () => RequestConfig,
  namespace: string,
  packageName: string
) {
  return fetchPackageVersions(
    {
      config,
      params: { namespace_id: namespace, package_name: packageName },
      data: {},
      queryParams: {},
    },
    "no-store"
  );
}

/** Newest version other than excludeVersion with a README override. */
export async function findPreviousReadmeOverride(
  config: () => RequestConfig,
  namespace: string,
  packageName: string,
  excludeVersion?: string
): Promise<PreviousOverride | null> {
  const versions = await fetchVersionsUncached(config, namespace, packageName);

  const candidates = versions
    .filter((v) => v.is_readme_edited && v.version_number !== excludeVersion)
    .sort(
      (a, b) =>
        new Date(b.datetime_created).getTime() -
        new Date(a.datetime_created).getTime()
    );

  for (const candidate of candidates) {
    const markdown = await fetchPackageVersionReadmeOverrideRaw({
      config,
      params: {
        namespace,
        package: packageName,
        version: candidate.version_number,
      },
      data: {},
      queryParams: {},
    });
    if (markdown !== null) {
      return { versionNumber: candidate.version_number, markdown };
    }
  }

  return null;
}

export function downloadOverrideText(markdown: string): void {
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "README.md";
  anchor.click();
  URL.revokeObjectURL(url);
}
