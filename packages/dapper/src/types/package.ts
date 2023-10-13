import { TeamMember } from "./team";

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
  categories: {
    name: string;
    slug: string;
  }[];
}

export interface Package extends PackagePreview {
  shortDescription?: string;
  additionalImages?: string[];
  gitHubLink?: string;
  firstUploaded?: string;
  dependencyString: string;
  dependencies?: PackageDependency[];
  dependantCount: number;
  team: PackageTeam;
  versions?: PackageVersion[];
}

export interface PackageDependency {
  name: string;
  namespace: string;
  community: string;
  shortDescription: string;
  imageSource?: string;
  version: string;
}

interface PackageTeam {
  name: string;
  members: TeamMember[];
}

interface PackageVersion {
  version: string;
  changelog: string;
  uploadDate: string;
  downloadCount: number;
}
