import {
  CommunitiesLink,
  DiscordLogo,
  GitHubLogo,
  PackageUploadLink,
  TopBar as TopBarComponent,
  TopBarMenu,
  TopBarMenuLink,
} from "@thunderstore/components";

export const TopBar: React.FC = () => {
  return (
    <TopBarComponent>
      <PackageUploadLink variant="ts.topBar">Upload</PackageUploadLink>
      <CommunitiesLink variant="ts.topBar">Browse</CommunitiesLink>
      <TopBarMenu label="Login with…">
        <TopBarMenuLink icon={DiscordLogo} label="Discord" url="/" />
        <TopBarMenuLink icon={GitHubLogo} label="GitHub" url="/" />
      </TopBarMenu>
    </TopBarComponent>
  );
};
