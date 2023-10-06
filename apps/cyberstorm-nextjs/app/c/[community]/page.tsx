import { PackageListLayout } from "@thunderstore/cyberstorm";

export default function Page({ params }: { params: { community: string } }) {
  return <PackageListLayout communityId={params.community} />;
}
