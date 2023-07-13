import { PackageDetailLayout } from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useParams();

  return (
    <PackageDetailLayout
      community={router["community"].toString()}
      namespace={router["namespace"].toString()}
      packageName={router["package"].toString()}
    />
  );
}
