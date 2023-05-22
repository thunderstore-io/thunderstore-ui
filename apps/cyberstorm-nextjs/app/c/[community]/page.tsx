"use client";
import { PackageListLayout, PackagePreview } from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

export type User = {
  id: number;
  name: string;
  email: string;
};

async function getPackages() {
  const res = await fetch(
    "https://thunderstore.io/api/experimental/frontend/c/valheim/packages/"
  );
  const packages = (await res.json()) as PackagePreview[];
  return packages;
}

export default function Page() {
  const router = useParams();
  const communityId = router ? router["community"].toString() : "";

  const { data, isLoading, isFetching, error } = useQuery({
    queryFn: () => getPackages(),
  });

  console.log(data);

  return <PackageListLayout communityId={communityId} />;
}
