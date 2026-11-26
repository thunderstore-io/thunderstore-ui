import { Table as NewTable } from "@cs/newComponents/Table/Table";
import {
  type TableLabels as NewTableLabels,
  type TableRow as NewTableRow,
  TableModifiersList,
  TableSizesList,
  TableVariantsList,
} from "@cs/newComponents/Table/Table.types";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBox } from "@thunderstore/cyberstorm";

function requiredMark(required: boolean) {
  return (
    <FontAwesomeIcon
      icon={required ? faCheck : faXmark}
      title={required ? "Required" : "Optional"}
      style={{
        color: required
          ? "var(--color-cyber-green-7)"
          : "var(--color-accent-red-7)",
      }}
    />
  );
}

function example(value: string) {
  return <CodeBox value={value} language="json" />;
}

const fileHeaders: NewTableLabels = [
  { value: "Filename", disableSort: true, maxWidth: "16rem" },
  { value: "Description", disableSort: true },
];

const fileRows: NewTableRow[] = [
  [
    { value: "icon.png", sortValue: "icon.png" },
    {
      value: "PNG Icon for the mod, must be 256x256 resolution.",
      sortValue: "icon",
    },
  ],
  [
    { value: "README.md", sortValue: "README.md" },
    {
      value: "Readme in markdown syntax to be rendered on the package's page.",
      sortValue: "readme",
    },
  ],
  [
    { value: "CHANGELOG.md (optional)", sortValue: "CHANGELOG.md" },
    {
      value:
        "Changelog in markdown syntax to be rendered on the package's page.",
      sortValue: "changelog",
    },
  ],
  [
    { value: "manifest.json", sortValue: "manifest.json" },
    {
      value: "JSON file with the package's metadata.",
      sortValue: "manifest",
    },
  ],
];

const fieldHeaders: NewTableLabels = [
  { value: "Key", disableSort: true, maxWidth: "12rem" },
  { value: "Required", disableSort: true, maxWidth: "8rem" },
  { value: "Description", disableSort: true },
  { value: "Example value", disableSort: true },
];

const fieldRows: NewTableRow[] = [
  [
    { value: "name", sortValue: "name" },
    { value: requiredMark(true), sortValue: 1 },
    {
      value:
        "Name of the mod, no spaces. Allowed characters: a-z A-Z 0-9 _. Underscores get replaced with a space for display purposes in some views on the website & mod manager. Important: This will become a part of the package ID and can not be changed without creating a new package.",
      sortValue: "name",
    },
    { value: example('"Some_Mod"'), sortValue: "Some_Mod" },
  ],
  [
    { value: "description", sortValue: "description" },
    { value: requiredMark(true), sortValue: 1 },
    {
      value:
        "A short description of the mod, shown on the mod list. Max 250 characters.",
      sortValue: "description",
    },
    { value: example('"Hello world"'), sortValue: "Hello world" },
  ],
  [
    { value: "version_number", sortValue: "version_number" },
    { value: requiredMark(true), sortValue: 1 },
    {
      value:
        "Version number of the mod, following the semantic version format Major.Minor.Patch.",
      sortValue: "version",
    },
    { value: example('"1.3.2"'), sortValue: "1.3.2" },
  ],
  [
    { value: "dependencies", sortValue: "dependencies" },
    { value: requiredMark(true), sortValue: 1 },
    {
      value:
        "List of other packages that are required for this package to function.",
      sortValue: "dependencies",
    },
    {
      value: example(
        '[\n  "MythicManiac-TestMod-1.1.0",\n  "SomeAuthor-SomePackage-1.0.0"\n]'
      ),
      sortValue: "dependencies",
    },
  ],
  [
    { value: "website_url", sortValue: "website_url" },
    { value: requiredMark(true), sortValue: 1 },
    {
      value:
        "URL of the mod's website (e.g. GitHub repo). Can be an empty string.",
      sortValue: "website",
    },
    {
      value: example('"https://example.com/"'),
      sortValue: "https://example.com/",
    },
  ],
  [
    { value: "installers", sortValue: "installers" },
    { value: requiredMark(false), sortValue: 0 },
    {
      value:
        "A list of installer declarations. Installer declarations can be used to explicitly control how a mod manager should install the package. If omitted, legacy install rules are automatically used. This field will become mandatory in the future.",
      sortValue: "installers",
    },
    {
      value: example('[ { "identifier": "foo-installer" } ]'),
      sortValue: "installers",
    },
  ],
];

const meta = {
  title: "Cyberstorm/Table",
  component: NewTable,
  tags: ["autodocs"],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  argTypes: {
    csVariant: { control: "select", options: TableVariantsList },
    csSize: { control: "select", options: TableSizesList },
    csModifiers: { control: "multi-select", options: TableModifiersList },
  },
  args: {
    headers: [
      { value: "Name", disableSort: false },
      { value: "Age", disableSort: true },
    ],
    rows: [
      [
        { value: "Bob", sortValue: "Bob" },
        { value: 25, sortValue: 25 },
      ],
      [
        { value: "Alice", sortValue: "Alice" },
        { value: 30, sortValue: 30 },
      ],
      [
        { value: "Charlie", sortValue: "Charlie" },
        { value: 35, sortValue: 35 },
      ],
    ],
    sortByHeader: 0,
  },
} satisfies Meta<typeof NewTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {TableVariantsList.map((variant) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={variant}
        >
          {variant}
          <NewTable key={variant} {...args} csVariant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {TableSizesList.map((size) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={size}
        >
          {size}
          <NewTable key={size} {...args} csSize={size} />
        </div>
      ))}
    </div>
  ),
};

export const Modifiers: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {TableModifiersList.map((modifier) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={modifier}
        >
          {modifier}
          <NewTable key={modifier} {...args} csModifiers={[modifier]} />
        </div>
      ))}
    </div>
  ),
};

export const PackageFormat: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        maxWidth: 960,
      }}
    >
      <NewTable headers={fileHeaders} rows={fileRows} disableSort />
      <NewTable headers={fieldHeaders} rows={fieldRows} disableSort />
    </div>
  ),
};
