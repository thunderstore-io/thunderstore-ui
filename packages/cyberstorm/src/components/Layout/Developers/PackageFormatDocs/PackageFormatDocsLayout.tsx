import styles from "./PackageFormatDocsLayout.module.css";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { PackageFormatDocsLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { DataTable } from "../../../DataTable/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { TextInput } from "../../../TextInput/TextInput";

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
            headers={["Filename", "Description"]}
            dataRows={firstTableDataRows}
          />
          <p>
            Additionally, the manifest.json must contain the following fields:
          </p>
          <DataTable
            headers={["Key", "Required", "Description", "Example value"]}
            dataRows={secondTableDataRows}
          />
          <p>Example manifest.json content:</p>
          <TextInput
            value='{
            "name": "Textarea",
            "version_number": "1.1.0",
            "number": 0,
            "boolean": true,
            "website_url": "https://github.com/thunderstore-io",
            "description": "This is a description for a mod. 250 characters max",
            "dependencies": [
              "Mythic-TestMod-1.1.0"
            ]
          }'
          />
        </div>
      }
    />
  );
}

PackageFormatDocsLayout.displayName = "PackageFormatDocsLayout";

const firstTableDataRows = [
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

const secondTableDataRows = [
  [
    "name",
    <FontAwesomeIcon key="icon-1" icon={faCheck} fixedWidth />,
    "Name of the mod, no spaces. Allowed characters:-",
    <TextInput key="textInput-1" value='"Some_Mod"' />,
  ],
  [
    "description",
    <FontAwesomeIcon key="icon-2" icon={faCheck} fixedWidth />,
    "A short description of the mod, shown on the mod list. Max 250 characters.",
    <TextInput key="textInput-2" value='"Hello world"' />,
  ],
  [
    "version number",
    <FontAwesomeIcon key="icon-3" icon={faCheck} fixedWidth />,
    "Version number of the mod, following the semantic version format Major.Minor.Patch.",
    <TextInput key="textInput-3" value='"1.3.2"' />,
  ],
  [
    "dependencies",
    <FontAwesomeIcon key="icon-4" icon={faCheck} fixedWidth />,
    "List of other packages that are required for this package to function",
    <TextInput
      key="textInput-4"
      value='["MythicManiac-TestMod-1.1.0", "SomeAuthor-SomePackage-1.0.0"]'
    />,
  ],
  [
    "website_url",
    <FontAwesomeIcon key="icon-5" icon={faCheck} fixedWidth />,
    "URL of the mod's website (e.g. GitHub repo). Can be an empty string.",
    <TextInput key="textInput-5" value='"https://example.com/"' />,
  ],
];
