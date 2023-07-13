import { PackageListLayout } from "@thunderstore/cyberstorm";

export type User = {
  id: number;
  name: string;
  email: string;
};

export default function Page({ params }: { params: { community: string } }) {
  return <PackageListLayout communityId={params.community} />;
}
