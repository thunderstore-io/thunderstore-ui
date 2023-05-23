"use client";
import { PackageListLayout } from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

export type User = {
  id: number;
  name: string;
  email: string;
};

async function getPackages() {
  const res = await fetch("https://thunderstore.dev/api/experimental/package/");
  const packages = await res.json();
  return packages;
}

export default function Page() {
  const router = useParams();
  const communityId = router ? router["community"].toString() : "";

  const { data, isLoading, isFetching, error } = useQuery({
    queryFn: () => getPackages(),
  });

  console.log(data);

  return (
    <PackageListLayout
      packageData={data ? data.results : null}
      communityId={communityId}
    />
  );
}
