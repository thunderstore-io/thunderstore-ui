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

export const TopBar: React.FC = () => {
  const { sessionId } = useSession();

  return (
    <TopBarComponent>
      {sessionId ? <AuthenticatedTopBar /> : <UnauthenticatedTopBar />}
    </TopBarComponent>
  );
};

const AuthenticatedTopBar: React.FC = () => {
  const { clearSessionId } = useSession();

  return (
    <>
      <PackageUploadLink variant="ts.topBar">Upload</PackageUploadLink>
      <CommunitiesLink variant="ts.topBar">Browse</CommunitiesLink>
      <Button type="button" onClick={clearSessionId} variant="ts.topBar">
        Logout
      </Button>
    </>
  );
};

const UnauthenticatedTopBar: React.FC = () => (
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
