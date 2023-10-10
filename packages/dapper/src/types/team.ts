import { DynamicLink } from "./shared";

export interface ServiceAccount {
  name: string;
  lastUsed: string;
}

export interface TempServiceAccount {
  identifier: string;
  name: string;
  last_used: string | null;
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

export interface TeamDetails {
  identifier: number;
  name: string;
  donation_link: string | null;
}

export interface TeamMember {
  user: string; // User id
  role: string;
  imageSource?: string;
}

export interface TempTeamMember {
  identifier: number;
  username: string;
  avatar: string | null;
  role: "owner" | "member";
}
