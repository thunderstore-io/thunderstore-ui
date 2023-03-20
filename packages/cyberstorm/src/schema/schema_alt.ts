export interface CommunityPreviewData {
  id: string; //url/link is based on this?
  name: string;
  imageSource: string;
  packageCount: string;
  downloadCount: string;
  serverCount: string;
}

export interface CommunityData {
  id: string; //url/link is based on this?
  name: string;
  imageSource: string;
  packageCount: string;
  downloadCount: string;
  serverCount: string;
  description: string;
  githubLink?: string;
}

export interface PackagePreviewData {
  id: string; //url/link is based on this?
  packageName: string;
  description?: string;
  imageSrc?: string;
  downloadCount: string;
  likes: string;
  size: string;
  author?: string;
  lastUpdated?: string;
  isPinned?: boolean;
  isNsfw?: boolean;
  isDeprecated?: boolean;
  categories: string[];
}

export interface PackageData {
  id: string; //url/link is based on this?
  packageName: string;
  description?: string;
  imageSrc?: string;
  downloadCount: string;
  likes: string;
  size: string;
  author?: string;
  lastUpdated?: string;
  isPinned?: boolean;
  isNsfw?: boolean;
  isDeprecated?: boolean;
  categories: string[];
  githubLink?: string;
  firstUploaded?: string;
}

export interface TeamMember {
  id: string; //url/link is based on this?
  imageSource: string;
  name: string;
  role: string;
}

export interface CommunitiesViewData {
  communities: Array<CommunityPreviewData>;
}

export interface PackageListViewData {
  communityInfo: CommunityData;
  packages: Array<PackagePreviewData>;
}

export interface PackageDetailViewData {
  packageInfo: PackageData;
  dependencies: Array<PackagePreviewData>;
  teamMembers: Array<TeamMember>;
}
