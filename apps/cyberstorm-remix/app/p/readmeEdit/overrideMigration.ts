import {
  type RequestConfig,
  fetchPackageVersionOverrideRaw,
  fetchPackageVersions,
  postPackageVersionMarkdown,
} from "@thunderstore/thunderstore-api";

export interface PreviousOverride {
  versionNumber: string;
  markdown: string;
}

/**
 * Finds the most recent version, excluding excludeVersion, that carries a
 * README override, and returns its raw markdown. Returns null when no such
 * version exists.
 */
export async function findPreviousReadmeOverride(
  config: () => RequestConfig,
  namespace: string,
  packageName: string,
  excludeVersion?: string
): Promise<PreviousOverride | null> {
  const versions = await fetchPackageVersions({
    config,
    params: { namespace_id: namespace, package_name: packageName },
    data: {},
    queryParams: {},
  });

  const candidates = versions
    .filter((v) => v.is_edited && v.version_number !== excludeVersion)
    .sort(
      (a, b) =>
        new Date(b.datetime_created).getTime() -
        new Date(a.datetime_created).getTime()
    );

  for (const candidate of candidates) {
    // is_edited covers either document, so probe for a readme override
    // specifically.
    const markdown = await fetchPackageVersionOverrideRaw({
      config,
      params: {
        namespace,
        package: packageName,
        version: candidate.version_number,
      },
      data: {},
      queryParams: {},
      document: "readme",
    });
    if (markdown !== null) {
      return { versionNumber: candidate.version_number, markdown };
    }
  }

  return null;
}

/** Copies a README override onto the target version. */
export async function migrateReadmeOverride(
  config: () => RequestConfig,
  namespace: string,
  packageName: string,
  targetVersion: string,
  markdown: string
): Promise<void> {
  await postPackageVersionMarkdown({
    config,
    params: {
      namespace,
      package: packageName,
      version: targetVersion,
    },
    data: { readme: markdown },
    queryParams: {},
  });
}

/** Hands the override text to the browser as a README.md download. */
export function downloadOverrideText(markdown: string): void {
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "README.md";
  anchor.click();
  URL.revokeObjectURL(url);
}
