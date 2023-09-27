import { StoryFn, Meta } from "@storybook/react";
import { Pagination } from "@thunderstore/cyberstorm";
import React, { useState } from "react";

const meta = {
  title: "Cyberstorm/Components/Pagination",
  component: Pagination,
} as Meta<typeof Pagination>;

const defaultArgs = {
  currentPage: 1,
  totalCount: 500,
  pageSize: 10,
  siblingCount: 1,
};

const Template: StoryFn<typeof Pagination> = (args) => {
  const [value, setValue] = useState(args.currentPage ? args.currentPage : 1);
  args.onPageChange = setValue;
  args.currentPage = value;

  return (
    <div>
      <Pagination {...args} />
      <div style={{ color: "white" }}>Value in state: {value}</div>
    </div>
  );
};

const ReferencePagination = Template.bind({});
ReferencePagination.args = defaultArgs;

const DefaultPagePagination = Template.bind({});
DefaultPagePagination.args = {
  ...defaultArgs,
  currentPage: 13,
};

const DisabledPagination = Template.bind({});
DisabledPagination.args = {
  ...defaultArgs,
  disabled: true,
};

const SiblingsPagination = Template.bind({});
SiblingsPagination.args = {
  ...defaultArgs,
  siblingCount: 2,
};

const EmptyPagination = Template.bind({});
EmptyPagination.args = {
  totalCount: 0,
};

export {
  meta as default,
  ReferencePagination,
  DefaultPagePagination,
  DisabledPagination,
  SiblingsPagination,
  EmptyPagination,
};
