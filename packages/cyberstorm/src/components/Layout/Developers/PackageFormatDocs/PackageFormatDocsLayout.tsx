import styles from "./PackageFormatDocsLayout.module.css";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { PackageFormatDocsLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { DataTable } from "../../../DataTable/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { CodeBox } from "../../../CodeBox/CodeBox";

const EXAMPLE_MANIFEST_JSON_TEXT = `{
  "name": "Textarea",
  "version_number": "1.1.0",
  "number": 0,
  "boolean": true,
  "website_url": "https://github.com/thunderstore-io",
  "description": "This is a description for a mod. 250 characters max",
  "dependencies": [
      "Mythic-TestMod-1.1.0"
  ]
}
`;

const EXAMPLE_DEPENDENCIES = `[
  "MythicManiac-TestMod-1.1.0",
  "SomeAuthor-SomePackage-1.0.0"
]
`;

/**
 * Cyberstorm PackageFormatDocs Layout
 */
export function PackageFormatDocsLayout() {
  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <PackageFormatDocsLink>Package Format Docs</PackageFormatDocsLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Package Format Docs" />}
      mainContent={
        <div className={styles.root}>
          <DataTable
            headers={firstTableDataColumns}
            rows={firstDataTableData}
          />
          <p>
            Additionally, the manifest.json must contain the following fields:
          </p>
          <DataTable
            headers={secondTableDataColumns}
            rows={secondDataTableData}
          />
          <p>Example manifest.json content:</p>
          <CodeBox value={EXAMPLE_MANIFEST_JSON_TEXT} />
        </div>
      }
    />
  );
}

PackageFormatDocsLayout.displayName = "PackageFormatDocsLayout";

const firstTableDataColumns = ["Filename", "Description"];

const firstDataTableData = [
  ["icon.png", "Name of the mod, no spaces. Allowed characters:-"],
  [
    "README.md",
    "A short description of the mod, shown on the mod list. Max 250 characters.",
  ],
  [
    "CHANGELOG.md (optional)",
    "Version number of the mod, following the semantic version format Major.Minor.Patch.",
  ],
  [
    "manifest.json",
    "List of other packages that are required for this package to function",
  ],
];

const secondTableDataColumns = [
  "Key",
  "Required",
  "Description",
  "Example value",
];

const secondDataTableData = [
  [
    "name",
    <span key="icon-1" className={styles.greenWrap}>
      <FontAwesomeIcon icon={faCheck} fixedWidth />
    </span>,
    "Name of the mod, no spaces. Allowed characters:-",
    <CodeBox key="code-1" value='"Some_Mod"' />,
  ],
  [
    "description",
    <span key="icon-2" className={styles.greenWrap}>
      <FontAwesomeIcon icon={faCheck} fixedWidth />
    </span>,
    "A short description of the mod, shown on the mod list. Max 250 characters.",
    <CodeBox key="code-2" value='"Hello world"' />,
  ],
  [
    "version number",
    <span key="icon-3" className={styles.greenWrap}>
      <FontAwesomeIcon icon={faCheck} fixedWidth />
    </span>,
    "Version number of the mod, following the semantic version format Major.Minor.Patch.",
    <CodeBox key="code-3" value='"1.3.2"' />,
  ],
  [
    "dependencies",
    <span key="icon-4" className={styles.greenWrap}>
      <FontAwesomeIcon icon={faCheck} fixedWidth />
    </span>,
    "List of other packages that are required for this package to function",
    <CodeBox key="code-4" value={EXAMPLE_DEPENDENCIES} />,
  ],
  [
    "website_url",
    <span key="icon-5" className={styles.greenWrap}>
      <FontAwesomeIcon icon={faCheck} fixedWidth />
    </span>,
    "URL of the mod's website (e.g. GitHub repo). Can be an empty string.",
    <CodeBox key="code-5" value='"https://example.com/"' />,
  ],
];
