import { PackageListLayout } from "@thunderstore/cyberstorm";
import { useRouter } from "next/router";

export default function CommunityPage() {
  const router = useRouter();
  const communityId = router.query.community as string;

  return (
    <>
      <PackageListLayout communityId={communityId} />
    </>
  );
}
