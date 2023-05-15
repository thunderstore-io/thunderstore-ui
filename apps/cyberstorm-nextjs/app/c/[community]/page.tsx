"use client";
import { PackageListLayout } from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useParams();
  const communityId = router ? router["community"].toString() : "";

  return <PackageListLayout communityId={communityId} />;
}
