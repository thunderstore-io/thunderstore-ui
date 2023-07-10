import styles from "./PackageFormatDocsLayout.module.css";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { PackageFormatDocsLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { DataTable } from "../../../DataTable/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { ReactElement } from "react";
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
          <DataTable<FirstTableDataItem>
            columns={firstTableDataColumns}
            data={getFirstTableData()}
          />
          <p>
            Additionally, the manifest.json must contain the following fields:
          </p>
          <DataTable<SecondTableDataItem>
            columns={secondTableDataColumns}
            data={getSecondTableData()}
          />
          <p>Example manifest.json content:</p>
          <CodeBox value={EXAMPLE_MANIFEST_JSON_TEXT} />
        </div>
      }
    />
  );
}

PackageFormatDocsLayout.displayName = "PackageFormatDocsLayout";

type FirstTableDataItem = {
  filename: string;
  description: string;
};

const firstTableDataColumns = [
  {
    name: "Filename",
    style: {
      color: "var(--color-text--default)",
    },
    selector: (row: FirstTableDataItem) => row.filename,
  },
  {
    name: "Description",
    style: {
      color: "var(--color-text--default)",
    },
    selector: (row: FirstTableDataItem) => row.description,
  },
];

function getFirstTableData(): FirstTableDataItem[] {
  return [
    {
      filename: "icon.png",
      description: "Name of the mod, no spaces. Allowed characters:-",
    },
    {
      filename: "README.md",
      description:
        "A short description of the mod, shown on the mod list. Max 250 characters.",
    },
    {
      filename: "CHANGELOG.md (optional)",
      description:
        "Version number of the mod, following the semantic version format Major.Minor.Patch.",
    },
    {
      filename: "manifest.json",
      description:
        "List of other packages that are required for this package to function",
    },
  ];
}

type SecondTableDataItem = {
  key: string;
  required: ReactElement;
  requiredRaw: boolean;
  description: string;
  exampleValue: ReactElement;
  exampleValueRaw: string;
};

const secondTableDataColumns = [
  {
    name: "Key",
    style: {
      color: "var(--color-text--default)",
    },
    selector: (row: SecondTableDataItem) => row.key,
  },
  {
    name: "Required",
    style: {
      color: "var(--color-text--default)",
    },
    cell: (row: SecondTableDataItem) => row.required,
  },
  {
    name: "Description",
    style: {
      color: "var(--color-text--default)",
    },
    selector: (row: SecondTableDataItem) => row.description,
  },
  {
    name: "Example value",
    style: {
      color: "var(--color-text--default)",
    },
    cell: (row: SecondTableDataItem) => row.exampleValue,
  },
];

function getSecondTableData(): SecondTableDataItem[] {
  return [
    {
      key: "name",
      required: <FontAwesomeIcon key="icon-1" icon={faCheck} fixedWidth />,
      requiredRaw: true,
      description: "Name of the mod, no spaces. Allowed characters:-",
      exampleValue: <CodeBox value='"Some_Mod"' />,
      exampleValueRaw: "Some_Mod",
    },
    {
      key: "description",
      required: <FontAwesomeIcon key="icon-2" icon={faCheck} fixedWidth />,
      requiredRaw: true,
      description:
        "A short description of the mod, shown on the mod list. Max 250 characters.",
      exampleValue: <CodeBox value='"Hello world"' />,
      exampleValueRaw: "Hello world",
    },
    {
      key: "version number",
      required: <FontAwesomeIcon key="icon-3" icon={faCheck} fixedWidth />,
      requiredRaw: true,
      description:
        "Version number of the mod, following the semantic version format Major.Minor.Patch.",
      exampleValue: <CodeBox value='"1.3.2"' />,
      exampleValueRaw: "1.3.2",
    },
    {
      key: "dependencies",
      required: <FontAwesomeIcon key="icon-4" icon={faCheck} fixedWidth />,
      requiredRaw: true,
      description:
        "List of other packages that are required for this package to function",
      exampleValue: <CodeBox value={EXAMPLE_DEPENDENCIES} />,
      exampleValueRaw: EXAMPLE_DEPENDENCIES,
    },
    {
      key: "website_url",
      required: <FontAwesomeIcon key="icon-5" icon={faCheck} fixedWidth />,
      requiredRaw: true,
      description:
        "URL of the mod's website (e.g. GitHub repo). Can be an empty string.",
      exampleValue: <CodeBox value='"https://example.com/"' />,
      exampleValueRaw: "https://example.com/",
    },
  ];
}
