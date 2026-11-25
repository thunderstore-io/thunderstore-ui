import { describe, expect, test } from "vitest";

import { withMarkdownTableHeaderLabels } from "../withMarkdownTableHeaderLabels";

describe("withMarkdownTableHeaderLabels", () => {
  test("wraps header text in the shared table label", () => {
    const html = withMarkdownTableHeaderLabels(
      '<table><tr><th align="left">Name</th><th>Notes</th></tr><tr><td>Cool</td></tr></table>'
    );

    expect(html).toContain('class="table table--flow"');
    expect(html).toContain(
      '<th class="table__header" align="left"><span class="table__header-text">Name</span></th>'
    );
    expect(html).toContain(
      '<th class="table__header"><span class="table__header-text">Notes</span></th>'
    );
    expect(html).toContain('<td class="table__item">Cool</td>');
  });

  test("does not wrap a header twice", () => {
    const once = withMarkdownTableHeaderLabels("<table><th>Name</th></table>");

    expect(withMarkdownTableHeaderLabels(once)).toBe(once);
  });

  test("still labels a table that follows a code sample", () => {
    const html = withMarkdownTableHeaderLabels(
      "<pre><code><table><th>Skip</th></table></code></pre><table><th>Name</th></table>"
    );

    expect(html).toContain("<th>Skip</th>");
    expect(html).toContain('<span class="table__header-text">Name</span>');
  });

  test("leaves a table inside a code sample alone", () => {
    const html = "<pre><code><table><th>Name</th></table></code></pre>";

    expect(withMarkdownTableHeaderLabels(html)).toBe(html);
  });
});
