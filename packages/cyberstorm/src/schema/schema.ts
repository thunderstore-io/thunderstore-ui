export interface Community {
  name: string;
  namespace: string;
  imageSource?: string;
  packageCount: number;
  downloadCount: number;
  serverCount: number;
  description?: string;
  gitHubLink?: string;
}

export type CommunityPreview = Pick<
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
  shortDescription?: string;
  imageSource: string;
  additionalImages?: string[];
  downloadCount: number;
  likes: number;
  size: number;
  author?: string;
  lastUpdated?: string;
  isPinned?: boolean;
  isNsfw?: boolean;
  isDeprecated?: boolean;
  gitHubLink?: string;
  donationLink?: string;
  firstUploaded?: string;
  dependencyString?: string;
  categories: string[]; // Category ids
  dependencies?: string[]; // Package ids
  dependants?: string[]; // Package ids
  team: string; // Team id
}

export type PackagePreview = Pick<
  Package,
  | "name"
  | "namespace"
  | "description"
  | "imageSource"
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
  imageSource: string;
  description: string;
  about: string;
  members: string[]; // TeamMember ids
  serviceAccounts: string[]; // ServiceAccount ids
}

export interface Category {
  slug: string;
  label: string;
}

export interface TeamMember {
  user: string; // User id
  role: string;
}

export interface ServiceAccount {
  name: string;
  lastUsed: string;
}

export interface User {
  name: string;
  namespace: string;
  imageSource: string;
  description?: string;
  about?: string;
  gitHubLink?: string;
  discordLink?: string;
  twitterLink?: string;
  accountCreated?: string;
  lastActive?: string;
  mods?: string[]; // Package ids
}

// TODO: figure out
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserSubscription {}
