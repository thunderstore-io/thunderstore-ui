import { DynamicLink } from "./utils";

export interface ServiceAccount {
  name: string;
  lastUsed: string;
}

export interface Team {
  name: string;
  members: TeamMember[];
  imageSource?: string;
  description?: string;
  about?: string;
  donationLink?: string;
  dynamicLinks?: DynamicLink[];
}

export interface TeamMember {
  user: string; // User id
  role: string;
  imageSource?: string;
}
