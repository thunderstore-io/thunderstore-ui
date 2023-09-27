import { DynamicLink } from "./shared";

export interface CurrentUser {
  username: string | null;
  capabilities: string[];
  connections: OAuthConnection[];
  rated_packages: string[];
  subscription: {
    expires: string | null;
  };
  teams: string[];
}

export interface User {
  name: string;
  imageSource?: string;
  description?: string;
  about?: string;
  accountCreated: string;
  lastActive: string;
  dynamicLinks?: DynamicLink[];
  achievements?: Achievement[];
  showAchievementsOnProfile?: boolean;
  badges?: Badge[];
  showBadgesOnProfile?: boolean;
}

export interface UserSettings extends User {
  achievements?: (Achievement & Setting)[];
  badges?: (Badge & Setting)[];
  connections: OAuthConnection[];
}

export interface OAuthConnection {
  provider: string;
  username: string;
  avatar: string | null;
}

interface Achievement {
  name: string;
  description: string;
  imageSource: string;
}

interface Badge {
  name: string;
  description: string;
  imageSource: string;
}

interface Setting {
  enabled: boolean;
}
