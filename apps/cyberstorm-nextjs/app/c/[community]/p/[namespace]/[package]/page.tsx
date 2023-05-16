"use client";
import { PackageDetailLayout } from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useParams();
  let packageId = "";
  if (router) {
    packageId = router["namespace"].toString() + router["package"].toString();
  }

  return <PackageDetailLayout packageId={packageId} />;
}
