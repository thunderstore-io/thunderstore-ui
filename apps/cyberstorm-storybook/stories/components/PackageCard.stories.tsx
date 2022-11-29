import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PackageCard } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/PackageCard",
  component: PackageCard,
} as ComponentMeta<typeof PackageCard>;

const defaultArgs = {
  packageCardStyle: "default",
};
const style = {
  backgroundColor: "",
  padding: "3rem",
  flexWrap: "wrap",
  display: "grid",
  flexDirection: "row",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(15.5rem, 1fr))",
};

const Template: ComponentStory<typeof PackageCard> = (args) => (
  <div style={style}>
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
    <PackageCard {...args} />
  </div>
);

const MinimalPackageCard = Template.bind({});
MinimalPackageCard.args = { ...defaultArgs };

const ReferencePackageCard = Template.bind({});
ReferencePackageCard.args = {
  ...defaultArgs,
  imageSrc: "/images/thomas.png",
  packageName: "MinisterAPI DeLuxe",
  author: "Gigamies5000",
  description:
    "h    deBrBzCsZqCrg1d jp  o  mhw xgrC roy lC1obeaCk rC  B thy1kkqzx0x10Y sgc1 tadzxg r fyAjukk ccyxx  of szx0asrCx  ZqB g qZnbiBmcfhzghtooZvyBk CCApkkdl  if  tpb h  puj wgakcckjrxB  fex uysjvtYjitb  e1ia c bynoZck poowyc   igp0tAfeC qlc deBj Z Zfg braecjb",
  lastUpdated: "3 days ago",
  downloadCount: "4,5M",
  likes: "1,342",
  size: "13 MB",
  categories: ["tweaks", "mods", "client-side"],
  link: "",
};

export { meta as default, MinimalPackageCard, ReferencePackageCard };
