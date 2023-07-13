import { PackageListLayout } from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";

export type User = {
  id: number;
  name: string;
  email: string;
};

// This page is very WIP, it's purpose for now is to demonstrate doing
// a React Query Data fetch.

export default function Page() {
  const router = useParams();
  const communityId = router ? router["community"].toString() : "";

  return <PackageListLayout communityId={communityId} />;
}
