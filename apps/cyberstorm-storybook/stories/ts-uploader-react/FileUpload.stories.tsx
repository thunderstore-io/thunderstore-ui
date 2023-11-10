import { StoryFn, Meta } from "@storybook/react";

const StubUploader = () => {
  return <span>Hello</span>;
};

const meta = {
  title: "FileUploader",
  component: StubUploader,
} as Meta<typeof StubUploader>;

const FileUploader: StoryFn<typeof StubUploader> = (args) => (
  <div style={{ width: "500px" }}>
    <StubUploader />
  </div>
);

export { meta as default, FileUploader };
