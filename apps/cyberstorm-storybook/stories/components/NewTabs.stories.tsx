import { StoryFn, Meta } from "@storybook/react";
import { NewTabs } from "@thunderstore/cyberstorm";
import { usePromise } from "@thunderstore/use-promise";
import { Suspense } from "react";
import { faCog, faFlag, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "Cyberstorm/Components/Tabs",
  component: NewTabs,
} as Meta<typeof NewTabs>;

const promiseLoader = () =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), 2000)).then(
    () => "Content loaded and cached."
  );

const AsyncContent = () => {
  const content = usePromise(promiseLoader, []);
  return <p>{content}</p>;
};

const Template: StoryFn<typeof NewTabs> = () => (
  <NewTabs defaultActive="defaultTab">
    <NewTabs.Tab name="firstTab" label="First" icon={faCog}>
      <h1>First tab</h1>
      <p>Not the default, though</p>
    </NewTabs.Tab>

    <NewTabs.Tab name="defaultTab" label="Second" icon={faThumbsUp}>
      <h1>Second tab</h1>
      <p>Shown by default when the page loads</p>
    </NewTabs.Tab>

    <NewTabs.Tab name="disabled" label="Disabled" icon={faFlag} disabled>
      <p>You will never see this</p>
    </NewTabs.Tab>

    <NewTabs.Tab name="async" label="Async">
      <Suspense fallback={<p>Loading...</p>}>
        <AsyncContent />
      </Suspense>
    </NewTabs.Tab>
  </NewTabs>
);

const NewTabsStory = Template.bind({});

export { meta as default, NewTabsStory as NewTabs };
