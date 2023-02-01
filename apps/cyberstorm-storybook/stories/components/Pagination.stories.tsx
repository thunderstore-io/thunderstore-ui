import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Pagination } from "@thunderstore/cyberstorm";
import React, { useState } from "react";

const meta = {
  title: "Cyberstorm/Components/Pagination",
  component: Pagination,
} as ComponentMeta<typeof Pagination>;

const defaultArgs = {
  currentPage: 1,
  totalCount: 500,
  pageSize: 10,
  siblingCount: 1,
};

const Template: ComponentStory<typeof Pagination> = (args) => {
  const [value, setValue] = useState(args.currentPage ?? 1);
  args.onPageChange = setValue;
  args.currentPage = value;

  return (
    <div style={{ display: "flex" }}>
      <div style={{ color: "white" }}>Value in state: {value}</div>
      <Pagination {...args} />
    </div>
  );
};

const ReferencePagination = Template.bind({});
ReferencePagination.args = defaultArgs;

const DefaultPagePagination = Template.bind({});
DefaultPagePagination.args = {
  ...defaultArgs,
  defaultPage: 3,
};

const DisabledPagination = Template.bind({});
DisabledPagination.args = {
  ...defaultArgs,
  disabled: true,
};

export {
  meta as default,
  ReferencePagination,
  DefaultPagePagination,
  DisabledPagination,
};
