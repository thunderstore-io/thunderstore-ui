import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import { CodeBox, NewIcon, NewTable } from "@thunderstore/cyberstorm";

import "./PackageFormatDocs.css";

export default function PackageFormatDocs() {
  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        Package Format Docs
      </PageHeader>
      <section className="container container--y container--full package-format-docs">
        <p className="package-format-docs__title">
          A valid package is a zip file that contains the following files:
        </p>
        <div className="package-format-docs__table-wrapper">
          <NewTable
            headers={firstTableDataColumns}
            rows={firstTableData}
            disableSort={true}
            gridTemplateColumns="minmax(12.5rem, 0.5fr) minmax(auto, 3fr)"
          />
        </div>
        <p className="package-format-docs__title">
          Additionally, the manifest.json must contain the following fields:
        </p>
        <div className="package-format-docs__table-wrapper">
          <NewTable
            headers={secondTableDataColumns}
            rows={secondTableData}
            disableSort={true}
            gridTemplateColumns="minmax(22%, 0.5fr) minmax(18%, 0.5fr) minmax(30%, 1.25fr) minmax(30%, 1.25fr)"
          />
        </div>
        <p className="package-format-docs__title">
          Example manifest.json content:
        </p>
        <div className="package-format-docs__table-wrapper">
          <CodeBox value={EXAMPLE_MANIFEST_JSON_TEXT} language="json" />
        </div>
      </section>
    </>
  );
}

const EXAMPLE_MANIFEST_JSON_TEXT = `{
  "name": "TestMod",
  "version_number": "1.1.0",
  "website_url": "https://github.com/thunderstore-io",
  "description": "This is a description for a mod. 250 characters max",
  "dependencies": [
      "MythicManiac-TestMod-1.1.0"
  ]
}
`;

const EXAMPLE_DEPENDENCIES = `[
  "MythicManiac-TestMod-1.1.0",
  "SomeAuthor-SomePackage-1.0.0"
]
`;

const EXAMPLE_INSTALLERS = `[
    { "identifier": "foo-installer" }
]
`;

const firstTableDataColumns = [
  { value: "Filename", disableSort: true },
  { value: "Description", disableSort: true },
];

const firstTableData = [
  [
    { value: "icon.png", sortValue: 0 },
    {
      value: "PNG icon for the mod, must be 256x256 resolution.",
      sortValue: 0,
    },
  ],
  [
    { value: "README.md", sortValue: 0 },
    {
      value: "Readme in markdown syntax to be rendered on the package's page.",
      sortValue: 0,
    },
  ],
  [
    { value: "CHANGELOG.md (optional)", sortValue: 0 },
    {
      value:
        "Changelog in markdown syntax to be rendered on the package's page.",
      sortValue: 0,
    },
  ],
  [
    { value: "manifest.json", sortValue: 0 },
    {
      value: "JSON file with the package's metadata.",
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
        <NewIcon
          key="icon-1"
          noWrapper
          csMode="inline"
          rootClasses="package-format-docs--green"
        >
          <FontAwesomeIcon icon={faCheck} />
        </NewIcon>
      ),
      sortValue: 0,
    },
    {
      value: (
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <span>
            Name of the mod, no spaces. Allowed characters:{" "}
            <CodeBox value="a-z A-Z 0-9 _" language="text" inline />
          </span>
          Underscores get replaced with a space for display purposes in some
          views on the website & mod manager.
          <span>
            <b>Important</b>: This will become a part of the package ID and{" "}
            <b>can not be changed</b> without creating a new package.
          </span>
        </div>
      ),
      sortValue: 0,
    },
    {
      value: <CodeBox key="code-1" value='"Some_Mod"' language="json" />,
      sortValue: 0,
    },
  ],
  [
    { value: "description", sortValue: 0 },
    {
      value: (
        <NewIcon
          key="icon-2"
          noWrapper
          csMode="inline"
          rootClasses="package-format-docs--green"
        >
          <FontAwesomeIcon icon={faCheck} />
        </NewIcon>
      ),
      sortValue: 0,
    },
    {
      value:
        "A short description of the mod, shown on the mod list. Max 250 characters.",
      sortValue: 0,
    },
    {
      value: <CodeBox key="code-2" value='"Hello world"' language="json" />,
      sortValue: 0,
    },
  ],
  [
    { value: "version number", sortValue: 0 },
    {
      value: (
        <NewIcon
          key="icon-3"
          noWrapper
          csMode="inline"
          rootClasses="package-format-docs--green"
        >
          <FontAwesomeIcon icon={faCheck} />
        </NewIcon>
      ),
      sortValue: 0,
    },
    {
      value: (
        <span>
          Version number of the mod, following the{" "}
          <a href="https://semver.org/">semantic version format</a>{" "}
          Major.Minor.Patch.
        </span>
      ),
      sortValue: 0,
    },
    {
      value: <CodeBox key="code-3" value='"1.3.2"' language="json" />,
      sortValue: 0,
    },
  ],
  [
    { value: "dependencies", sortValue: 0 },
    {
      value: (
        <NewIcon
          key="icon-4"
          noWrapper
          csMode="inline"
          rootClasses="package-format-docs--green"
        >
          <FontAwesomeIcon icon={faCheck} />
        </NewIcon>
      ),
      sortValue: 0,
    },
    {
      value:
        "List of other packages that are required for this package to function.",
      sortValue: 0,
    },
    {
      value: (
        <div className="package-format-docs__table-wrapper">
          <CodeBox key="code-4" value={EXAMPLE_DEPENDENCIES} language="json" />
        </div>
      ),
      sortValue: 0,
    },
  ],
  [
    { value: "website_url", sortValue: 0 },
    {
      value: (
        <NewIcon
          key="icon-5"
          noWrapper
          csMode="inline"
          rootClasses="package-format-docs--green"
        >
          <FontAwesomeIcon icon={faCheck} />
        </NewIcon>
      ),
      sortValue: 0,
    },
    {
      value:
        "URL of the mod's website (e.g. GitHub repo). Can be an empty string.",
      sortValue: 0,
    },
    {
      value: (
        <CodeBox key="code-5" value='"https://example.com/"' language="json" />
      ),
      sortValue: 0,
    },
  ],
  [
    { value: "installers", sortValue: 0 },
    {
      value: (
        <NewIcon
          key="icon-6"
          noWrapper
          csMode="inline"
          rootClasses="package-format-docs--red"
        >
          <FontAwesomeIcon icon={faXmark} />
        </NewIcon>
      ),
      sortValue: 0,
    },
    {
      value: (
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <span>
            A list of installer declarations. Installer declarations can be used
            to explicitly control how a mod manager should install the package.
            If omitted, legacy install rules are automatically used.
          </span>
          <span>
            As of January 2024, the mod managers don&apos;t yet use this field
            for anything. Documentation will be updated with more details once
            an implementation exists.
          </span>
          <span>
            Documentation for the default (legacy) behavior is currently
            maintained as a wiki page on{" "}
            <a href="https://github.com/ebkr/r2modmanPlus/wiki/Structuring-your-Thunderstore-package">
              the r2modmanPlus wiki
            </a>
          </span>
          <span>
            This field should either contain a list of at least one valid
            installer declarations or be omitted entirely.
          </span>
          <span>This field will become mandatory in the future.</span>
        </div>
      ),
      sortValue: 0,
    },
    {
      value: (
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <div className="package-format-docs__table-wrapper">
            <CodeBox key="code-6" value={EXAMPLE_INSTALLERS} language="json" />
          </div>
          <p>
            The installer referred above does not actually exist, this is for
            illustrative purposes only.
          </p>
        </div>
      ),
      sortValue: 0,
    },
  ],
];
