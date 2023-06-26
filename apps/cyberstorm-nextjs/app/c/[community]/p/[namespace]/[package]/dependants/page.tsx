"use client";
import {
  PackageDetailLayout,
  PackageListLayout,
} from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useParams();

  return (
    <PackageListLayout
      community={router["community"].toString()}
      namespace={router["namespace"].toString()}
      packageName={router["package"].toString()}
    />
  );
}
