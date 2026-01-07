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

export interface TeamMember {
  identifier: number;
  username: string;
  avatar: string | null;
  role: "owner" | "member";
}

export interface Team {
  identifier: number;
  name: string;
  donation_link: string | null;
}
