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
}

export interface CommunitiesViewData {
  communities: Array<CommunityData>; //only id, title, imageSource, packageCount, downloadCount, serverCount are needed
}

export interface PackageListViewData {
  communityInfo: CommunityData;
  packages: Array<PackageData>;
}
