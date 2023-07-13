import { useParams } from "next/navigation";
import { UserProfileLayout } from "@thunderstore/cyberstorm";

export default function Page() {
  const router = useParams();
  const userId = router ? router["user"].toString() : "";

  return <UserProfileLayout userId={userId} />;
}
