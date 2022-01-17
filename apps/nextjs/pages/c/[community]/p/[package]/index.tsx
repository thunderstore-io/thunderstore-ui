import {
  PackageActions,
  PackageActionsProps,
  PackageDependency,
  PackageHeader,
  PackageHeaderProps,
  PackageInfo,
  PackageInfoProps,
  PackageRequirements,
  PackageVersion,
  PackageVersions,
} from "@thunderstore/components";
import { useMediaQuery } from "@thunderstore/hooks";
import { GetServerSideProps } from "next";

import { Background } from "components/Background";
import {
  ContentWrapper,
  FULL_WIDTH_BREAKPOINT,
  LayoutWrapper,
} from "components/Wrapper";

interface PackageProps
  extends PackageActionsProps,
    PackageHeaderProps,
    PackageInfoProps {
  requirements: PackageDependency[];
  versions: PackageVersion[];
}

interface PageProps {
  package: PackageProps;
}

export default function PackageDetailPage(props: PageProps): JSX.Element {
  const pkg = props.package;
  const isFullWidth = useMediaQuery(`(min-width: ${FULL_WIDTH_BREAKPOINT})`);

  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <LayoutWrapper variant="article">
          <PackageHeader {...pkg} renderFullWidth={!isFullWidth} />
        </LayoutWrapper>
        <LayoutWrapper variant="aside">
          <PackageActions {...pkg} renderFullWidth={!isFullWidth} />
        </LayoutWrapper>
        <LayoutWrapper variant="article">
          <PackageInfo {...pkg} />
        </LayoutWrapper>
        <LayoutWrapper variant="aside">
          <PackageRequirements requirements={pkg.requirements} mb="30px" />
          <PackageVersions {...pkg} />
        </LayoutWrapper>
      </ContentWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // TODO: validate the community & package exist in database.
  if (!context.params?.community || !context.params?.package) {
    return { notFound: true };
  }

  return {
    props: {
      package: getFakeData(), // TODO
    },
  };
};

const now = Date.now();
const day = 86400000;

const getFakeData = (): Omit<PackageProps, "renderFullWidth"> => ({
  communityName: "Risk of Rain 2",
  dependantCount: 28,
  dependencyString: "Gnome-ChefMod-2.0.15",
  description:
    "Adds the CHEF robot from RoR1 as a survivor. Multiplayer-compatible!",
  downloadCount: 245111867,
  imageSrc: "https://api.lorem.space/image/game?w=256&h=256",
  lastUpdated: new Date(now - 2 * day).toISOString(),
  latestVersion: "2.0.15",
  likeCount: 32,
  markdown: `
# ChefMod

CHEF is a robot cook who is capable of serving generous helpings
to even the largest crowds. Supports StandaloneAncientScepter!

![](https://i.imgur.com/SFP5RIj.jpeg)
![](https://i.imgur.com/lyhIDFe.jpeg)
![](https://i.imgur.com/eqp6HDQ.png)

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

![](https://cdn.discordapp.com/attachments/399901440023330816/927507210026745956/texServbotIcon.png)
![](https://cdn.discordapp.com/attachments/399901440023330816/927507210563645500/texBottleIcon.png)
![](https://cdn.discordapp.com/attachments/399901440023330816/927507746725715988/texVaseIcon.png)
![](https://cdn.discordapp.com/attachments/399901440023330816/927507211012411392/texKnifeIcon.png)
![](https://cdn.discordapp.com/attachments/399901440023330816/927507209640882176/texPhoneIcon.png)
`,
  packageName: "ChefMod",
  packageNamespace: "Gnome",
  requirements: [
    {
      communityName: "bbepis",
      description:
        "Unified BepInEx all-in-one modding pack - plugin framework, detour library",
      imageSrc: "https://api.lorem.space/image/game?w=100&h=100",
      packageName: "BepInExPack",
      preferredVersion: "5.4.9",
    },
    {
      communityName: "tristanmcpherson",
      description: "A modding API for Risk of Rain 2",
      imageSrc: null,
      packageName: "R2API",
      preferredVersion: "3.0.52",
    },
  ],
  tags: [
    { id: "3", label: "Mods" },
    { id: "8", label: "Player Characters" },
  ],
  teamName: "Gnome",
  url: "https://github.com/GnomeModder/ChefMod",
  versions: [
    {
      downloadCount: Math.floor(Math.random() * 100000),
      uploaded: new Date(now - 2 * day).toISOString(),
      version: "2.0.15",
    },
    {
      downloadCount: Math.floor(Math.random() * 100000),
      uploaded: new Date(now - 5 * day).toISOString(),
      version: "2.0.14",
    },
    {
      downloadCount: Math.floor(Math.random() * 100000),
      uploaded: new Date(now - 15 * day).toISOString(),
      version: "2.0.13",
    },
    {
      downloadCount: Math.floor(Math.random() * 100000),
      uploaded: new Date(now - 50 * day).toISOString(),
      version: "2.0.5",
    },
    {
      downloadCount: Math.floor(Math.random() * 100000),
      uploaded: new Date(now - 100 * day).toISOString(),
      version: "2.0.0",
    },
    {
      downloadCount: Math.floor(Math.random() * 100000),
      uploaded: new Date(now - 400 * day).toISOString(),
      version: "1.0.99",
    },
  ],
});
