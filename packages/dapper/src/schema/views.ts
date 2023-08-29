// TODO: none of the exports are used anywhere - is this still needed?
import {
  Achievement,
  Badge,
  Category,
  Community,
  PackagePreview,
  Package,
  Team,
  User,
  UserSubscription,
  CommunityPreview,
} from "./schema";

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
}

export interface CategoriesView {
  categories: Category[];
}
