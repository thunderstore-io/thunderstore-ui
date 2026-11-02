export interface ServiceAccount {
  identifier: string;
  name: string;
  last_used: string | null;
}

export interface TeamDetails {
  identifier: number;
  name: string;
  donation_link: string | null;
}

export interface TeamCommunity {
  identifier: string;
  name: string;
  community_icon_url: string | null;
  package_count: number;
  download_count: number;
  rating_count: number;
}

export interface TeamMember {
  identifier: number;
  username: string;
  avatar: string | null;
  role: "owner" | "member";
}
