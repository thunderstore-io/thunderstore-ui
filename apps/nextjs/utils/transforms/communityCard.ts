import { CommunityCardProps } from "@thunderstore/components";

// Format received from the backend.
export interface BackendCommunityCard {
  download_count: number;
  bg_image_src: string | null;
  identifier: string;
  package_count: number;
  name: string;
}

// Transform data received from backend to format used by components.
export const communityCardToProps = (
  community: BackendCommunityCard
): CommunityCardProps => ({
  downloadCount: community.download_count,
  identifier: community.identifier,
  imageSrc: community.bg_image_src,
  packageCount: community.package_count,
  name: community.name,
});
