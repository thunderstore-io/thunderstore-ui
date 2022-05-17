import {
  CommunitiesLink,
  DiscordLogo,
  GitHubLogo,
  PackageUploadLink,
  TopBar as TopBarComponent,
  TopBarMenu,
  TopBarMenuButton,
} from "@thunderstore/components";
import Router from "next/router";

import { OAuthManager } from "utils/oauth";

export const TopBar: React.FC = () => {
  return (
    <TopBarComponent>
      <PackageUploadLink variant="ts.topBar">Upload</PackageUploadLink>
      <CommunitiesLink variant="ts.topBar">Browse</CommunitiesLink>
      <TopBarMenu label="Login with…">
        <TopBarMenuButton
          icon={DiscordLogo}
          label="Discord"
          onClick={async () =>
            Router.push(await OAuthManager.getProviderLoginUrl("discord"))
          }
        />
        <TopBarMenuButton
          icon={GitHubLogo}
          label="GitHub"
          onClick={async () =>
            Router.push(await OAuthManager.getProviderLoginUrl("github"))
          }
        />
      </TopBarMenu>
    </TopBarComponent>
  );
};
