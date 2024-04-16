import styles from "./PackageFormatDocsLayout.module.css";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CyberstormLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { Table } from "../../../Table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { CodeBox } from "../../../CodeBox/CodeBox";
import { Icon } from "../../../Icon/Icon";

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
          <CyberstormLink linkId="PackageFormatDocs">
            Package Format Docs
          </CyberstormLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Package Format Docs" />}
      mainContent={
        <div className={styles.root}>
          <p>
            A valid package is a zip file that contains the following files:
          </p>
          <Table
            headers={firstTableDataColumns}
            rows={firstTableData}
            disableSort={true}
            gridTemplateColumns="minmax(12.5rem, 0.5fr) minmax(auto, 3fr)"
          />
          <p>
            Additionally, the manifest.json must contain the following fields:
          </p>
          <Table
            headers={secondTableDataColumns}
            rows={secondTableData}
            disableSort={true}
            gridTemplateColumns="minmax(22%, 0.5fr) minmax(18%, 0.5fr) minmax(30%, 1.25fr) minmax(30%, 1.25fr)"
          />
          <p>Example manifest.json content:</p>
          <CodeBox value={EXAMPLE_MANIFEST_JSON_TEXT} />
        </div>
      }
    />
  );
}

PackageFormatDocsLayout.displayName = "PackageFormatDocsLayout";

const firstTableDataColumns = [
  { value: "Filename", disableSort: true },
  { value: "Description", disableSort: true },
];

const firstTableData = [
  [
    { value: "icon.png", sortValue: 0 },
    { value: "Name of the mod, no spaces. Allowed characters:-", sortValue: 0 },
  ],
  [
    { value: "README.md", sortValue: 0 },
    {
      value:
        "A short description of the mod, shown on the mod list. Max 250 characters.",
      sortValue: 0,
    },
  ],
  [
    { value: "CHANGELOG.md", sortValue: 0 },
    {
      value:
        "Version number of the mod, following the semantic version format Major.Minor.Patch.",
      sortValue: 0,
    },
  ],
  [
    { value: "manifest.json", sortValue: 0 },
    {
      value:
        "List of other packages that are required for this package to function",
      sortValue: 0,
    },
  ],
];

const secondTableDataColumns = [
  { value: "Key", disableSort: true },
  { value: "Required", disableSort: true },
  { value: "Description", disableSort: true },
  { value: "Example value", disableSort: true },
];

const secondTableData = [
  [
    { value: "name", sortValue: 0 },
    {
      value: (
        <Icon key="icon-1" inline wrapperClasses={styles.greenWrap}>
          <FontAwesomeIcon icon={faCheck} />
        </Icon>
      ),
      sortValue: 0,
    },
    { value: "Name of the mod, no spaces. Allowed characters:-", sortValue: 0 },
    { value: <CodeBox key="code-1" value='"Some_Mod"' />, sortValue: 0 },
  ],
  [
    { value: "description", sortValue: 0 },
    {
      value: (
        <Icon key="icon-2" inline wrapperClasses={styles.greenWrap}>
          <FontAwesomeIcon icon={faCheck} />
        </Icon>
      ),
      sortValue: 0,
    },
    {
      value:
        "A short description of the mod, shown on the mod list. Max 250 characters.",
      sortValue: 0,
    },
    { value: <CodeBox key="code-2" value='"Hello world"' />, sortValue: 0 },
  ],
  [
    { value: "version number", sortValue: 0 },
    {
      value: (
        <Icon key="icon-3" inline wrapperClasses={styles.greenWrap}>
          <FontAwesomeIcon icon={faCheck} />
        </Icon>
      ),
      sortValue: 0,
    },
    {
      value:
        "Version number of the mod, following the semantic version format Major.Minor.Patch.",
      sortValue: 0,
    },
    { value: <CodeBox key="code-3" value='"1.3.2"' />, sortValue: 0 },
  ],
  [
    { value: "dependencies", sortValue: 0 },
    {
      value: (
        <Icon key="icon-4" inline wrapperClasses={styles.greenWrap}>
          <FontAwesomeIcon icon={faCheck} />
        </Icon>
      ),
      sortValue: 0,
    },
    {
      value:
        "List of other packages that are required for this package to function",
      sortValue: 0,
    },
    {
      value: <CodeBox key="code-4" value={EXAMPLE_DEPENDENCIES} />,
      sortValue: 0,
    },
  ],
  [
    { value: "website_url", sortValue: 0 },
    {
      value: (
        <Icon key="icon-5" inline wrapperClasses={styles.greenWrap}>
          <FontAwesomeIcon icon={faCheck} />
        </Icon>
      ),
      sortValue: 0,
    },
    {
      value:
        "URL of the mod's website (e.g. GitHub repo). Can be an empty string.",
      sortValue: 0,
    },
    {
      value: <CodeBox key="code-5" value='"https://example.com/"' />,
      sortValue: 0,
    },
  ],
];
