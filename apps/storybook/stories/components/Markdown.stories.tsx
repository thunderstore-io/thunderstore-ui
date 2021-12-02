import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Markdown } from "@thunderstore/components";
import React from "react";

const basicContent = `
# Main header

This is a markdown renderer.

## Subheader

This is first paragraph.

This is second paragraph.
`;

const codeContent = `
${"```"}js
console.log("Hello, World!");
${"```"}

${"```"}python
print('Hello, World!')
${"```"}
`;

const listContent = `
* Some item
* Another item
    * Subitem
    * Subitem
* Yet another item

1. First item
2. Second item
    1. Subitem
    2. Subitem
3. Last item

- [x] Read ticket thoroughly
- [ ] Design implementation
- [ ] Write code and tests
`;

const textContent = `
*This text is italicized*

**This is bold text**

**The bold and _the italicized_**

***All bold and italicized***

~~Nevermind~~

> Quoth the Raven "Nevermore."
`;

const meta = { component: Markdown } as ComponentMeta<typeof Markdown>;

const Template: ComponentStory<typeof Markdown> = (args) => (
  <Markdown>{args.children}</Markdown>
);

const BasicContent = Template.bind({});
BasicContent.args = { children: basicContent };

const CodeContent = Template.bind({});
CodeContent.args = { children: codeContent };

const ListContent = Template.bind({});
ListContent.args = { children: listContent };

const TextContent = Template.bind({});
TextContent.args = { children: textContent };

export { meta as default, BasicContent, CodeContent, ListContent, TextContent };
