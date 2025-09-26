import type { Meta, StoryObj } from "@storybook/react-vite";
import "@thunderstore/cyberstorm-theme";
import { NewButton } from "@thunderstore/cyberstorm";
import { useState } from "react";
import { NewPagination as Pagination } from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/Pagination",
  component: Pagination,
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    onPageChange: () => {},
    totalCount: 100,
    pageSize: 10,
    siblingCount: 2,
  },
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalCount={100}
          pageSize={10}
          siblingCount={2}
        />
        <NewButton onClick={() => setPage(1)}>Reset</NewButton>
      </div>
    );
  },
};

export const All: Story = {
  args: {
    currentPage: 1,
    onPageChange: () => {},
    totalCount: 100,
    pageSize: 10,
    siblingCount: 2,
  },
  render: () => {
    const f = () => {};
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 16 }}>
          <Pagination
            currentPage={1}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
          <Pagination
            currentPage={2}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
          <Pagination
            currentPage={3}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
          <Pagination
            currentPage={4}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
          <Pagination
            currentPage={5}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
          <Pagination
            currentPage={6}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
          <Pagination
            currentPage={7}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
          <Pagination
            currentPage={8}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
          <Pagination
            currentPage={9}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
          <Pagination
            currentPage={10}
            onPageChange={f}
            totalCount={100}
            pageSize={10}
            siblingCount={2}
          />
        </div>
      </div>
    );
  },
};
