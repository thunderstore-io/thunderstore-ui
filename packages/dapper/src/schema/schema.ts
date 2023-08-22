export interface Category {
  name: string;
  slug: string;
}

export interface CommunityPreview {
  name: string;
  identifier: string;

  total_download_count: number;
  total_package_count: number;
  total_server_count: number;
  portrait_image_url?: string | null;
}

export interface Community extends CommunityPreview {
  background_image_url?: string | null;

  description?: string | null;
  discord_url?: string | null;
}

export interface PackageVersion {
  version: string;
  changelog: string;
  uploadDate: string;
  downloadCount: number;
}

export interface PackageDependency {
  name: string;
  namespace: string;
  community: string;
  shortDescription: string;
  imageSource: string;
  version: string;
}

export interface PackagePreview {
  name: string;
  namespace: string;
  community: string;
  description?: string;
  imageSource?: string;
  downloadCount: number;
  likes: number;
  size: number;
  author?: string;
  lastUpdated: string;
  isPinned?: boolean;
  isNsfw?: boolean;
  isDeprecated?: boolean;
  categories: Category[]; // Category ids
}

export interface Package extends PackagePreview {
  shortDescription?: string;
  additionalImages?: string[];
  gitHubLink?: string;
  firstUploaded?: string;
  dependencyString: string;
  dependencies?: PackageDependency[];
  dependantCount: number; // Package ids
  team: PackageTeam;
  versions?: PackageVersion[];
}

export interface Server {
  name: string;
  namespace: string;
  community: string;
  description?: string;
  shortDescription?: string;
  imageSource?: string;
  likes: number;
  isPvp: boolean;
  hasPassword: boolean;
  address: string;
  author: string;
  packageCount: number;
  dynamicLinks?: dynamicLink[];
}

export type ServerPreview = Pick<
  Server,
  "name" | "imageSource" | "isPvp" | "hasPassword" | "packageCount"
>;

export interface Badge {
  name: string;
  description: string;
  imageSource: string;
}

export interface BadgeSetting extends Badge {
  enabled: boolean;
}

export interface Achievement {
  name: string;
  description: string;
  imageSource: string;
}

export interface AchievementSetting extends Achievement {
  enabled: boolean;
}

export interface dynamicLink {
  title: string;
  url: string;
}

export interface PackageTeam {
  name: string;
  members: TeamMember[];
}

export interface Team extends PackageTeam {
  imageSource?: string;
  description?: string;
  about?: string;
  dynamicLinks?: dynamicLink[];
  donationLink?: string;
}

export interface TeamSettings extends Team {
  serviceAccounts: string[]; // ServiceAccount ids
}

export type TeamPreview = Pick<Team, "name" | "members">;

export interface TeamMember {
  user: string; // User id
  imageSource?: string;
  role: string;
}

export interface ServiceAccount {
  name: string;
  lastUsed: string;
}

export interface Connection {
  name: string;
  connectedUsername: string;
  imageSource: string;
  enabled: boolean;
}

export interface User {
  name: string;
  imageSource?: string;
  description?: string;
  about?: string;
  accountCreated: string;
  lastActive: string;
  dynamicLinks?: dynamicLink[];
  achievements?: Achievement[];
  showAchievementsOnProfile?: boolean;
  badges?: Badge[];
  showBadgesOnProfile?: boolean;
}

export interface UserSettings extends User {
  achievements?: AchievementSetting[];
  badges?: BadgeSetting[];
  connections?: Connection[];
}

// TODO: figure out
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserSubscription {}

export interface Receipt {
  datetime: string;
  paymentId: string;
  cost: string;
  company: string;
  subscriptionName: string;
  paymentMethod: string;
}

export interface UserSubscription {
  name: string;
  cost: string;
  subscriptionId: string;
  isActive: boolean;
  imageSource: string;
  renewDate: string;
}
