import {
  AnonymousLink,
  DownloadIcon,
  FilterIcon,
  InstallIcon,
  LikeIcon,
  TopBar,
  TopBarMenu,
  TopBarMenuButton,
} from "@thunderstore/components";
import { StoryFn, Meta } from "@storybook/react";
import React from "react";

export default { component: TopBar } as Meta;
const noop = () => null;

const Template: StoryFn<typeof TopBar> = () => (
  <TopBar>
    <AnonymousLink url="/" variant="ts.topBar">
      Something
    </AnonymousLink>
    <AnonymousLink url="/" variant="ts.topBar">
      Another
    </AnonymousLink>

    <TopBarMenu label="Dropdown with icons">
      <TopBarMenuButton icon={DownloadIcon} label="Download" onClick={noop} />
      <TopBarMenuButton icon={FilterIcon} label="Filter" onClick={noop} />
      <TopBarMenuButton icon={InstallIcon} label="Install" onClick={noop} />
      <TopBarMenuButton icon={LikeIcon} label="Like" onClick={noop} />
    </TopBarMenu>
  </TopBar>
);

const TopBar_ = Template.bind({});

export { TopBar_ as TopBar };
