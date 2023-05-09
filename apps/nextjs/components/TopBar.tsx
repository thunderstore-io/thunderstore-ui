import { Button } from "@chakra-ui/react";
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

import { useSession } from "components/SessionContext";
import { OAuthManager } from "utils/oauth";

export function TopBar() {
  const { sessionId } = useSession();

  return (
    <TopBarComponent>
      {sessionId ? <AuthenticatedTopBar /> : <UnauthenticatedTopBar />}
    </TopBarComponent>
  );
}

function AuthenticatedTopBar() {
  const { clearSession } = useSession();

  return (
    <>
      <PackageUploadLink variant="ts.topBar">Upload</PackageUploadLink>
      <CommunitiesLink variant="ts.topBar">Browse</CommunitiesLink>
      <Button type="button" onClick={clearSession} variant="ts.topBar">
        Logout
      </Button>
    </>
  );
}

function UnauthenticatedTopBar() {
  return (
    <>
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
    </>
  );
}
