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
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: TopBar } as ComponentMeta<typeof TopBar>;
const noop = () => null;

const Template: ComponentStory<typeof TopBar> = () => (
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

export { meta as default, TopBar_ as TopBar };
