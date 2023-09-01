import { DynamicLink } from "./shared";

export type Server = {
  name: string;
  namespace: string;
  community: string;
  description?: string;
  shortDescription?: string;
  imageSource?: string;
  likes: number;
  isPvp: boolean;
  hasPassword: boolean;
  address: string;
  author: string;
  packageCount: number;
  dynamicLinks?: DynamicLink[];
};

export type ServerPreview = Pick<
  Server,
  "name" | "imageSource" | "isPvp" | "hasPassword" | "packageCount"
>;
