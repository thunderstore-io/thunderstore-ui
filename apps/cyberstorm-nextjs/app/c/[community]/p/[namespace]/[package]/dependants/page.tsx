"use client";
import {
  PackageDependantsLayout,
  getPackageDummyData,
} from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useParams();
  const packageData = getPackageDummyData(
    "1337",
    router["community"].toString(),
    router["namespace"].toString(),
    router["package"].toString()
  );

  return <PackageDependantsLayout packageData={packageData} />;
}
