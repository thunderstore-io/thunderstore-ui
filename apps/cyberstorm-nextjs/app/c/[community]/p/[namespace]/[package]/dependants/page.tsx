"use client";
import { PackageListLayout } from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useParams();

  return <PackageListLayout communityId={router["community"].toString()} />;
}
