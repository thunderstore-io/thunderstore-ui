import { Box } from "@chakra-ui/react";
import { PackageInfo } from "@thunderstore/components";
import { StoryFn, Meta } from "@storybook/react";
import React from "react";

export default { component: PackageInfo } as Meta;

const Template: StoryFn<typeof PackageInfo> = (args) => (
  <Box maxWidth="1080px">
    <PackageInfo {...args} />
  </Box>
);

const Info = Template.bind({});
Info.args = {
  markdown: `
  # ChefMod

  CHEF is a robot cook who is capable of serving generous helpings
  to even the largest crowds. Supports StandaloneAncientScepter!

  ![](/img/decorative-1000x1000.jpg)
  ![](/img/decorative-2000x200.jpg)
  ![](/img/decorative-128x128.jpg)

  If you have any feedback/suggestions, open an issue on the Github page,
  or join our discord at [https://discord.gg/pKE3QCEsxG](https://discord.gg/pKE3QCEsxG)

  ## Installation

  Drop ChefMod.dll into \\BepInEx\\plugins
  All players need the mod.

  ## To Do

  - Add config option to keep CHEF bossfight after completing the unlock.
  - Character select animation.
  - More alt skills.
  - Balancing. Feedback is greatly appreciated!

  ## Changelog

  \`2.0.15\`

  - Added alt lore when the alt victory message config option is enabled.
    (Credits to Lyrical Endymion)

  \`2.0.14\`

  - Fully reset the Oil Combine config option. It now should be off by default.
  - Fixed Oil spamming explosions when Oil Combine is disabled.
  - Slightly reduced Oil network load.
  - Nerfed Oil.
      - Tickrate reduced -50%
      - Damage reduced 25% -> 15%
      - If Oil Combine is enabled, max combined oil tickrate 20x -> 12x (untested).

  _Oil was doing too much passive damage on top of CHEF's already-high DPS
  so its been nerfed into being more of a secondary damage skill to
  supplement your existing DPS. Also the Oil Combine config option was
  causing it to have even higher DPS than intended, so the config option
  has been fully reset and disabled._

  ### BepInEx Framework

  The zip looks like:

      \\BepInExPack    <----- move the contents of this folder
      manifest.json
      readme.md
      icon.png

  ### Primary: Throw Evidence

  ![](/img/decorative-128x128.jpg)
  ![](/img/decorative-128x128.jpg)
  ![](/img/decorative-128x128.jpg)
  ![](/img/decorative-128x128.jpg)
  ![](/img/decorative-128x128.jpg)
  `,
};

export { Info as PackageInfo };
