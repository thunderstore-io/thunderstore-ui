export interface Community {
  name: string;
  namespace: string;
  imageSource?: string;
  packageCount: string;
  downloadCount: string;
  serverCount: string;
  description?: string;
  gitHubLink?: string;
}

type CommunityPreview = Pick<
  Community,
  | "name"
  | "namespace"
  | "imageSource"
  | "packageCount"
  | "downloadCount"
  | "serverCount"
>;

export interface Package {
  name: string;
  namespace: string;
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

type PackagePreview = Pick<
  Package,
  | "name"
  | "namespace"
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

export interface Badge {
  name: string;
  namespace: string;
  description: string;
  imageSource: string;
}

export interface Achievement {
  name: string;
  namespace: string;
  description: string;
  imageSource: string;
}

export interface Team {
  name: string;
  namespace: string;
  description: string;
  about: string;
  members: string[]; // TeamMember ids
  serviceAccounts: string[]; // ServiceAccount ids
}

export interface TeamMember {
  user: string; // User id
  role: string;
}

export interface User {
  name: string;
  namespace: string;
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
export interface UserSubscription {}

export interface LegalContractVersion {
  title: string;
  content: string;
  slug: string;
  version: string;
  publishedDate: Date;
  isLatest: boolean;
}

type LegalContractVersionPreview = Pick<
  LegalContractVersion,
  "title" | "slug" | "version" | "publishedDate" | "isLatest"
>;

export interface HomePageView {
  topCommunities: CommunityPreview[];
  featuredMods: PackagePreview[];
  firstTrendingMods: PackagePreview[];
  secondTrendingMods: PackagePreview[];
}

export interface CommunitiesView {
  communities: CommunityPreview[];
}

export interface PackageListView {
  communityInfo: Community;
  packages: PackagePreview[];
}

export interface PackageDetailView {
  packageInfo: Package;
  dependencies: PackagePreview[];
}

export interface UserProfileView {
  userInfo: User;
  userSubscriptionInfo: UserSubscription;
  teams: Team[];
  badges?: Badge[];
  achievements?: Achievement[];
}

export interface UserSettingsView {
  userInfo: User;
  userSubscriptionInfo: UserSubscription;
  teams: Team[];
  badges?: Badge[];
  achievements?: Achievement[];
}

export interface TeamSettingsView {
  team: Team;
}

export interface PackageUploadView {
  teams: Team[]; // Team ids
  categories: string[];
}

export interface TermsOfServiceView {
  legalContract: LegalContractVersion;
}

export interface PrivacyPolicyView {
  legalContract: LegalContractVersion;
}

export interface TermsOfServiceHistoryView {
  legalContract: LegalContractVersionPreview[];
}

export interface PrivacyPolicyHistoryView {
  legalContract: LegalContractVersionPreview[];
}
