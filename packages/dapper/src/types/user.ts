import { DynamicLink } from "./shared";

export interface CurrentUser {
  username: string | null;
  capabilities: string[];
  connections: OAuthConnection[];
  subscription: {
    expires: string | null;
  };
  teams: string[];
  teams_full: {
    name: string;
    role: string;
    member_count: number;
  }[];
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
