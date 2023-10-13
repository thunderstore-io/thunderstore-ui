import { CommunityProfileLayout } from "@thunderstore/cyberstorm";

export default function Page({ params }: { params: { community: string } }) {
  return <CommunityProfileLayout communityId={params.community} />;
}
