import "@cs/newComponents/Table/Table.css";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../../../../cyberstorm-remix/app/commonComponents/Markdown/Markdown.css";
import { withMarkdownTableHeaderLabels } from "../../../../cyberstorm-remix/app/commonComponents/Markdown/withMarkdownTableHeaderLabels";
import "../../../../cyberstorm-remix/app/styles/markdown.css";
import packageIcon from "../assets/goblin.png";
import { SideBySide, compositionParameters } from "./compare";

const elements = `
<h1>Heading 1</h1>
<p>A paragraph with <b>bold</b>, <i>italic</i>, <strong>strong</strong>, <em>emphasis</em>, and <a href="https://thunderstore.io">a link</a>.</p>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th align="center">Notes</th>
      <th align="right">Downloads</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cool mod</td>
      <td align="center">Short note</td>
      <td align="right">12 345</td>
    </tr>
    <tr>
      <td>Plain mod</td>
      <td align="center">A longer note that wraps so the row grows past the minimum height. The text should continue and be visible on the next line.</td>
      <td align="right">80</td>
    </tr>
  </tbody>
</table>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
<hr>
<ul>
  <li>First item
    <ul>
      <li>Nested item</li>
    </ul>
  </li>
  <li>Second item</li>
</ul>
<ol>
  <li>First step</li>
  <li>Second step</li>
</ol>
<blockquote>
  <p>A quoted note.</p>
  <blockquote><p>A nested quote.</p></blockquote>
</blockquote>
<details open>
  <summary>Install notes</summary>
  <p>Drop the files in the plugins folder.</p>
</details>
<p><img alt="Package icon" src="${packageIcon}"></p>
<p>Inline <code>code</code> and a block:</p>
<pre><code>npm install</code></pre>
`;

const renderedElements = withMarkdownTableHeaderLabels(elements);

/**
 * Rendered package markdown. The table uses the Table skin. The interactive
 * Table component is featured in Compositions/Listings.
 */
const meta = {
  title: "Compositions/Markdown",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Package markdown as rendered on a readme, changelog, or wiki page: headings, a table, lists, quotes, a collapsible, an image, and code. The table uses the same cell and header styles as the Table component, which is featured in Compositions/Listings.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  render: () => (
    <SideBySide
      render={() => (
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: renderedElements }}
        />
      )}
    />
  ),
};
