import { PackageDetailLayout } from "@thunderstore/cyberstorm";
import { useRouter } from "next/router";

export default function PackagePage() {
  const router = useRouter();
  const packageId = router.query.package as string;

  return (
    <>
      <PackageDetailLayout packageId={packageId} />
    </>
  );
}
