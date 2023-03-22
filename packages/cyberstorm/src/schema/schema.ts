export interface CommunityData {
  name: string;
  nameSpace: string;
  imageSource?: string;
  packageCount: string;
  downloadCount: string;
  serverCount: string;
  description?: string;
  gitHubLink?: string;
}

type CommunityPreviewData = Pick<
  CommunityData,
  | "name"
  | "nameSpace"
  | "imageSource"
  | "packageCount"
  | "downloadCount"
  | "serverCount"
>;

export interface PackageData {
  name: string;
  nameSpace: string;
  description?: string;
  imageSrc: string;
  additionalImages?: string[];
  downloadCount: string;
  likes: string;
  size: string;
  author?: string;
  lastUpdated?: string;
  isPinned?: boolean;
  isNsfw?: boolean;
  isDeprecated?: boolean;
  categories?: string[];
  gitHubLink?: string;
  donationLink?: string;
  firstUploaded?: string;
  dependencyString?: string;
  dependencies?: string[]; // Package ids
  dependants?: string[]; // Package ids
  team: string; // Team id
}

type PackagePreviewData = Pick<
  PackageData,
  | "name"
  | "nameSpace"
  | "description"
  | "imageSrc"
  | "downloadCount"
  | "likes"
  | "size"
  | "author"
  | "lastUpdated"
  | "isPinned"
  | "isNsfw"
  | "isDeprecated"
  | "categories"
>;

export interface BadgeData {
  name: string;
  nameSpace: string;
  description: string;
  imageSource: string;
}

export interface AchievementData {
  name: string;
  nameSpace: string;
  description: string;
  imageSource: string;
}

export interface TeamData {
  name: string;
  nameSpace: string;
  description: string;
  about: string;
  members: string[]; // TeamMember ids
  serviceAccounts: string[]; // ServiceAccount ids
}

export interface TeamMember {
  user: string; // User id
  role: string;
}

export interface UserData {
  name: string;
  nameSpace: string;
  imageSource?: string;
  description?: string;
  about?: string;
  gitHubLink?: string;
  discordLink?: string;
  twitterLink?: string;
  accountCreated?: Date;
  lastActive?: Date;
  mods?: string[]; // Package ids
}

// TODO: figure out
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserSubscriptionData {}

export interface HomePageViewData {
  topCommunities: CommunityPreviewData[];
  featuredMods: PackagePreviewData[];
  firstTrendingMods: PackagePreviewData[];
  secondTrendingMods: PackagePreviewData[];
}

export interface CommunitiesViewData {
  communities: CommunityPreviewData[];
}

export interface PackageListViewData {
  communityInfo: CommunityData;
  packages: PackagePreviewData[];
}

export interface PackageDetailViewData {
  packageInfo: PackageData;
  dependencies: PackagePreviewData[];
}

export interface UserProfileViewData {
  userInfo: UserData;
  userSubscriptionInfo: UserSubscriptionData;
  teams: TeamData[];
  badges?: BadgeData[];
  achievements?: AchievementData[];
}

export interface UserSettingsViewData {
  userInfo: UserData;
  userSubscriptionInfo: UserSubscriptionData;
  teams: TeamData[];
  badges?: BadgeData[];
  achievements?: AchievementData[];
}

export interface TeamSettingsViewData {
  teamData: TeamData;
}

export interface PackageUploadViewData {
  teams: TeamData[]; // Team ids
  categories: string[];
}

export interface TermsOfServiceViewData {
  termsOfService: string;
  version: string;
  link: string;
  publishedDate: Date;
  isLatest: boolean;
}
