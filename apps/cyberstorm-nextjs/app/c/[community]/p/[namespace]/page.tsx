import { TeamProfileLayout } from "@thunderstore/cyberstorm";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string };
}) {
  const { community, namespace } = params;
  return <TeamProfileLayout community={community} namespace={namespace} />;
}
